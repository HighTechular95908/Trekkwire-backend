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
  try {
    await Guide.findOneAndDelete({ user: userid });
    res.status(200).send({ message: "Successfully deleted." });
  } catch (err) {
    handleError(err, res);
  }
});
exports.all = catchAsync(async (req, res) => {
  console.log("------->all called")
  try {
    let guides = await Guide
    .find()
    .populate("user", ["fullName", "avatar"]);
    console.log("------------>",guides);
    return res.status(200).send(guides);
  } catch (err) {
    console("---------<",err)
    handleError(err, res);
  }
});
exports.search = (req, res) => {
  var location = req.query._location;
  var name = req.query._name;
  const regFilter = {
    $or: [
      { fullName: { $regex: name, $options: "i" } }, // Case-insensitive search for name
      { city: { $regex: location, $options: "i" } }, // Case-insensitive search for location
      { country: { $regex: location, $options: "i" } }, // Case-insensitive search for location
    ],
    $and: [{ roles: { $in: ["guide"] } }],
  };
  Guide.findOne()
    .populate("user", ["fullName", "avatar"])
    .then((result) => {
      console.log(result);
      return res.status(200).send(result);
    })
    .catch((err) => handleError(err, res));
};

exports.guideProfile = (req, res) => {
  console.log("------------->guide get request");
  var userId = req.params.id;
  Guide.findOne({ user: userId })
    .then((guide) => {
      // User.findById(userId).select("-password -salt -email -gender -birth -lastLogin -logins -roles -allow").then((user)=>{
      //   var merged = {...guide, ...user};
      //   console.log(merged);
      //   return res.status(200).send(guide);
      // })
      console.log(guide);
      return res.status(200).send({
        guide: guide,
      });
    })
    .catch((err) => handleError(err, res));
};
