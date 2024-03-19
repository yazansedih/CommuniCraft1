

const FinishedprojectRepository = require('../data/database/finishedprojectRepository');
const finishedprojectRepository = new FinishedprojectRepository();

// Controlador para obtener el informe del sistema
exports.getSystemReport = (req, res) => {
  finishedprojectRepository.getSystemReport((err, systemReport) => {
    if (err) {
      console.error('Error fetching system report:', err);
      return res.status(500).json({ error: 'Error fetching system report' });
    }
    res.json(systemReport);
  });
};
