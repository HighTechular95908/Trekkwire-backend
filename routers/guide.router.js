var router = require("express").Router(),
  guideCtr = require("../controllers/guide.controller");

router.post("/create/:id", guideCtr.create);
router.put("/update/:id", guideCtr.update);
router.delete("/delete/:id", guideCtr.delete);
router.get("/search", guideCtr.search);
router.get("/all", guideCtr.all);
router.get("/guide/:id", guideCtr.guideProfile);

router.get("/alltravel/:id", guideCtr.alltravel);
router.get("/read/travel/:id", guideCtr.readOneTravel);
router.post("/create/travel/:id", guideCtr.createOneTravel);
router.put("/update/travel/:id", guideCtr.updateOneTravel);
router.delete("/delete/travel/:id", guideCtr.updateOneDelete);

module.exports = router;
