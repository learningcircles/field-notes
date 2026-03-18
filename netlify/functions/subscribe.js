exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let email;
  try {
    const body = JSON.parse(event.body);
    email = body.email;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!email || !email.includes('@')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email' }) };
  }

  const GROUP_ID = '182243126421751391';
  const API_KEY = process.env.MAILERLITE_API_KEY;

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        email: email,
        groups: [GROUP_ID]
      })
    });

    if (response.ok || response.status === 200 || response.status === 201) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    const errorData = await response.json();
    return { statusCode: response.status, body: JSON.stringify({ error: errorData }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
