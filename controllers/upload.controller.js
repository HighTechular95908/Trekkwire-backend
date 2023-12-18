const fs = require("fs");
const path = require("path");
const handleError = require("../config/utils/handleError");
const { PATH_AVATAR_UPLOAD } = require("../config/constants");
var mongoose = require("mongoose");
const catchAsync = require("../config/utils/catchAsync");
var mongoose = require("mongoose"),
  User = mongoose.model("User");

exports.uploadAvatar = catchAsync(async (req, res) => {
  let fileData = req.body;
  let filename = req.params.id; // filename = userId.

  // let mimeType = fileData.split(";")[0].split(":")[1];
  // let fileType = mimeType.split("/")[1];
  // fileType = "jpeg";
  // let filePath = path.join(
  //   __dirname,
  //   `..${PATH_AVATAR_UPLOAD}`,
  //   `${filename}.${fileType}`
  // );
  // var base64Data = fileData.split(";base64,").pop();
  // fs.writeFile(
  //   filePath,
  //   base64Data,
  //   { encoding: "base64" },
  //   async function (err) {
  //     if (err) {
  //       console.log(err);
  //       handleError(err, res);
  //     } else {
  //       await User.findByIdAndUpdate(filename, {
  //         avatar: `${PATH_AVATAR_UPLOAD}${filename}.${fileType}`,
  //       });
  //       return res.status(200).send({});
  //     }
  //   }
  // );
  try{
    // await User.
  }
  catch(err){
    handleError(err, res);
  }


});
