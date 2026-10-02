export default async function handler(req, res) {
  // Set CORS headers for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Accept');

  // Handle browser OPTIONS preflight immediately
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Strip /api prefix to mirror DPS endpoints
    let rawPath = req.url.replace(/^\/api/, '') || '/';
    const targetUrl = 'https://dps.psx.com.pk' + rawPath;

    let bodyData = undefined;
    if (req.method === 'POST') {
      if (typeof req.body === 'string') {
        bodyData = req.body;
      } else if (req.body && typeof req.body === 'object') {
        bodyData = new URLSearchParams(req.body).toString();
      }
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,*/*;q=0.8',
        'Referer': 'https://dps.psx.com.pk/',
        'Origin': 'https://dps.psx.com.pk',
        'Content-Type': req.headers['content-type'] || 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: bodyData,
    });

    const data = await response.text();
    return res.status(response.status).send(data);
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
}
