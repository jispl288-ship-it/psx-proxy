export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Remove /api prefix if present so path matches DPS routes
  const rawPath = req.url.replace(/^\/api/, '') || '/';
  const targetUrl = 'https://dps.psx.com.pk' + rawPath;

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Referer': 'https://dps.psx.com.pk/',
        'Origin': 'https://dps.psx.com.pk',
        'Content-Type': req.headers['content-type'] || 'application/x-www-form-urlencoded',
      },
      body: req.method === 'POST' ? req.body : undefined,
    });

    const data = await upstream.text();
    return res.status(upstream.status).send(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
