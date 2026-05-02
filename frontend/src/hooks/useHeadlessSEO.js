import { useEffect, useMemo, useState } from 'react';
import { normalizePath } from '../utils/liveContent';

const SLASH_RE = /\/+$/;

const pathVariants = (page, currentPath) => {
  const values = [
    currentPath,
    page?.route?.newPath,
    page?.path,
  ].filter(Boolean);

  return new Set(values.map(normalizePath));
};

const slugFromPath = (path = '') => normalizePath(path)
  .replace(SLASH_RE, '')
  .split('/')
  .filter(Boolean)
  .pop();

export function useHeadlessSEO(currentPath, page) {
  const [seoMap, setSeoMap] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetch('/wp-data/headless-seo.json')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (mounted) setSeoMap(data);
      })
      .catch(() => {
        if (mounted) setSeoMap(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return useMemo(() => {
    const items = seoMap?.items || [];
    if (!items.length) return null;

    const candidates = pathVariants(page, currentPath);
    const exact = items.find((item) => candidates.has(normalizePath(item.path)));
    if (exact) return exact;

    const currentSlug = slugFromPath(currentPath);
    const pageSlug = slugFromPath(page?.route?.newPath || page?.path);
    const slugs = new Set([currentSlug, pageSlug].filter(Boolean));

    return items.find((item) => slugs.has(item.slug)) || null;
  }, [seoMap, currentPath, page]);
}

export function mergeHeadlessSEO(page, headlessSEO) {
  if (!page || !headlessSEO) return page;

  return {
    ...page,
    seo: {
      ...(page.seo || {}),
      title: headlessSEO.title || page.seo?.title,
      description: headlessSEO.description || page.seo?.description,
      robots: headlessSEO.robots || page.seo?.robots,
    },
    headlessSEO,
  };
}
