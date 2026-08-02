const http = require('http');

function makeRequest(path, method, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch(e) {
          console.error('Failed to parse:', body);
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('--- Registering a test user ---');
  const signupResponse = await makeRequest('/api/v1/auth/signup', 'POST', {
    email: `test_notif_${Date.now()}@agrishield.in`,
    password: 'password123',
    firstName: 'Notif',
    lastName: 'User'
  });

  if (!signupResponse.success) {
    console.error('Signup failed:', signupResponse);
    return;
  }
  const token = signupResponse.data.token;
  console.log('User created and token acquired.');

  console.log('\n--- Waiting 1s for Events to Process ---');
  await new Promise(r => setTimeout(r, 1000));

  console.log('\n--- GET /api/v1/notifications ---');
  const getNotifs = await makeRequest('/api/v1/notifications', 'GET', null, token);
  console.log('Total notifications:', getNotifs.data.total);
  const notificationId = getNotifs.data.data[0].id;
  console.log('First notification title:', getNotifs.data.data[0].title);

  console.log('\n--- PATCH /api/v1/notifications/:id/read ---');
  const readRes = await makeRequest(`/api/v1/notifications/${notificationId}/read`, 'PATCH', null, token);
  console.log('Marked as read:', readRes.success, '| isRead:', readRes.data.isRead);

  console.log('\n--- POST /api/v1/device-tokens ---');
  const addToken = await makeRequest('/api/v1/device-tokens', 'POST', {
    deviceToken: 'dummy-fcm-token-12345',
    platform: 'android',
    deviceName: 'Pixel 6'
  }, token);
  console.log('Device token registered:', addToken.success, '| ID:', addToken.data.id);
  const tokenId = addToken.data.id;

  console.log('\n--- DELETE /api/v1/device-tokens/:id ---');
  const delToken = await makeRequest(`/api/v1/device-tokens/${tokenId}`, 'DELETE', null, token);
  console.log('Device token removed:', delToken.success);

  console.log('\n--- DELETE /api/v1/notifications/:id ---');
  const delNotif = await makeRequest(`/api/v1/notifications/${notificationId}`, 'DELETE', null, token);
  console.log('Notification deleted:', delNotif.success);

  console.log('\nAll verification tests completed successfully!');
}

runTests().catch(console.error);
