import { useEffect, useMemo, useState } from 'react';

export function useLivePages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetch('/wp-data/live-pages-index.json')
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (!mounted) return;
        setPages(data.pages || []);
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
  }, []);

  const stats = useMemo(() => pages.reduce((acc, page) => {
    const type = page.route?.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {}), [pages]);

  return { pages, loading, error, stats };
}
