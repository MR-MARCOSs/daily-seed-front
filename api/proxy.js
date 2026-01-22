export default async function handler(req, res) {
  const { path = [] } = req.query;
  const backendPath = Array.isArray(path) ? path.join('/') : path;

  const backendUrl = `${process.env.BACKEND_URL}/${backendPath}`;

  try {
    const headers = { ...req.headers };
    delete headers.host;
    delete headers.connection;
    
    let body;
    if (req.method !== 'GET' && req.body) {
      if (headers['content-type']?.includes('application/x-www-form-urlencoded')) {
        body = new URLSearchParams(req.body).toString();
      } else {
        body = JSON.stringify(req.body);
        headers['Content-Type'] = 'application/json';
      }
    }

    const response = await fetch(backendUrl, {
      method: req.method,
      headers,
      body,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error' });
  }
}
