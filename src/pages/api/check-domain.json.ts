import type { APIRoute } from 'astro';

export const get: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const domain = url.searchParams.get('domain');

  const available = domain && domain.length > 0 && domain.length < 15; // Example condition

  return new Response(
    JSON.stringify({ available }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
