const CommunicationRepository = require('../data/database/communicationRepository');

const communicationRepository = new CommunicationRepository();


exports.userCommunication = (req, res) => { 
    communicationRepository.userCommunication(req, res);
}

exports.workshopCommunication = (req,res)=>{
    communicationRepository.workshopCommunication(req,res);
}