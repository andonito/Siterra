export const config = { path: '/api/studio-auth' };

/**
 * Verifies the Style Studio password against the STUDIO_PASSWORD env var.
 * The password never ships in the client bundle — only this server check knows it.
 */
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ ok: false }, 405);
  }

  const expected = process.env.STUDIO_PASSWORD;
  if (!expected) {
    return json({ ok: false, error: 'Studio is not configured.' }, 500);
  }

  let password = '';
  try {
    const body = await req.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return json({ ok: false }, 400);
  }

  if (timingSafeEqual(password, expected)) {
    return json({ ok: true });
  }
  return json({ ok: false }, 401);
}

// Length-independent constant-time string comparison.
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  const len = Math.max(ab.length, bb.length);
  let diff = ab.length ^ bb.length;
  for (let i = 0; i < len; i++) {
    diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return diff === 0;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
