const ResourcesRepository = require('../data/database/resourcesRepository');

const resourcesRepository = new ResourcesRepository();


exports.addResource =  (req, res) => {
    resourcesRepository.addResource(req,res);
}
exports.updateResource =  (req, res) => {
    resourcesRepository.updateResource(req,res);
   
}
exports.deleteResource =  (req, res) => {
    resourcesRepository.deleteResource(req,res);
   
}
exports.printAll =  (req, res) => {
    resourcesRepository.printAll(req,res);
   
}
exports.availableResource =  (req, res) => {
    resourcesRepository.availableResource(req,res);
   
}
exports.ResourceMaxcoast =  (req, res) => {
    resourcesRepository.ResourceMaxcoast(req,res);
   
}
exports.printmyResource =  (req, res) => {
    resourcesRepository.printmyResource(req,res);
   
}



