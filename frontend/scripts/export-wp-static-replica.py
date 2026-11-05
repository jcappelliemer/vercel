#!/usr/bin/env python3
"""Export a running Solaris Next build into the WordPress static replica format."""

import argparse
import concurrent.futures
import json
import shutil
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse


CORE_PATHS = {
    "/",
    "/about",
    "/company-profile",
    "/contatti",
    "/faq",
    "/focus-tecnico",
    "/guida-tecnica",
    "/info",
    "/lo-sapevi-che",
    "/mappa-sito",
    "/preventivo",
    "/privacy-policy",
    "/prodotti",
    "/servizi",
    "/servizio-locale",
}

SKIP_PREFIXES = (
    "/_next/",
    "/api/",
    "/wp-admin",
    "/wp-login.php",
    "/wp-json/",
)

PAGE_FILE_SUFFIXES = {
    ".css", ".gif", ".ico", ".jpeg", ".jpg", ".js", ".json", ".map",
    ".mp4", ".pdf", ".png", ".svg", ".txt", ".webm", ".webp", ".woff",
    ".woff2", ".xml", ".zip",
}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag != "a":
            return
        values = dict(attrs)
        if values.get("href"):
            self.links.append(values["href"])


def normalize_path(value):
    parsed = urlparse(str(value or "/"))
    path = parsed.path or "/"
    if not path.startswith("/"):
        path = "/" + path
    while "//" in path:
        path = path.replace("//", "/")
    if path != "/":
        path = path.rstrip("/")
    if ".." in path.split("/"):
        raise ValueError(f"Unsafe route path: {value}")
    return path or "/"


def is_page_path(path):
    if any(path.startswith(prefix) for prefix in SKIP_PREFIXES):
        return False
    suffix = Path(path).suffix.lower()
    return suffix not in PAGE_FILE_SUFFIXES


def load_json(path, default):
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else default


def output_html_path(site_root, route):
    if route == "/":
        return site_root / "index.html"
    return site_root.joinpath(*route.strip("/").split("/"), "index.html")


def output_data_path(data_root, route):
    if route == "/":
        return data_root / "index.json"
    parts = route.strip("/").split("/")
    return data_root.joinpath(*parts[:-1], f"{parts[-1]}.json")


def fetch(opener, url, timeout):
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "SolarisStaticReplicaExporter/0.2"},
    )
    try:
        response = opener.open(request, timeout=timeout)
        return response.status, dict(response.headers.items()), response.read()
    except urllib.error.HTTPError as error:
        return error.code, dict(error.headers.items()), error.read()
    except Exception as error:
        return 0, {}, str(error).encode("utf-8", "replace")


def internal_path(href, base, internal_hosts):
    value = str(href or "").strip()
    if not value or value.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
        return None
    parsed = urlparse(urljoin(base + "/", value))
    if parsed.scheme not in ("http", "https") or parsed.hostname not in internal_hosts:
        return None
    path = normalize_path(parsed.path)
    return path if is_page_path(path) else None


def compiled_rules(routes_manifest):
    redirects = {}
    for rule in routes_manifest.get("redirects", []):
        if rule.get("has") or rule.get("missing"):
            continue
        source = normalize_path(rule.get("source", "/"))
        redirects[source] = {
            "source": source,
            "destination": rule.get("destination", "/"),
            "statusCode": int(rule.get("statusCode") or 308),
        }

    gone = set()
    rewrites = routes_manifest.get("rewrites") or {}
    rewrite_rules = []
    if isinstance(rewrites, list):
        rewrite_rules = rewrites
    elif isinstance(rewrites, dict):
        for key in ("beforeFiles", "afterFiles", "fallback"):
            rewrite_rules.extend(rewrites.get(key) or [])
    for rule in rewrite_rules:
        if rule.get("destination") == "/api/gone":
            gone.add(normalize_path(rule.get("source", "/")))
    return redirects, gone


def route_inputs(frontend_root):
    orchestra_path = frontend_root / "src" / "data" / "orchestra-fixes.json"
    aliases_path = frontend_root / "src" / "data" / "orchestra-route-aliases.json"
    live_index_path = frontend_root / "public" / "wp-data" / "live-pages-index.json"

    orchestra = load_json(orchestra_path, {"byPath": {}})
    aliases = load_json(aliases_path, {})
    live_index = load_json(live_index_path, {"pages": []})

    orchestra_paths = {normalize_path(path) for path in (orchestra.get("byPath") or {})}
    alias_paths = {normalize_path(path) for path in aliases}
    source_paths = {normalize_path(path) for path in aliases.values()}
    live_paths = set()
    canonical_paths = set()
    for page in live_index.get("pages") or []:
        if page.get("path"):
            live_paths.add(normalize_path(page["path"]))
        if (page.get("route") or {}).get("newPath"):
            canonical_paths.add(normalize_path(page["route"]["newPath"]))

    seeds = CORE_PATHS | orchestra_paths | alias_paths | source_paths | live_paths | canonical_paths
    return {
        "seeds": {path for path in seeds if is_page_path(path)},
        "orchestra": orchestra_paths,
        "canonical": canonical_paths | alias_paths | CORE_PATHS,
        "orchestra_count": len(orchestra_paths),
        "alias_count": len(alias_paths),
    }


def clean_output(output_root):
    resolved = output_root.resolve()
    if "static-replica" not in resolved.name and "static-replica" not in str(resolved.parent):
        raise RuntimeError(f"Refusing to replace unsafe output directory: {resolved}")
    if resolved.exists():
        shutil.rmtree(resolved)
    resolved.mkdir(parents=True)
    return resolved


def export_pages(args, inputs, redirects, gone, output_root):
    opener = urllib.request.build_opener(NoRedirect)
    base = args.base.rstrip("/")
    internal_hosts = {
        urlparse(base).hostname,
        "solarisfilms.it",
        "www.solarisfilms.it",
        "solarisfilms.vercel.app",
    }
    pending = set(inputs["seeds"])
    seen = set()
    saved = set()
    observed_redirects = {}
    observed_gone = set()
    failures = {}
    site_root = output_root / "site"

    while pending:
        batch = sorted(pending - seen)[: args.workers * 4]
        if not batch:
            break
        if len(seen) + len(batch) > args.max_routes:
            raise RuntimeError(f"Route discovery exceeded --max-routes={args.max_routes}")
        seen.update(batch)

        def fetch_route(route):
            return route, fetch(opener, f"{base}{route if route == '/' else route + '/'}", args.timeout)

        with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
            results = list(executor.map(fetch_route, batch))

        for route, (status, headers, body) in results:
            content_type = headers.get("Content-Type", headers.get("content-type", ""))
            if status == 200 and "text/html" in content_type:
                target = output_html_path(site_root, route)
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(body)
                saved.add(route)
                parser = LinkParser()
                parser.feed(body.decode("utf-8", "replace"))
                for href in parser.links:
                    discovered = internal_path(href, base, internal_hosts)
                    if discovered and discovered not in seen:
                        pending.add(discovered)
                continue

            if status in (301, 302, 303, 307, 308):
                location = headers.get("Location", headers.get("location", ""))
                observed_redirects[route] = {
                    "source": route,
                    "destination": location or "/",
                    "statusCode": status,
                }
                destination = internal_path(location, base, internal_hosts)
                if destination and destination not in seen:
                    pending.add(destination)
                continue

            if status == 410:
                observed_gone.add(route)
                continue

            failures[route] = {
                "status": status,
                "detail": body.decode("utf-8", "replace")[:160],
            }

        pending.difference_update(batch)

    redirects.update(observed_redirects)
    gone.update(observed_gone)
    return saved, seen, failures


def export_next_data(args, frontend_root, saved, output_root):
    build_id_path = frontend_root / ".next" / "BUILD_ID"
    if not build_id_path.exists():
        return "", 0, []
    build_id = build_id_path.read_text(encoding="utf-8").strip()
    opener = urllib.request.build_opener(NoRedirect)
    base = args.base.rstrip("/")
    data_root = output_root / "_next" / "data" / build_id
    saved_count = 0
    missing = []

    def fetch_data(route):
        data_path = "index.json" if route == "/" else f"{route.strip('/')}.json"
        return route, fetch(opener, f"{base}/_next/data/{build_id}/{data_path}", args.timeout)

    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        results = list(executor.map(fetch_data, sorted(saved)))
    for route, (status, headers, body) in results:
        if status == 200 and "json" in headers.get("Content-Type", headers.get("content-type", "")):
            target = output_data_path(data_root, route)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(body)
            saved_count += 1
        else:
            missing.append(route)
    return build_id, saved_count, missing


def copy_assets(frontend_root, output_root):
    next_static = frontend_root / ".next" / "static"
    public = frontend_root / "public"
    if not next_static.exists():
        raise RuntimeError("Missing .next/static; run a production build first")
    shutil.copytree(next_static, output_root / "_next" / "static", dirs_exist_ok=True)
    if public.exists():
        shutil.copytree(public, output_root / "public", dirs_exist_ok=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="http://127.0.0.1:4195")
    parser.add_argument("--frontend-root", default=str(Path(__file__).resolve().parents[1]))
    parser.add_argument("--out", default="artifacts/solaris-static-replica")
    parser.add_argument("--public-origin", default="https://www.solarisfilms.it")
    parser.add_argument("--git-commit", default="unknown")
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--timeout", type=int, default=45)
    parser.add_argument("--max-routes", type=int, default=600)
    args = parser.parse_args()

    frontend_root = Path(args.frontend_root).resolve()
    output_root = clean_output(Path(args.out))
    routes_manifest = load_json(frontend_root / ".next" / "routes-manifest.json", {})
    redirects, gone = compiled_rules(routes_manifest)
    inputs = route_inputs(frontend_root)
    saved, attempted, failures = export_pages(args, inputs, redirects, gone, output_root)
    copy_assets(frontend_root, output_root)
    build_id, data_count, data_missing = export_next_data(args, frontend_root, saved, output_root)

    accepted = saved | set(redirects) | gone
    missing_orchestra = sorted(inputs["orchestra"] - accepted)
    missing_canonical = sorted(inputs["canonical"] - saved)
    if missing_orchestra or missing_canonical:
        print(json.dumps({
            "missing_orchestra": missing_orchestra,
            "missing_canonical": missing_canonical,
            "failures": failures,
        }, indent=2), file=sys.stderr)
        raise SystemExit(1)

    manifest = {
        "version": "0.2.0",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "site": {
            "origin": args.public_origin,
            "sourceBase": args.base,
            "gitCommit": args.git_commit,
            "buildId": build_id,
            "totalSaved": len(saved),
            "totalAttempted": len(attempted),
            "orchestraPaths": inputs["orchestra_count"],
            "routeAliases": inputs["alias_count"],
            "nextDataSaved": data_count,
            "nextDataMissing": len(data_missing),
            "nextDataMissingPaths": sorted(data_missing),
        },
        "savedPaths": sorted(saved),
        "redirects": [redirects[key] for key in sorted(redirects)],
        "gone": sorted(gone),
        "failures": failures,
    }
    (output_root / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(manifest["site"], indent=2))


if __name__ == "__main__":
    main()
