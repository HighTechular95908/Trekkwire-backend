var router = require("express").Router(),
    travelerCtr = require("../controllers/traveler.controller");

router.get("/all", travelerCtr.all);
router.get("/book/all/:id", travelerCtr.Allbook);
//
router.put("/rating/:id", travelerCtr.updateStar);//id -> guideId to be stared, query include star
module.exports = router;