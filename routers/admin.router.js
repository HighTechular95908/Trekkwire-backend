var router = require("express").Router();
const AdminController = require('../controllers/admin.controller');
router.get("/total/traveler", AdminController.totalTraveler);
router.get("/total/guide", AdminController.totalGuide);
module.exports = router;
