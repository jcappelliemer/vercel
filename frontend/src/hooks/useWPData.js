import { useState, useEffect } from 'react';
import { fetchProdotti, fetchFocusTecnici, fetchPagineInfo, fetchCitta } from '../data/wpApi';
import { prodottiData, focusTecnicoData, pagineInfoData, cittaData } from '../data/siteContent';

/**
 * Hook that fetches data from WordPress API with static fallback.
 * If REACT_APP_WP_URL is not set, uses static data directly.
 */
export function useWPData(type) {
  const [data, setData] = useState(getStaticData(type));
  const [loading, setLoading] = useState(!!process.env.REACT_APP_WP_URL);

  useEffect(() => {
    if (!process.env.REACT_APP_WP_URL) return;

    const fetchers = {
      prodotti: fetchProdotti,
      focus: fetchFocusTecnici,
      info: fetchPagineInfo,
      citta: fetchCitta,
    };

    const fetcher = fetchers[type];
    if (!fetcher) return;

    fetcher().then(result => {
      if (result && result.length > 0) {
        setData(result);
      }
      setLoading(false);
    });
  }, [type]);

  return { data, loading };
}

function getStaticData(type) {
  switch (type) {
    case 'prodotti': return prodottiData;
    case 'focus': return focusTecnicoData;
    case 'info': return pagineInfoData;
    case 'citta': return cittaData;
    default: return [];
  }
}
