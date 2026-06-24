import { useLocation } from "react-router-dom";
import fixes from "../data/orchestra-fixes.json";

function normalizePath(pathname) {
  const rawPath = (pathname || "/").split("#")[0].split("?")[0] || "/";
  const withLeadingSlash = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  if (withLeadingSlash === "/") {
    return "/";
  }
  return withLeadingSlash.replace(/\/+$/, "");
}

function readAeoScore(entry) {
  const score = entry?.score || entry?.scores || entry?.aeo_score || null;
  if (!score) {
    return null;
  }

  const rawValue =
    typeof score === "number"
      ? score
      : score.aeo ?? score.AEO ?? score.aeo_score ?? score.aeoScore;
  const value = Number(rawValue);

  return Number.isFinite(value) ? Math.round(value) : null;
}

export default function AeoOrchestraBadge() {
  const location = useLocation();
  const path = normalizePath(location.pathname);
  const fallbackPath = path === "/" ? null : `${path}/`;
  const entry = fixes?.byPath?.[path] || (fallbackPath ? fixes?.byPath?.[fallbackPath] : null);
  const aeoScore = readAeoScore(entry);

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
      {aeoScore !== null ? (
        <span className="aeo-orchestra-badge__score">AEO {aeoScore}/100</span>
      ) : null}
      <span className="aeo-orchestra-badge__arrow" aria-hidden="true">
        &rarr;
      </span>
    </a>
  );
}
