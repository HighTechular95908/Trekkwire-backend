var router = require("express").Router(),
  guideCtr = require("../controllers/guide.controller");

router.post("/create/:id", guideCtr.create);
router.put("/update/:id", guideCtr.update);
router.delete("/delete/:id", guideCtr.delete);
router.post("/search", guideCtr.search);

module.exports = router;
