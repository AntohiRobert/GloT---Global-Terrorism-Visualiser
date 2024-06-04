const Incident = require('../models/incident');

const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.getAll();
    res.statusCode = 200;
    res.end(JSON.stringify(incidents));
  } catch (error) {
    res.statusCode = 500;
    console.log(error)
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
};

const getIncidentById = async (req, res, id) => {
  try {
    const incident = await Incident.getById(id);
    if (incident) {
      res.statusCode = 200;
      res.end(JSON.stringify(incident));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Incident not found' }));
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
};

module.exports = { getAllIncidents, getIncidentById };
