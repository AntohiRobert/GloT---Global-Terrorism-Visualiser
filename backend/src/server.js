const http = require('http');
const url = require('url');
const Incident = require('./models/incident');

const hostname = 'localhost';
const port = 3022;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
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

    if (path === '/api/incidents' && method === 'GET') {
        console.log("Request for all");
        Incident.getAll()
            .then(incidents => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(incidents));
            })
            .catch(error => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            });
    } else if (path.startsWith('/api/incidents/') && method === 'GET') {
        const id = path.split('/')[3]; // Extract the ID from the URL
        Incident.getById(id)
            .then(incident => {
                if (incident) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(incident));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Incident Not Found' }));
                }
            })
            .catch(error => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
