const assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const test = require('node:test');

const { parsePublicForm, proxyPublicForm } = require('./_publicForms');

async function formRequest(form, method = 'POST') {
  const source = new Request('http://localhost/form', { method: 'POST', body: form });
  const body = Buffer.from(await source.arrayBuffer());
  const req = Readable.from([body]);
  req.method = method;
  req.headers = {
    'content-type': source.headers.get('content-type'),
    'content-length': String(body.length),
  };
  return req;
}

function responseRecorder() {
  const headers = new Map();
  return {
    statusCode: 0,
    body: null,
    setHeader(name, value) { headers.set(name.toLowerCase(), value); },
    getHeader(name) { return headers.get(name.toLowerCase()); },
    end(body = '') { this.body = Buffer.isBuffer(body) ? body : Buffer.from(String(body)); },
  };
}

test('normalizes multiple browser attachments for the CRM contract', async () => {
  const form = new FormData();
  form.append('privacy_acceptance', 'true');
  form.append('attachment_image[]', new File(['one'], 'one.txt', { type: 'text/plain' }));
  form.append('attachment_image[]', new File(['two'], 'two.txt', { type: 'text/plain' }));

  const parsed = await parsePublicForm(await formRequest(form));
  assert.equal(parsed.getAll('attachment_image').length, 2);
  assert.equal(parsed.getAll('attachment_image[]').length, 0);
});

test('proxies the contact form and preserves the upstream response', async (t) => {
  const previousFetch = global.fetch;
  t.after(() => { global.fetch = previousFetch; });

  let forwarded;
  global.fetch = async (url, options) => {
    forwarded = { url, options };
    return new Response(JSON.stringify({ ok: true, lead_id: 'lead-proxy-test' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  const form = new FormData();
  form.append('first_name', 'Test');
  form.append('privacy_acceptance', 'true');
  const res = responseRecorder();
  await proxyPublicForm(await formRequest(form), res, 'contact');

  assert.equal(res.statusCode, 200);
  assert.match(forwarded.url, /\/public\/forms\/contact\/plain$/);
  assert.equal(forwarded.options.body.get('first_name'), 'Test');
  assert.equal(JSON.parse(res.body.toString()).lead_id, 'lead-proxy-test');
});

test('rejects missing consent before contacting the CRM', async () => {
  const form = new FormData();
  form.append('first_name', 'Test');
  const res = responseRecorder();
  await proxyPublicForm(await formRequest(form), res, 'quote');
  assert.equal(res.statusCode, 422);
  assert.match(res.body.toString(), /Privacy non accettata/);
});
