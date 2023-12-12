var router = require("express").Router(),
    travelerCtr = require("../controllers/traveler.controller");

router.post("/create/:id", travelerCtr.create);

module.exports = router;