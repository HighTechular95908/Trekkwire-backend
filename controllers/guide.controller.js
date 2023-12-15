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

exports.search = (req, res) => {
  var location = req.query._location;
  var name = req.query._name;
  console.log("----->", name);
  if (name === null) {
    console.log("--->null");
  }
  if (
    (location === "" || location === null) &&
    (name === "" || name === null)
  ) {
    User.find({ roles: { $in: ["guide"] } })
      .select("-password -salt")
      .then((users) => {
        return res.status(200).send(users);
      })
      .catch((err) => {
        return res.status(400).send({
          code: "400",
          error: "users No exist",
        });
      });
  } else {
    User.find({
      $or: [
        { name: { $regex: name, $options: "i" } }, // Case-insensitive search for name
        { location: { $regex: location, $options: "i" } }, // Case-insensitive search for location
        { roles: { $in: ['guide'] } }
      ],
    })
      .select("-password -salt")
      .then((users) => {
        if (users.length === 0) {
          // Handle the case where the filtered guide does not exist
          console.log("No guides found for the specified search value");
          return res.status(400).send({
            code: "400",
            error: "users No exist",
          });
        } else {
          console.log(users);
          return res.status(200).send(users);
          // Use the retrieved guides as needed
        }
      })
      .catch((err) => {
        console.error(err);
        handleError(err, res);
        // Handle the error
      });
  }
};
exports.guide = (req, res) => {
 var userId = req.params.id;
 Guide.findOne({user:userId},)
};
