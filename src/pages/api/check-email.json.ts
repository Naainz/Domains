import type { APIRoute } from 'astro';
import net from 'net';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ error: 'No email provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const emailParts = email.split('@');
  if (emailParts.length !== 2) {
    return new Response(JSON.stringify({ isAvailable: false, emailData: 'Invalid email format' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const domain = emailParts[1];

  try {
    
    const mxRecords = await dns.resolveMx(domain);
    if (mxRecords.length === 0) {
      return new Response(JSON.stringify({
        isAvailable: false,
        emailData: 'No mail servers found for this domain',
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    
    mxRecords.sort((a, b) => a.priority - b.priority);
    const exchange = mxRecords[0].exchange;

    
    const isAvailable = await verifyEmail(exchange, email);
    return new Response(JSON.stringify({
      isAvailable: !isAvailable,
      emailData: isAvailable ? 'Email is in use' : 'Email is not available',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to check email',
      details: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

async function verifyEmail(mxHost: string, email: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection(25, mxHost);

    socket.on('data', (data) => {
      if (data.toString().includes('220')) {
        socket.write(`HELO ${mxHost}\r\n`);
      } else if (data.toString().includes('250')) {
        socket.write(`MAIL FROM:<verify@example.com>\r\n`);
      } else if (data.toString().includes('250 2.1.0')) {
        socket.write(`RCPT TO:<${email}>\r\n`);
      } else if (data.toString().includes('250 2.1.5')) {
        socket.end();
        resolve(true); 
      } else if (data.toString().includes('550')) {
        socket.end();
        resolve(false); 
      } else {
        socket.end();
        reject(new Error('Unexpected response from the mail server'));
      }
    });

    socket.on('error', (err) => {
      reject(err);
    });

    socket.on('close', () => {
      reject(new Error('Connection closed unexpectedly'));
    });
  });
}
