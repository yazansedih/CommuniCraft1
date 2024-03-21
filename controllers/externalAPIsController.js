const ExternalAPIsRepository = require('../data/database/externalAPIsRepository');

const externalAPIsRepository = new ExternalAPIsRepository();

exports.weather = (req, res) => {
    externalAPIsRepository.weather(req, res);
};

exports.news = (req, res) => {
    externalAPIsRepository.news(req, res);
};

exports.userData = (req, res) => {
    externalAPIsRepository.userData(req, res);
}