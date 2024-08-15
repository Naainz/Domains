import type { APIRoute } from 'astro';
import dns from 'dns/promises';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const domain = url.searchParams.get('domain');

  if (!domain) {
    return new Response(JSON.stringify({ error: 'No domain provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const dnsRecords = await dns.resolveAny(domain);
    const formattedRecords = dnsRecords.map(record => {
      switch (record.type) {
        case 'A':
          return `A (IPv4): ${record.address}`;
        case 'AAAA':
          return `AAAA (IPv6): ${record.address}`;
        case 'CNAME':
          return `CNAME: ${record.value}`;
        case 'MX':
          return `MX (Mail Exchanger): Priority: ${record.priority}, Exchange: ${record.exchange}`;
        case 'NS':
          return `NS (Name Server): ${record.value}`;
        case 'TXT':
          return `TXT: ${record.entries.join(' ')}`;
        case 'SRV':
          return `SRV (Service): Priority: ${record.priority}, Weight: ${record.weight}, Port: ${record.port}, Target: ${record.name}`;
        case 'SOA':
          return `SOA (Start of Authority): ${JSON.stringify(record)}`;
        default:
          return `Unknown record type: ${JSON.stringify(record)}`;
      }
    });

    return new Response(JSON.stringify({ dnsData: formattedRecords.join('\n') }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching DNS records:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch DNS records' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
