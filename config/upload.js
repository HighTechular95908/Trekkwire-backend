const fs = require("fs");
const handleError = require("../config/utils/handleError");
const catchAsync = require("../config/utils/catchAsync");
const { PATH_IMAGE_UPLOAD } = require("../config/constants");
const path = require("path");

module.exports = (role, id, uri, res) => {
  console.log("------------>upload function called.");
  let fileData = uri;
  let filename = id; // filename = userId or travelId
  let mimeType = fileData.split(";")[0].split(":")[1];
  let fileType = mimeType.split("/")[1];
  fileType = "jpeg";
  let filePath = path.join(
    __dirname,
    `..${PATH_IMAGE_UPLOAD}/${role}`,
    `${filename}.${fileType}`
  );
  var base64Data = fileData.split(";base64,").pop();
  fs.writeFile(filePath, base64Data, { encoding: "base64", flag: 'w' }, function (err) {
    if (err) {
      console.log(err);
      handleError(err, res);
    }
  });
};
