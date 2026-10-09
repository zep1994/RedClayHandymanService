export async function onRequestPost({ request, env }) {
  const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Request origin not allowed.' }, 403);
  if (!request.headers.get('Content-Type')?.includes('application/json')) return json({ error: 'Expected JSON.' }, 415);
  if (Number(request.headers.get('Content-Length')) > 20000) return json({ error: 'Request too large.' }, 413);
  let data;
  try {
    const body = await request.text();
    if (body.length > 20000) return json({ error: 'Request too large.' }, 413);
    data = JSON.parse(body);
  } catch { return json({ error: 'Invalid request.' }, 400); }
  if (!data || typeof data !== 'object') return json({ error: 'Invalid request.' }, 400);
  if (data.website) return json({ ok: true });
  const fields = ['name', 'email', 'phone', 'location', 'service', 'message'];
  const limits = [100, 200, 40, 150, 150, 5000];
  for (const field of ['date', 'size']) {
    if (data[field] !== undefined && (typeof data[field] !== 'string' || data[field].length > 100)) return json({ error: 'Invalid project preferences.' }, 400);
  }
  if (fields.some((field, i) => typeof data[field] !== 'string' || !data[field].trim() || data[field].length > limits[i])) return json({ error: 'Please complete all fields with valid information.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return json({ error: 'Please enter a valid email address.' }, 400);
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) return json({ error: 'Email delivery is not yet configured. Please try again later.' }, 503);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.CONTACT_FROM_EMAIL, to: [env.CONTACT_TO_EMAIL], reply_to: data.email.trim(), subject: `Red Clay estimate: ${data.service.replace(/[\r\n]/g, ' ')}`, text: [...fields, ...['date', 'size'].filter(field => data[field])].map(field => `${field.toUpperCase()}:\n${data[field].trim()}`).join('\n\n') }),
    });
    if (!response.ok) return json({ error: 'Your request could not be delivered. Please try again later.' }, 502);
    return json({ ok: true });
  } catch { return json({ error: 'Your request could not be delivered. Please try again later.' }, 502); }
}
export function onRequestGet() { return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } }); }

