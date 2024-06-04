/*
const incidentsController = require('../controllers/incidentsController');

const handleRequest = (req, res, pathname, query) => {
  if (req.method === 'GET' && pathname === '/api/incidents') {
    console.log("Allrequests")
    incidentsController.getAllIncidents(req, res);
  } else if (req.method === 'GET' && pathname.startsWith('/api/incidents/')) {
    console.log(pathname);
    const id = pathname.split('/').pop();
    incidentsController.getIncidentById(req, res, id);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
};

module.exports = { handleRequest };
*/