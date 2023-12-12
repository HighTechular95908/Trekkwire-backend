var mongoose = require("mongoose"),
  Guide = mongoose.model("Guide"),
  User = mongoose.model("User");
const handleError = require("../config/utils/handleError");
const catchAsync = require("../config/utils/catchAsync");

exports.create = catchAsync(async (req, res) => {
  console.log("---------->guide create called");
  let userid = req.params.id;
  console.log(userid);
  //creat a new guide profile
  await Guide.create({
    user: userid,
  })
    .then((user) => console.log("guide created--------->"))
    .catch((err) => {
      handleError(err, res);
    });

  // update userprofile by adding a role as a guide
  await User.findByIdAndUpdate(userid, { roles: ["traveler", "guide"] });
  return res.status(200).send({});
});

exports.update = catchAsync(async (req, res) => {
  let userId = req.params.id;
  let guideInfo = req.body;
  try {
    await Guide.findOneAndUpdate(
      { user: userId },
      { $set: guideInfo },
      { new: true }
    );
    console.log("---------->updated guide successfully");
    res.status(200).send({});
  } catch {
    console.log("---------->error while updating guide");
    return res.status(500).send({
      code: "500",
      error: "Server Disconnected!",
    });
  }
});

exports.delete = catchAsync(async (req, res) => {
  let userid = req.params.id;
  await guide.findOneAndDelete({ user: userid });
  res.status(200).send({ message: "Successfully deleted." });
});
