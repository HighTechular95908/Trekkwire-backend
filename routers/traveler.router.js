var router = require("express").Router(),
    travelerCtr = require("../controllers/traveler.controller");

router.post("/create/:id", travelerCtr.create);
router.post("/book/:id", travelerCtr.book);
router.get("/book/all/:id", travelerCtr.Allbook);
router.get("/all", travelerCtr.all);

module.exports = router;