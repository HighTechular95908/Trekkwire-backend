var router = require("express").Router();
const UploadController = require('../controllers/upload.controller');
router.post("/avatar/:id", UploadController.uploadAvatar);
router.post("/travel-image/:id", UploadController.uploadAvatar);
module.exports = router;
