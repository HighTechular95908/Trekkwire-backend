var router = require("express").Router(),
  guideCtr = require("../controllers/guide.controller");

router.post("/create/:id", guideCtr.create);
router.post("/update/:id", guideCtr.update);

module.exports = router;
