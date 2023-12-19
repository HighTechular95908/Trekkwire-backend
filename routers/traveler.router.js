var router = require("express").Router(),
    travelerCtr = require("../controllers/traveler.controller");

router.get("/all", travelerCtr.all);
router.get("/guide/book/all/:id", travelerCtr.Allbook);
module.exports = router;