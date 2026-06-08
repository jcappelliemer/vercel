import Script from 'next/script';
import { useEffect } from 'react';

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-JVXJ62Q76Z';

export const LEAD_EVENTS = {
  clickTel: 'click_tel',
  clickEmail: 'click_email',
  clickWhatsapp: 'click_whatsapp',
  contactSubmit: 'form_contatti_submit',
  quoteSubmit: 'form_preventivo_submit',
};

export function trackEvent(eventName, parameters = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', eventName, parameters);
}

function getClickEvent(anchor) {
  const href = anchor.getAttribute('href') || '';
  const testId = anchor.getAttribute('data-testid') || '';

  if (href.startsWith('tel:')) {
    return { eventName: LEAD_EVENTS.clickTel, method: 'phone', href };
  }

  if (href.startsWith('mailto:')) {
    return { eventName: LEAD_EVENTS.clickEmail, method: 'email', href };
  }

  if (
    href.includes('wa.me') ||
    href.includes('api.whatsapp.com') ||
    href.includes('/api/fast-contact') ||
    testId.includes('whatsapp')
  ) {
    return { eventName: LEAD_EVENTS.clickWhatsapp, method: 'whatsapp', href };
  }

  return null;
}

export default function Analytics() {
  useEffect(() => {
    const handleClick = (event) => {
      const anchor = event.target.closest('a[href]');
      if (!anchor) {
        return;
      }

      const clickEvent = getClickEvent(anchor);
      if (!clickEvent) {
        return;
      }

      trackEvent(clickEvent.eventName, {
        event_category: 'lead',
        method: clickEvent.method,
        link_url: clickEvent.href,
        page_path: window.location.pathname,
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname
          });
        `}
      </Script>
    </>
  );
}
