export default async function handler(req, res) {
  const { path = [] } = req.query;
  const backendPath = Array.isArray(path) ? path.join('/') : path;


  const url = new URL(`${process.env.BACKEND_URL}/${backendPath}`);

  Object.keys(req.query).forEach(key => {
    if (key !== 'path') {
      const value = req.query[key];
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else {
        url.searchParams.append(key, value);
      }
    }
  });

  try {
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Vercel-Proxy/1.0'
    };
    
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }

    const response = await fetch(url.toString(), {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
