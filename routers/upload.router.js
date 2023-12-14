var router = require("express").Router();
const UploadController = require('../controllers/upload.controller');

router.post("/avatar", UploadController.uploadAvatar);
router.post("/test", UploadController.uploadTest);

module.exports = router;
