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
    const dnsData = [];

    try {
      const aRecords = await dns.resolve(domain, 'A');
      dnsData.push(...aRecords.map(ip => `A (IPv4): ${ip}`));
    } catch (error) {
      if (error.code !== 'ENODATA') throw error;
    }

    try {
      const aaaaRecords = await dns.resolve(domain, 'AAAA');
      dnsData.push(...aaaaRecords.map(ip => `AAAA (IPv6): ${ip}`));
    } catch (error) {
      if (error.code !== 'ENODATA') throw error;
    }

    try {
      const cnameRecords = await dns.resolve(domain, 'CNAME');
      dnsData.push(...cnameRecords.map(cname => `CNAME: ${cname}`));
    } catch (error) {
      if (error.code !== 'ENODATA') throw error;
    }

    try {
      const mxRecords = await dns.resolve(domain, 'MX');
      dnsData.push(...mxRecords.map(mx => `MX (Mail Exchanger): Priority: ${mx.priority}, Exchange: ${mx.exchange}`));
    } catch (error) {
      if (error.code !== 'ENODATA') throw error;
    }

    try {
      const nsRecords = await dns.resolve(domain, 'NS');
      dnsData.push(...nsRecords.map(ns => `NS (Name Server): ${ns}`));
    } catch (error) {
      if (error.code !== 'ENODATA') throw error;
    }

    try {
      const txtRecords = await dns.resolve(domain, 'TXT');
      dnsData.push(...txtRecords.map(txt => `TXT: ${txt.join(' ')}`));
    } catch (error) {
      if (error.code !== 'ENODATA') throw error;
    }

    try {
      const soaRecords = await dns.resolve(domain, 'SOA');
      dnsData.push(`SOA (Start of Authority): ${JSON.stringify(soaRecords)}`);
    } catch (error) {
      if (error.code !== 'ENODATA') throw error;
    }

    if (dnsData.length === 0) {
      dnsData.push('No DNS records available.');
    }

    return new Response(JSON.stringify({ dnsData: dnsData.join('\n') }), {
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
