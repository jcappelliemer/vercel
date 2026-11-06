const SCHEMA_IDENTITY_URL_KEYS = new Set(['@id', 'url', 'mainEntityOfPage', 'item']);

const schemaTypes = (schema) => [].concat(schema?.['@type'] || []);

export function hasSchemaType(schema, type) {
  if (!schema) return false;
  if (Array.isArray(schema)) return schema.some((item) => hasSchemaType(item, type));
  if (typeof schema !== 'object') return false;
  if (schemaTypes(schema).includes(type)) return true;
  return Object.values(schema).some((item) => hasSchemaType(item, type));
}

const hasPriceValue = (value) => value !== null
  && value !== undefined
  && String(value).trim() !== '';

const offerHasPrice = (offer) => {
  if (!offer || typeof offer !== 'object') return false;
  if (hasPriceValue(offer.price) || hasPriceValue(offer.lowPrice)) return true;
  const specifications = [].concat(offer.priceSpecification || []);
  return specifications.some((item) => item && typeof item === 'object' && hasPriceValue(item.price));
};

export function hasPricedProductOffer(schema) {
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return false;
  return [].concat(schema.offers || []).some(offerHasPrice);
}

const normalizedOrigin = (value) => {
  try {
    return new URL(String(value || '')).origin;
  } catch {
    return '';
  }
};

const rewriteIdentityUrl = (value, sourceOrigin, targetOrigin, key) => {
  if (typeof value !== 'string' || !SCHEMA_IDENTITY_URL_KEYS.has(key)) return value;
  try {
    const parsed = new URL(value);
    if (!sourceOrigin || parsed.origin !== sourceOrigin) return value;
    return `${targetOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return value;
  }
};

export function sanitizeProductSchemaJsonLd(value, options = {}, key = '') {
  const sourceOrigin = normalizedOrigin(options.sourceOrigin);
  const targetOrigin = normalizedOrigin(options.targetOrigin);

  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => sanitizeProductSchemaJsonLd(item, options, key))
      .filter((item) => item !== null && item !== undefined);
    return cleaned.length ? cleaned : null;
  }

  if (!value || typeof value !== 'object') {
    return sourceOrigin && targetOrigin
      ? rewriteIdentityUrl(value, sourceOrigin, targetOrigin, key)
      : value;
  }

  if (schemaTypes(value).includes('Product')) {
    if (options.removeProducts || !hasPricedProductOffer(value)) return null;
  }

  const cleaned = {};
  Object.entries(value).forEach(([childKey, childValue]) => {
    const nextValue = sanitizeProductSchemaJsonLd(childValue, options, childKey);
    if (nextValue !== null && nextValue !== undefined) cleaned[childKey] = nextValue;
  });

  if (Object.keys(cleaned).length === 1 && cleaned['@context']) return null;
  return cleaned;
}

export function sanitizeSchemaJsonLdText(value, options = {}) {
  if (typeof value !== 'string') return null;
  try {
    const cleaned = sanitizeProductSchemaJsonLd(JSON.parse(value), options);
    return cleaned ? JSON.stringify(cleaned) : null;
  } catch {
    return value;
  }
}

const schemaTypeSlug = (value) => [].concat(value || ['schema'])
  .map((item) => String(item || '').trim().toLowerCase())
  .filter(Boolean)
  .join('-')
  .replace(/[^a-z0-9-]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'schema';

const rootSchemaId = (canonicalUrl, schema, schemaIndex, nodeIndex) => (
  `${String(canonicalUrl || '').replace(/#.*$/, '')}`
  + `#${schemaTypeSlug(schema?.['@type'])}-${schemaIndex + 1}-${nodeIndex + 1}`
);

const addRootSchemaIds = (value, canonicalUrl, schemaIndex) => {
  const addId = (schema, nodeIndex) => {
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return schema;
    if (!schema['@type'] || schema['@id']) return schema;
    return {
      ...schema,
      '@id': rootSchemaId(canonicalUrl, schema, schemaIndex, nodeIndex),
    };
  };

  if (Array.isArray(value)) {
    return value.map((schema, nodeIndex) => addId(schema, nodeIndex));
  }
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value['@graph'])) {
    return {
      ...value,
      '@graph': value['@graph'].map((schema, nodeIndex) => addId(schema, nodeIndex)),
    };
  }
  return addId(value, 0);
};

export function ensureSchemaRootIds(value, canonicalUrl, schemaIndex = 0) {
  if (!canonicalUrl) return value;
  if (typeof value !== 'string') return addRootSchemaIds(value, canonicalUrl, schemaIndex);

  try {
    return JSON.stringify(addRootSchemaIds(JSON.parse(value), canonicalUrl, schemaIndex));
  } catch {
    return value;
  }
}
