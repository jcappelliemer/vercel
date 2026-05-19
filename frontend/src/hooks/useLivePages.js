import { useEffect, useMemo, useState } from 'react';
import { isExcludedSolarisPage } from '../utils/liveContent';

export function useLivePages(initialPages = []) {
  const [pages, setPages] = useState(initialPages);
  const [loading, setLoading] = useState(!initialPages.length);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    if (initialPages.length) {
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    fetch('/wp-data/live-pages-index.json')
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (!mounted) return;
        setPages((data.pages || []).filter((page) => !isExcludedSolarisPage(page)));
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [initialPages]);

  const stats = useMemo(() => pages.reduce((acc, page) => {
    const type = page.route?.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {}), [pages]);

  return { pages, loading, error, stats };
}
