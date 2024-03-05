const ExternalAPIsRepository = require('../data/database/externalAPIsRepository');

const externalAPIsRepository = new ExternalAPIsRepository();

exports.weather = (req, res) => {
    externalAPIsRepository.weather(req, res);
};