// const express = require('express');

// const { upload } = require("../middlewares/multer")

// const ImageController = require('../controllers/image.controller');



// router.post("/upload-single", upload.single("image"), ImageController.importSingle);

// router.post("/upload-array", upload.array("image"), ImageController.importArray);

// const uploadMultiple = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 3 }])
// router.post('/upload-multiple', uploadMultiple, ImageController.importMultiple);

// router.delete('/delete', ImageController.deleteFile);


// module.exports = router
// const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
var router = require("express").Router();

router.post('/upload', upload.single('file'), (req, res) => {
  // File is uploaded and can be accessed as req.file
  console.log(req.file);
  // Save the file to a specific folder
  // You can use fs.rename or any other method to save the file
});
module.exports = router;