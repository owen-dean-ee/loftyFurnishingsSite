// stripe-worker.js - Cloudflare Workers
// This worker provides two routes:
// 1. POST /stripe/create-session  -> creates a Stripe Checkout Session and returns the session ID.
// 2. POST /stripe/webhook          -> receives Stripe webhook events and verifies signature.
// Deploy this worker with Wrangler (wrangler.toml provided).

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (request.method === 'POST' && pathname === '/stripe/create-session') {
    return await handleCreateSession(request);
  }
  if (request.method === 'POST' && pathname === '/stripe/webhook') {
    return await handleWebhook(request);
  }
  // Fallback 404
  return new Response('Not Found', { status: 404 });
}

// ------------------- Create Checkout Session -------------------
async function handleCreateSession(request) {
  const { amount_cents, product_name, success_url, cancel_url } = await request.json();
  const stripeSecret = STRIPE_SECRET_KEY; // secret stored as a Worker secret

  const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${stripeSecret}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      payment_method_types: ['card'],
      line_items: JSON.stringify([{ price_data: { currency: 'usd', product_data: { name: product_name }, unit_amount: amount_cents }, quantity: 1 }]),
      mode: 'payment',
      success_url: success_url + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancel_url
    })
  });

  if (!stripeResponse.ok) {
    const err = await stripeResponse.text();
    return new Response(err, { status: 500 });
  }

  const session = await stripeResponse.json();
  return new Response(JSON.stringify({ sessionId: session.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// ------------------- Webhook Verification -------------------
async function handleWebhook(request) {
  const webhookSecret = STRIPE_WEBHOOK_SECRET; // Cloudflare secret
  const sigHeader = request.headers.get('stripe-signature');
  if (!sigHeader) {
    return new Response('Missing Stripe signature header', { status: 400 });
  }
  const rawBody = await request.clone().arrayBuffer();
  const payload = new TextDecoder().decode(rawBody);

  // Extract timestamp and signature from header (format: t=timestamp,v1=signature,...)
  const parts = sigHeader.split(',').map(p => p.trim());
  const timestampPart = parts.find(p => p.startsWith('t='));
  const signaturePart = parts.find(p => p.startsWith('v1='));
  if (!timestampPart || !signaturePart) {
    return new Response('Invalid Stripe signature header format', { status: 400 });
  }
  const timestamp = timestampPart.split('=')[1];
  const expectedSignature = signaturePart.split('=')[1];

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureArrayBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload));
  const computedSignature = Array.from(new Uint8Array(signatureArrayBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Constant‑time comparison
  const normalize = (str) => str.toLowerCase();
  const a = normalize(computedSignature);
  const b = normalize(expectedSignature);
  if (a.length !== b.length) {
    return new Response('Signature verification failed', { status: 400 });
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  if (diff !== 0) {
    return new Response('Signature verification failed', { status: 400 });
  }

  const event = JSON.parse(payload);
  // Handle checkout.session.completed – placeholder for Firestore write
  if (event.type === 'checkout.session.completed') {
    // In production, write the booking details to Firestore here using the Admin SDK or REST API.
    console.log('✅ checkout.session.completed received', event.data.object);
  }
  return new Response('Webhook processed', { status: 200 });
}

