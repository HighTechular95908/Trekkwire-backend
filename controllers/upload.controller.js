const fs = require("fs");
const path = require("path");
const avatarUploadPath = "../assets/media/avatar/";

exports.uploadAvatar = (req, res) => {
  const file = req.body;
  // const fileData = "file.uri";
  // const fileType = "file.type";
  const filename = file.name;
  const fileData = file.uri;
  const fileType = file.type;
  console.log("imageUri------------>",fileData);
  console.log("imageUriType------------>",typeof(fileData));
  // Decode the Base64 data into a binary buffer
  // const buffer = Buffer.from(fileData);
  // console.log("buffer-------->",buffer);
  // Specify the file path and name where you want to save the file
  const filePath = path.join(
    __dirname,
    avatarUploadPath,
    `${filename}.avatar`
  );
  fs.writeFile(filePath, fileData, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({
        code: "500",
        error: "Image Upload Failed",
      });
    } else {
      return res.status(200).send({
        message: "Image uploaded successfully"
      });
    }
  });
};
