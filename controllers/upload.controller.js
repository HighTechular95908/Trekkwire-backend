const fs = require("fs");
const multer = require("multer");
const path = require("path");
const handleError = require("../config/utils/handleError");
const avatarUploadPath = "../assets/media/avatar/";
var mongoose = require("mongoose"),
  User = mongoose.model("User");
exports.uploadAvatar = (req, res) => {

  //***********file save mode***************/
  // const file = req.body;
  // const filename = file.name;
  // const fileData = file.uri;
  // const fileType = file.type;
  // const filePath = path.join(__dirname, avatarUploadPath, `${filename}.avatar`);
  // fs.writeFile(filePath, fileData, (err) => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).send({
  //       code: "500",
  //       error: "Image Upload Failed",
  //     });
  //   } else {
  //     return res.status(200).send({
  //       message: "Image uploaded successfully",
  //     });
  //   }
  // });
  const file = req.body;
  const userId = file.name;
  User.findByIdAndUpdate(userId, { avatar: file.uri })
    .then((user) => {
      return res.status(200).send({});
    })
    .catch((err) => handleError(err, res));
};

//////////////////////////////////////////.........testing
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./assets/media/avatar");
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.uploadTest =
  (upload.single("file"),
  (req, res) => {
    console.log("file", req.file);
    console.log("body", req.body);
    res.status(200).json({
      message: "success!",
    });
  });
