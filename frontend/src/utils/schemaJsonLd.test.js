import {
  hasSchemaType,
  sanitizeProductSchemaJsonLd,
  sanitizeSchemaJsonLdText,
} from './schemaJsonLd';
import { buildProductSchema } from '../components/SEO';

describe('Product JSON-LD sanitation', () => {
  test('removes an incomplete Product while preserving the rest of a graph', () => {
    const value = {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', '@id': 'https://example.test/#organization' },
        { '@type': 'Product', name: 'No price', offers: { '@type': 'Offer', priceCurrency: 'EUR' } },
      ],
    };

    const cleaned = sanitizeProductSchemaJsonLd(value);

    expect(hasSchemaType(cleaned, 'Product')).toBe(false);
    expect(hasSchemaType(cleaned, 'Organization')).toBe(true);
    expect(cleaned['@graph']).toHaveLength(1);
  });

  test('keeps a Product only when an offer declares a price', () => {
    const product = {
      '@type': 'Product',
      name: 'Priced product',
      offers: { '@type': 'Offer', price: '49.00', priceCurrency: 'EUR' },
    };

    expect(sanitizeProductSchemaJsonLd(product)).toEqual(product);
    expect(sanitizeProductSchemaJsonLd(product, { removeProducts: true })).toBeNull();
  });

  test('rewrites schema identity URLs without changing descriptive text', () => {
    const source = 'https://wordpress.example.test';
    const target = 'https://www.example.test';
    const cleaned = sanitizeProductSchemaJsonLd({
      '@type': 'WebPage',
      '@id': `${source}/product/#webpage`,
      url: `${source}/product/`,
      description: `Imported from ${source}/product/`,
    }, { sourceOrigin: source, targetOrigin: target });

    expect(cleaned['@id']).toBe(`${target}/product/#webpage`);
    expect(cleaned.url).toBe(`${target}/product/`);
    expect(cleaned.description).toContain(source);
  });

  test('sanitizes serialized JSON-LD and fails soft on non-JSON input', () => {
    const input = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [{ '@type': 'Product', name: 'No offer' }],
    });

    expect(sanitizeSchemaJsonLdText(input)).toBeNull();
    expect(sanitizeSchemaJsonLdText('{not-json')).toBe('{not-json');
  });

  test('the legacy product builder fails closed without a real price', () => {
    const product = {
      nome: 'Technical film',
      slug: 'technical-film',
      categoria: 'Antisolari',
      descrizione: 'Technical product description.',
    };

    expect(buildProductSchema(product)).toBeNull();
    expect(buildProductSchema({ ...product, price: '49,00' })).toMatchObject({
      '@type': 'Product',
      offers: {
        '@type': 'Offer',
        price: '49.00',
        priceCurrency: 'EUR',
      },
    });
  });
});
