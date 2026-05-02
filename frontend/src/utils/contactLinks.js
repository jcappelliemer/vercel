export const normalizeWhatsAppNumber = (value, fallback = '393925466518') => {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return fallback;
  if (digits.startsWith('39')) return digits;
  if (digits.length === 10 && digits.startsWith('3')) return `39${digits}`;
  return digits;
};

export const buildWhatsAppHref = (number, message = '') => {
  const normalized = normalizeWhatsAppNumber(number);
  const suffix = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${normalized}${suffix}`;
};
