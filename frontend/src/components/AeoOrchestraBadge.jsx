import { useRouter } from "next/router";
import fixes from "../data/orchestra-fixes.json";

function normalizePath(pathname) {
  const rawPath = (pathname || "/").split("#")[0].split("?")[0] || "/";
  const withLeadingSlash = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  if (withLeadingSlash === "/") {
    return "/";
  }
  return withLeadingSlash.replace(/\/+$/, "");
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const num = Number(value);
  return Number.isFinite(num) ? Math.round(num) : null;
}

function readScoreLabel(entry) {
  const score = entry?.score || entry?.scores || entry?.aeo_score || null;
  if (!score) {
    return null;
  }

  if (typeof score === "number" || typeof score === "string") {
    const value = numberOrNull(score);
    return value === null ? null : `AEO ${value}/100`;
  }

  const seoScore = numberOrNull(score.seo ?? score.SEO ?? score.seo_score ?? score.seoScore);
  const aeoScore = numberOrNull(score.aeo ?? score.AEO ?? score.aeo_score ?? score.aeoScore);

  if (seoScore !== null && aeoScore !== null) {
    return `SEO ${seoScore} / AEO ${aeoScore}`;
  }

  if (aeoScore !== null) {
    return `AEO ${aeoScore}/100`;
  }

  if (seoScore !== null) {
    return `SEO ${seoScore}/100`;
  }

  return null;
}

export default function AeoOrchestraBadge() {
  const router = useRouter();
  const path = normalizePath(router.asPath || router.pathname || "/");
  const fallbackPath = path === "/" ? null : `${path}/`;
  const entry = fixes?.byPath?.[path] || (fallbackPath ? fixes?.byPath?.[fallbackPath] : null);
  const scoreLabel = readScoreLabel(entry);

  return (
    <a
      className="aeo-orchestra-badge"
      href="https://aeo-orchestra.com"
      target="_blank"
      rel="noopener"
      aria-label="Sito ottimizzato con AEO Orchestra per la citabilita nelle AI"
    >
      <span className="aeo-orchestra-badge__mark">AEO</span>
      <span className="aeo-orchestra-badge__body">
        <span className="aeo-orchestra-badge__brand">Ottimizzato con AEO Orchestra</span>
        <span className="aeo-orchestra-badge__text">Citabile dalle AI</span>
        <span className="aeo-orchestra-badge__detail">
          ChatGPT, Claude, Gemini, Perplexity
        </span>
      </span>
      {scoreLabel ? (
        <span className="aeo-orchestra-badge__score">{scoreLabel}</span>
      ) : null}
      <span className="aeo-orchestra-badge__arrow" aria-hidden="true">
        &rarr;
      </span>
    </a>
  );
}
