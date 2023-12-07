var router = require("express").Router();
const UploadController = require('../controllers/upload.controller');

router.post("/avatar", UploadController.uploadAvatar);

module.exports = router;
