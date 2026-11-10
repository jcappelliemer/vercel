#!/usr/bin/env python3
import concurrent.futures
import html
import json
import os
import re
import sys
import unicodedata
import urllib.error
import urllib.request
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse


BASE = os.environ.get("HEADLESS_AUDIT_BASE", "http://127.0.0.1:4191").rstrip("/")
WP_HOST = os.environ.get(
    "HEADLESS_AUDIT_WP_HOST",
    "wordpress-jc4e.srv1502079.hstgr.cloud",
)
PUBLIC_ORIGIN = os.environ.get(
    "HEADLESS_AUDIT_PUBLIC_ORIGIN",
    os.environ.get("NEXT_PUBLIC_SITE_URL", "https://www.solarisfilms.it"),
).rstrip("/")
REQUIRE_BADGE = os.environ.get("HEADLESS_AUDIT_REQUIRE_BADGE", "0") == "1"
EXPECT_NOINDEX = os.environ.get("HEADLESS_AUDIT_EXPECT_NOINDEX", "1").lower() not in {
    "0",
    "false",
    "no",
}
TECHNICAL_HOSTS = {
    WP_HOST,
    "solarisfilms.vercel.app",
}


def norm_text(value):
    value = re.sub(r"<[^>]+>", " ", str(value or ""))
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def norm_path(value):
    path = urlparse(str(value or "")).path or "/"
    if not path.startswith("/"):
        path = "/" + path
    if path != "/" and not path.endswith("/"):
        path += "/"
    return path


def manifest_key(value):
    path = norm_path(value)
    return "/" if path == "/" else path.rstrip("/")


def is_authority_question(value):
    text = unicodedata.normalize("NFD", norm_text(value).lower())
    text = "".join(char for char in text if unicodedata.category(char) != "Mn")
    return "autorita" in text or "authority" in text


def question_key(value):
    value = html.unescape(str(value or ""))
    value = value.replace("‘", "'").replace("’", "'").replace("ʼ", "'")
    value = value.replace("“", '"').replace("”", '"').lower()
    value = re.sub(r"\s+", " ", value)
    return re.sub(r"[\s?!.:]+$", "", value).strip()


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = []
        self.in_title = False
        self.in_body = False
        self.skip_depth = 0
        self.body_chunks = []
        self.metas = []
        self.h1_count = 0
        self.classes = []
        self.testids = []
        self.hrefs = []
        self.in_jsonld = False
        self.jsonld_buffer = []
        self.jsonld = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.in_title = True
        if tag == "body":
            self.in_body = True
        if self.in_body and tag in ("script", "style", "noscript"):
            self.skip_depth += 1
        if tag == "meta":
            self.metas.append({str(k).lower(): str(v or "") for k, v in attrs.items()})
        if tag == "h1":
            self.h1_count += 1
        if attrs.get("class"):
            self.classes.extend(str(attrs["class"]).split())
        if attrs.get("data-testid"):
            self.testids.append(str(attrs["data-testid"]))
        if tag == "a" and attrs.get("href"):
            self.hrefs.append(str(attrs["href"]))
        if tag == "script" and str(attrs.get("type", "")).lower() == "application/ld+json":
            self.in_jsonld = True
            self.jsonld_buffer = []

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "body":
            self.in_body = False
        if self.in_body and tag in ("script", "style", "noscript") and self.skip_depth:
            self.skip_depth -= 1
        if tag == "script" and self.in_jsonld:
            raw = "".join(self.jsonld_buffer).strip()
            if raw:
                try:
                    self.jsonld.append(json.loads(raw))
                except json.JSONDecodeError:
                    self.jsonld.append({"_invalid": raw[:120]})
            self.in_jsonld = False
            self.jsonld_buffer = []

    def handle_data(self, data):
        if self.in_title:
            self.title.append(data)
        if self.in_jsonld:
            self.jsonld_buffer.append(data)
        if self.in_body and not self.skip_depth:
            self.body_chunks.append(data)


def meta_value(parser, name):
    name = name.lower()
    for attrs in reversed(parser.metas):
        if attrs.get("name", "").lower() == name:
            return attrs.get("content", "")
    return ""


def canonical_href(value):
    parsed = urlparse(urljoin(BASE + "/", html.unescape(str(value or ""))))
    query = "?" + parsed.query if parsed.query else ""
    fragment = "#" + parsed.fragment if parsed.fragment else ""
    return f"{parsed.scheme.lower()}://{parsed.netloc.lower()}{norm_path(parsed.path)}{query}{fragment}"


def expected_internal_href(value):
    parsed = urlparse(urljoin(BASE + "/", html.unescape(str(value or ""))))
    if (parsed.hostname or "").lower() == WP_HOST.lower():
        public = urlparse(PUBLIC_ORIGIN)
        if public.scheme and public.netloc:
            parsed = parsed._replace(scheme=public.scheme, netloc=public.netloc)
    return canonical_href(parsed.geturl())


def html_hrefs(value):
    parser = PageParser()
    parser.feed(str(value or ""))
    return [expected_internal_href(href) for href in parser.hrefs]


def schema_types(value):
    found = []
    if isinstance(value, list):
        for item in value:
            found.extend(schema_types(item))
    elif isinstance(value, dict):
        kind = value.get("@type")
        if isinstance(kind, list):
            found.extend(str(item) for item in kind)
        elif kind:
            found.append(str(kind))
        for item in value.values():
            if isinstance(item, (dict, list)):
                found.extend(schema_types(item))
    return found


def faq_items(entry):
    raw = (entry.get("aeo") or {}).get("faq") or []
    if isinstance(raw, str):
        try:
            raw = json.loads(raw)
        except json.JSONDecodeError:
            raw = []
    out = []
    for item in raw if isinstance(raw, list) else []:
        if not isinstance(item, dict):
            continue
        question = item.get("q") or item.get("question") or item.get("name") or ""
        answer = item.get("a") or item.get("answer") or item.get("text") or ""
        if norm_text(question) and not is_authority_question(question):
            out.append((norm_text(question), norm_text(answer)))
    return out


def fetch(path, entry):
    url = urljoin(BASE, norm_path(path).lstrip("/"))
    request = urllib.request.Request(url, headers={"User-Agent": "OrchestraHeadlessQAAudit/1.0"})
    try:
        response = urllib.request.urlopen(request, timeout=20)
        status = response.status
        final_url = response.geturl()
        headers = dict(response.headers.items())
        body = response.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as error:
        status = error.code
        final_url = error.geturl()
        headers = dict(error.headers.items())
        body = error.read().decode("utf-8", "replace")
    except Exception as error:
        return {"path": path, "status": 0, "error": str(error)}

    parser = PageParser()
    parser.feed(body)
    visible = norm_text(" ".join(parser.body_chunks))
    meta = entry.get("meta") or {}
    expected_faq = faq_items(entry)
    actual_types = set(schema_types(parser.jsonld))
    expected_types = set(schema_types((entry.get("aeo") or {}).get("schema_jsonld")))
    if expected_faq:
        expected_types.add("FAQPage")
    if (entry.get("aeo") or {}).get("organization"):
        expected_types.add("Organization")

    expected_meta = {
        "title": norm_text(meta.get("title")),
        "description": norm_text(meta.get("description")),
        "keywords": norm_text(meta.get("keywords")),
    }
    actual_meta = {
        "title": norm_text("".join(parser.title)),
        "description": norm_text(meta_value(parser, "description")),
        "keywords": norm_text(meta_value(parser, "keywords")),
    }
    meta_checks = {
        key: (not expected or actual_meta[key] == expected)
        for key, expected in expected_meta.items()
    }

    visible_question_key = question_key(visible)
    questions_visible = [q for q, _ in expected_faq if question_key(q) in visible_question_key]
    questions_missing = [q for q, _ in expected_faq if question_key(q) not in visible_question_key]
    trust = (entry.get("aeo") or {}).get("trust_signals") or []
    if isinstance(trust, str):
        try:
            trust = json.loads(trust)
        except json.JSONDecodeError:
            trust = [trust]
    normalized_trust = []
    for item in trust:
        if isinstance(item, dict):
            item = item.get("label") or item.get("text") or item.get("title") or item.get("value") or item.get("name") or ""
        item = norm_text(item)
        if item:
            normalized_trust.append(item)
    trust = normalized_trust
    trust_visible = [item for item in trust if item in visible]
    snippet_text = norm_text((entry.get("aeo") or {}).get("snippet_html"))
    authority_text = norm_text((entry.get("aeo") or {}).get("authority_html"))
    intro_rewrite = (entry.get("aeo") or {}).get("intro_rewrite") or {}
    intro_after = norm_text(intro_rewrite.get("after_html")) if isinstance(intro_rewrite, dict) else ""
    internal_links_html = (entry.get("aeo") or {}).get("internal_links_html") or ""
    internal_links_text = norm_text(internal_links_html)
    expected_internal_hrefs = set(html_hrefs(internal_links_html))
    actual_hrefs = set(canonical_href(href) for href in parser.hrefs)
    missing_internal_hrefs = sorted(expected_internal_hrefs - actual_hrefs)
    robots = meta_value(parser, "robots").lower()
    xrobots = headers.get("X-Robots-Tag", headers.get("x-robots-tag", "")).lower()

    return {
        "path": path,
        "status": status,
        "final_path": norm_path(final_url),
        "redirected": norm_path(final_url) != norm_path(path),
        "xrobots_noindex": "noindex" in xrobots,
        "meta_robots_noindex": "noindex" in robots,
        "meta_robots_indexable": "index" in robots and "noindex" not in robots,
        "h1_count": parser.h1_count,
        "meta_checks": meta_checks,
        "schema_expected": sorted(expected_types),
        "schema_actual": sorted(actual_types),
        "schema_missing": sorted(expected_types - actual_types),
        "faq_expected": len(expected_faq),
        "faq_visible": len(questions_visible),
        "faq_missing": questions_missing,
        "trust_expected": len(trust),
        "trust_visible": len(trust_visible),
        "snippet_expected": bool(snippet_text),
        "snippet_visible": not snippet_text or snippet_text in visible,
        "authority_expected": bool(authority_text),
        "authority_section": "authority-section" in parser.testids,
        "intro_expected": bool(intro_after),
        "intro_visible": not intro_after or intro_after in visible,
        "internal_links_expected": bool(internal_links_text or expected_internal_hrefs),
        "internal_links_visible": not internal_links_text or internal_links_text in visible,
        "internal_links_section": "internal-links-section" in parser.testids,
        "internal_links_missing_hrefs": missing_internal_hrefs,
        "badge": "seo-aeo-optimized-badge" in parser.classes,
        "wp_host_in_html": WP_HOST in body,
        "technical_hosts_in_html": sorted(host for host in TECHNICAL_HOSTS if host in body),
        "body_bytes": len(body.encode("utf-8")),
    }


def main():
    manifest_path = Path(sys.argv[1] if len(sys.argv) > 1 else "src/data/orchestra-fixes.json")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    source_entries = manifest.get("byPath") or {}
    if not isinstance(source_entries, dict) or not source_entries:
        print(json.dumps({"error": "Orchestra manifest has no byPath entries"}, indent=2))
        raise SystemExit(1)
    entries = dict(source_entries)
    alias_path = Path(
        sys.argv[2]
        if len(sys.argv) > 2
        else manifest_path.with_name("orchestra-route-aliases.json")
    )
    alias_entries = 0
    if alias_path.exists():
        aliases = json.loads(alias_path.read_text(encoding="utf-8"))
        for alias, source in aliases.items():
            alias_key = manifest_key(alias)
            source_key = manifest_key(source)
            if alias_key in entries or source_key not in source_entries:
                continue
            entries[alias_key] = source_entries[source_key]
            alias_entries += 1
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(lambda item: fetch(*item), entries.items()))

    live = [item for item in results if item.get("status") == 200]
    direct = [item for item in live if not item.get("redirected")]
    redirected = [item for item in live if item.get("redirected")]
    failed = [item for item in results if item.get("status") != 200]
    meta_fail = [item for item in direct if not all(item["meta_checks"].values())]
    schema_fail = [item for item in direct if item["schema_missing"]]
    faq_fail = [item for item in direct if item["faq_visible"] != item["faq_expected"]]
    trust_fail = [item for item in direct if item["trust_visible"] != item["trust_expected"]]
    snippet_fail = [item for item in direct if item["snippet_expected"] and not item["snippet_visible"]]
    intro_fail = [item for item in direct if item["intro_expected"] and not item["intro_visible"]]
    internal_links_fail = [
        item for item in direct
        if item["internal_links_expected"] and (
            not item["internal_links_visible"]
            or not item["internal_links_section"]
            or item["internal_links_missing_hrefs"]
        )
    ]
    authority_fail = [item for item in direct if not item["authority_section"]]
    badge_fail = [item for item in direct if REQUIRE_BADGE and not item["badge"]]
    if EXPECT_NOINDEX:
        robots_header_fail = [item for item in results if not item.get("xrobots_noindex")]
        robots_meta_fail = [item for item in live if not item.get("meta_robots_noindex")]
    else:
        robots_header_fail = [item for item in results if item.get("xrobots_noindex")]
        robots_meta_fail = [item for item in live if not item.get("meta_robots_indexable")]
    h1_fail = [item for item in live if item["h1_count"] != 1]
    wp_host_fail = [item for item in live if item["wp_host_in_html"]]
    technical_host_fail = [item for item in live if item["technical_hosts_in_html"]]
    summary = {
        "source_manifest_entries": len(source_entries),
        "resolved_alias_entries": alias_entries,
        "manifest_entries": len(entries),
        "status_counts": dict(sorted(Counter(item.get("status", 0) for item in results).items())),
        "direct_live": len(direct),
        "redirected_live": len(redirected),
        "robots_expectation": "noindex" if EXPECT_NOINDEX else "indexable",
        "xrobots_noindex": sum(item.get("xrobots_noindex", False) for item in results),
        "meta_robots_noindex_live": sum(item.get("meta_robots_noindex", False) for item in live),
        "meta_robots_indexable_live": sum(item.get("meta_robots_indexable", False) for item in live),
        "one_h1_live": sum(item.get("h1_count") == 1 for item in live),
        "meta_exact_direct": len(direct) - len(meta_fail),
        "schema_types_direct": len(direct) - len(schema_fail),
        "faq_visible_direct": len(direct) - len(faq_fail),
        "trust_visible_direct": len(direct) - len(trust_fail),
        "snippet_visible_direct": sum(item["snippet_expected"] and item["snippet_visible"] for item in direct),
        "snippet_expected_direct": sum(item["snippet_expected"] for item in direct),
        "intro_visible_direct": sum(item["intro_expected"] and item["intro_visible"] for item in direct),
        "intro_expected_direct": sum(item["intro_expected"] for item in direct),
        "internal_links_visible_direct": sum(
            item["internal_links_expected"] and not item["internal_links_missing_hrefs"]
            and item["internal_links_visible"] and item["internal_links_section"]
            for item in direct
        ),
        "internal_links_expected_direct": sum(item["internal_links_expected"] for item in direct),
        "authority_section_direct": sum(item["authority_section"] for item in direct),
        "badge_required": REQUIRE_BADGE,
        "badge_direct": sum(item["badge"] for item in direct),
        "wp_host_leaks_live": sum(item["wp_host_in_html"] for item in live),
        "technical_host_leaks_live": sum(bool(item["technical_hosts_in_html"]) for item in live),
        "failures": {
            "http": [{"path": item["path"], "status": item["status"], "error": item.get("error")} for item in failed],
            "redirected": [{"path": item["path"], "final_path": item["final_path"]} for item in redirected],
            "meta": [{"path": item["path"], "checks": item["meta_checks"]} for item in meta_fail],
            "schema": [{"path": item["path"], "missing": item["schema_missing"]} for item in schema_fail],
            "faq": [{"path": item["path"], "expected": item["faq_expected"], "visible": item["faq_visible"], "missing": item["faq_missing"]} for item in faq_fail],
            "trust": [{"path": item["path"], "expected": item["trust_expected"], "visible": item["trust_visible"]} for item in trust_fail],
            "snippet": [item["path"] for item in snippet_fail],
            "intro": [item["path"] for item in intro_fail],
            "internal_links": [
                {
                    "path": item["path"],
                    "visible": item["internal_links_visible"],
                    "section": item["internal_links_section"],
                    "missing_hrefs": item["internal_links_missing_hrefs"],
                }
                for item in internal_links_fail
            ],
            "authority": [item["path"] for item in authority_fail],
            "badge": [item["path"] for item in badge_fail],
            "robots_header": [item["path"] for item in robots_header_fail],
            "robots_meta": [item["path"] for item in robots_meta_fail],
            "h1": [{"path": item["path"], "count": item["h1_count"]} for item in h1_fail],
            "wp_host": [item["path"] for item in wp_host_fail],
            "technical_host": [
                {"path": item["path"], "hosts": item["technical_hosts_in_html"]}
                for item in technical_host_fail
            ],
        },
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))

    critical_failures = (
        failed
        or meta_fail
        or schema_fail
        or faq_fail
        or trust_fail
        or snippet_fail
        or intro_fail
        or internal_links_fail
        or authority_fail
        or badge_fail
        or robots_header_fail
        or robots_meta_fail
        or h1_fail
        or technical_host_fail
    )
    if critical_failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
