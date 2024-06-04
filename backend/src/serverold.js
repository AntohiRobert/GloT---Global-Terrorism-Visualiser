const http = require('http');
const url = require('url');
const incidentsRoutes = require('./routes/incidentsRoutes');
const PORT = 3005;

const server = http.createServer((req, res) => {
  console.log(req);
  const parsedUrl = url.parse(req.url, true);
  //const { pathname, query } = parsedUrl;
  const path = parsedUrl.pathname;
  const method = req.method;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
  }

  //res.setHeader('Content-Type', 'application/json');

  if (pathname.startsWith('/api/incidents')) {
    incidentsRoutes.handleRequest(req, res, pathname, query);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
