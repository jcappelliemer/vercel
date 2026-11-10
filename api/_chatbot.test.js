const assert = require('node:assert/strict');
const test = require('node:test');

const { sendCrmLead } = require('./_chatbot');

const lead = {
  name: 'Test Headless',
  email: 'test@example.invalid',
  phone: '',
  company: 'Solaris Test',
  message: 'Lead di collaudo',
  source_page: 'https://www.solarisfilms.it/',
  source_site: 'www.solarisfilms.it',
};

test('uses the public contact form when no webhook key is configured', async (t) => {
  const previousFetch = global.fetch;
  const previousKey = process.env.CRM_WEBHOOK_KEY;
  delete process.env.CRM_WEBHOOK_KEY;
  t.after(() => {
    global.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.CRM_WEBHOOK_KEY;
    else process.env.CRM_WEBHOOK_KEY = previousKey;
  });

  let request;
  global.fetch = async (url, options) => {
    request = { url, options };
    return { ok: true, status: 200 };
  };

  const result = await sendCrmLead(lead, 'chatbot');
  assert.equal(result.status, 'sent');
  assert.equal(result.transport, 'public-form');
  assert.match(request.url, /\/public\/forms\/contact\/plain$/);
  assert.match(request.options.body, /privacy_acceptance=true/);
  assert.match(request.options.body, /form_code=chatbot/);
});

test('falls back to the public form when the protected webhook rejects the request', async (t) => {
  const previousFetch = global.fetch;
  const previousKey = process.env.CRM_WEBHOOK_KEY;
  process.env.CRM_WEBHOOK_KEY = 'test-key';
  t.after(() => {
    global.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.CRM_WEBHOOK_KEY;
    else process.env.CRM_WEBHOOK_KEY = previousKey;
  });

  const urls = [];
  global.fetch = async (url) => {
    urls.push(url);
    return urls.length === 1
      ? { ok: false, status: 503 }
      : { ok: true, status: 200 };
  };

  const result = await sendCrmLead(lead, 'chatbot');
  assert.equal(result.status, 'sent');
  assert.equal(urls.length, 2);
  assert.match(urls[0], /\/webhook\/wordpress-lead$/);
  assert.match(urls[1], /\/public\/forms\/contact\/plain$/);
});
