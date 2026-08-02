const http = require('http');

http.get('http://localhost:5000/api/analytics/summary', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log("Analytics HTTP Status:", res.statusCode);
    if (res.statusCode === 401) {
       console.log("Unauthorized (expected without token). So the server is running!");
    } else {
       console.log(data.substring(0, 500));
    }
  });
}).on('error', err => console.log("Analytics Error:", err.message));

http.get('http://localhost:5000/api/detection/history', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log("History HTTP Status:", res.statusCode);
  });
}).on('error', err => console.log("History Error:", err.message));
