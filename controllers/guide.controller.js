var mongoose = require("mongoose"),
  Guide = mongoose.model("Guide"),
  User = mongoose.model("User");
const handleError = require("../config/utils/handleError");
const catchAsync = require("../config/utils/catchAsync");
const upload = require("../config/upload");
const { PATH_IMAGE_UPLOAD } = require("../config/constants");

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
    res.status(200).send({});
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
  var userId = req.params.id;
  Guide.findOne({ user: userId })
    .populate("user", ["fullName", "avatar", "country", "city"])
    .then((guide) => {
      return res.status(200).send(guide);
    })
    .catch((err) => handleError(err, res));
};

exports.alltravel = (req, res) => {
  var userId = req.params.id;
  Guide.findOne({ user: userId })
    .then((guide) => {
      return res.status(200).send(guide.availableTravels);
    })
    .catch((err) => handleError(err, res));
};

exports.createOneTravel = catchAsync(async (req, res) => {
  var userId = req.params.id;
  var { travelName, price, hour, available, travelImageUrl } = req.body;
  var newTravel = { travelName, price, hour, available };
  Guide.findOneAndUpdate(
    { user: userId },
    { $push: { availableTravels: newTravel } },
    { new: true }
  )
    .then(async (guide) => {
      let len = guide.availableTravels.length;
      let createdTravelId = guide.availableTravels[len - 1]._id;
      upload("travel", createdTravelId, travelImageUrl, res); //save image file into upload folder
      let imageUrl = `${PATH_IMAGE_UPLOAD}/travel/${createdTravelId}.jpeg`;
      await Guide.updateOne(
        { user: userId, "availableTravels._id": createdTravelId }, //Finding Product with the particular price
        { $set: { "availableTravels.$.travelImageUrl": imageUrl } }
      );
      return res.status(200).send({});
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
  // var travelInfo = req.body;
  var userId = req.params.id;
  var travelId = req.query._id;
  upload("travel", travelId, travelImageUrl, res); //save image file into upload folder
  await Guide.updateOne(
    { user: userId, "availableTravels._id": travelId }, //Finding Product with the particular price
    { $set: { "availableTravels.$.travelName": travelName } }
  );
  await Guide.updateOne(
    { user: userId, "availableTravels._id": travelId }, //Finding Product with the particular price
    { $set: { "availableTravels.$.price": price } }
  );
  await Guide.updateOne(
    { user: userId, "availableTravels._id": travelId }, //Finding Product with the particular price
    { $set: { "availableTravels.$.hour": hour } }
  );
  await Guide.updateOne(
    { user: userId, "availableTravels._id": travelId }, //Finding Product with the particular price
    { $set: { "availableTravels.$.available": available } }
  );
  Guide.findById(travelId)
    .then((guide) => {
      return res.status(200).send(guide);
    })
    .catch((err) => handleError(err, res));
});

exports.deleteOneTravel = catchAsync(async (req, res) => {
  var userId = req.params.id;
  var travelId = req.query._id;
  await Guide.findOneAndUpdate(
    { user: userId },
    { $pull: { availableTravels: { _id: travelId } } }
  )
    .then((guide) => {
      return res.status(200).send(guide);
    })
    .catch((err) => handleError(err, res));
});
exports.Allbook = catchAsync(async (req, res) => {
  let userId = req.params.id;

  await Guide.findOne({ user: userId })
    .then((Guide) => {
      return res.status(200).send(Guide.booking);
    })
    .catch((err) => handleError(err, res));
});