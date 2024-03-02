const LocalpartnershipRepository = require('../data/database/localpartnershipRepository');

const localpartnershipRepository = new LocalpartnershipRepository();

exports.authenticateWorkshop = async (req, res, next) => {

    const OwnerID = req.session.userId;
    const workshopname = req.body.workshopname;

    console.log("OwnerID:", OwnerID);
    try {
        if(OwnerID) {
            const WorkshopName = await localpartnershipRepository.getWorkshops(OwnerID);
              if (WorkshopName != workshopname) {
                next();
              } else {
                res
                  .status(401)
                  .json({ message: 'Unauthorized, The workshop already exists!' });
              }
        }

    } catch (error) {
        // Handle errors in the authenticateOnwer middleware
        console.error('Error in authenticateWorkshop:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
