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
    await User.findByIdAndUpdate(userid, { roles: ["traveler"] });
    res.status(200).send({ message: "Successfully deleted." });
  } catch (err) {
    handleError(err, res);
  }
});
exports.all = catchAsync(async (req, res) => {
  console.log("------->all called");
  try {
    let guides = await Guide.find().populate("user", [
      "fullName",
      "avatar",
      "country",
      "city",
    ]);
    console.log("------------>", guides);
    return res.status(200).send(guides);
  } catch (err) {
    console("---------<", err);
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
    .populate("user", ["fullName", "avatar"])
    .then((guide) => {
      console.log(guide);
      return res.status(200).send({
        guide: guide,
      });
    })
    .catch((err) => handleError(err, res));
};
exports.alltravel = (req, res) => {
  var userId = req.params.id;
  Guide.findOne({ user: userId })
    .then((guide) => {
      console.log(guide.availableTravels);
      return res.status(200).send(guide.availableTravels);
    })
    .catch((err) => handleError(err, res));
};

exports.createOneTravel = catchAsync(async (req, res) => {
  console.log("--------------------<creatonetravel called");
  var userId = req.params.id;
  var newTravel = req.body;
  Guide.findOneAndUpdate(
    { user: userId },
    { $push: { availableTravels: newTravel } },
    { new: true }
  )
    .then((guide) => {
      console.log(guide);
      const createdTravel = guide.availableTravels.find(
        (travel) => travel._id === newTravel._id
      );
      return res.status(200).send(createdTravel);
    })
    .catch((err) => {
      handleError(err, res);
    });
});
exports.readOneTravel = (req, res) => {
  var userId = req.params.id;
  var travelId = req.query._id;
  Guide.findOne({ user: userId })
    .then((guide) => {
      const travel = guide.availableTravels.find(
        (travel) => travel.id === travelId
      );
      console.log(travel);
      return res.status(200).send(travel);
    })
    .catch((err) => handleError(err, res));
};
exports.updateOneTravel = catchAsync(async (req, res) => {
  var { travelName, travelImageUrl, price, hour, available } = req.body;
  var userId = req.params.id;
  var travelId = req.query._id;
  await Guide.updateOne(
    { _id: userId, "availableTravels._id": travelId }, //Finding Product with the particular price
    { $set: { "availableTravels.$.travelName": "test", "availableTravels.$.price": 200 } }
  );
});
exports.updateOneDelete = catchAsync(async (req, res) => {
  var userId = req.params.id;
  var travelId = req.query._id;
  try {
    await Guide.findOneAndUpdate({
      user: userId,
      availableTravels: { $elemMatch: { _id: travelId } },
    });
    return res.status(200).send({});
  } catch (err) {
    handleError(err, res);
  }
});
