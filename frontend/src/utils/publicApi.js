const DEFAULT_CRM_API = 'https://crm.solarisfilms.it/api';

export const getPublicCrmApiBase = () => (
  process.env.REACT_APP_CRM_API_URL
  || process.env.REACT_APP_PUBLIC_CRM_API_URL
  || DEFAULT_CRM_API
).replace(/\/$/, '');

export const appendSourceFields = (payload, formCode) => {
  if (formCode) payload.append('form_code', formCode);
  if (typeof window !== 'undefined') {
    payload.append('source_page', window.location.href);
    payload.append('source_site', window.location.hostname || 'solarisfilms.it');
  } else {
    payload.append('source_site', 'solarisfilms.it');
  }
};
