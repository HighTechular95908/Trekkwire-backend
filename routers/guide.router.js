var router = require("express").Router(),
  guideCtr = require("../controllers/guide.controller");

router.post("/create/:id", guideCtr.create);
router.put("/update/:id", guideCtr.update);
router.delete("/delete/:id", guideCtr.delete);
router.get("/search", guideCtr.search);
router.get("/all", guideCtr.all);
router.get("/guide/:id", guideCtr.guideProfile);

module.exports = router;
