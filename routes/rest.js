let router = require('express').Router(),
    StrainController = require('./../controllers/strains.js');

router.get("/strains", function(req, res) {
    StrainController.get().then((docs) => res.send(docs));
});
router.get("/", function(req, res) {
    
});

function sendError(error, res) {
    res.send("Error");
}
module.exports = router;