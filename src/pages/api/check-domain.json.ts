import type { APIRoute } from 'astro';
import whois from 'whois';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const domain = url.searchParams.get('domain');

  if (!domain || domain.length === 0) {
    return new Response(
      JSON.stringify({ error: 'No domain provided' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }

  try {
    const whoisData = await new Promise<string>((resolve, reject) => {
      whois.lookup(domain, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    const isRegistered = !whoisData.includes('No match for domain');

    return new Response(
      JSON.stringify({ available: !isRegistered, whoisData }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error performing WHOIS lookup' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
};
