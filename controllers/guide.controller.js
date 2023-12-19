var mongoose = require("mongoose"),
  Guide = mongoose.model("Guide"),
  User = mongoose.model("User"),
  Book = mongoose.model("Book");
const handleError = require("../config/utils/handleError");
const catchAsync = require("../config/utils/catchAsync");
const upload = require("../config/upload");
const { PATH_IMAGE_UPLOAD } = require("../config/constants");
//guide profile create
exports.create = catchAsync(async (req, res) => {
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
  await User.findByIdAndUpdate(userid, { roles: ["traveler", "guide"] })
    .then((user) => {
      console.log("role as a guide updated--------->");
      return res.status(200).send({});
    })
    .catch((err) => handleError(err, res));
});
//guide profile read
exports.guideProfile = (req, res) => {
  let userId = req.params.id;
  Guide.findOne({ user: userId })
    .populate("user", ["fullName", "avatar", "country", "city"])
    .then((guide) => {
      return res.status(200).send(guide);
    })
    .catch((err) => handleError(err, res));
};
//guide profile update
exports.update = catchAsync(async (req, res) => {
  let userId = req.params.id;
  let guideInfo = req.body;
  await Guide.findOneAndUpdate(
    { user: userId },
    { $set: guideInfo },
    { new: true }
  )
    .then((guide) => {
      return res.status(200).send({});
    })
    .catch((err) => handleError(err, res));
});
//guide profile delete
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
//All guide profile with fullName, avatar, country, city
exports.all = catchAsync(async (req, res) => {
  try {
    let guides = await Guide.find().populate("user", [
      "fullName",
      "avatar",
      "country",
      "city",
    ]);
    return res.status(200).send(guides);
  } catch (err) {
    handleError(err, res);
  }
});
//search guide?????
exports.search = (req, res) => {
  let location = req.query._location;
  let name = req.query._name;
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
//All available travels
exports.alltravel = (req, res) => {
  let userId = req.params.id;
  Guide.findOne({ user: userId })
    .then((guide) => {
      return res.status(200).send(guide.availableTravels);
    })
    .catch((err) => handleError(err, res));
};
//create a travel as a guide
exports.createOneTravel = catchAsync(async (req, res) => {
  let userId = req.params.id;
  let { travelName, price, hour, available, travelImageUrl } = req.body;
  let newTravel = { travelName, price, hour, available };
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
      )
        .then((result) => {
          return res.status(200).send({});
        })
        .catch((err) => handleError(err, res));
    })
    .catch((err) => {
      handleError(err, res);
    });
});
//read travels as a guide
exports.readOneTravel = (req, res) => {
  let userId = req.params.id;
  let travelId = req.query._id;
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
//update travels as a guide
exports.updateOneTravel = catchAsync(async (req, res) => {
  let { travelName, travelImageUrl, price, hour, available } = req.body;
  // var travelInfo = req.body;
  let userId = req.params.id;
  let travelId = req.query._id;
  upload("travel", travelId, travelImageUrl, res); //save image file into upload folder
  await Guide.updateOne(
    { user: userId, "availableTravels._id": travelId }, //Finding Product with the particular price
    { $set: { "availableTravels.$.travelName": travelName } }
  ).catch((err) => handleError(err, res));
  await Guide.updateOne(
    { user: userId, "availableTravels._id": travelId }, //Finding Product with the particular price
    { $set: { "availableTravels.$.price": price } }
  ).catch((err) => handleError(err, res));
  await Guide.updateOne(
    { user: userId, "availableTravels._id": travelId }, //Finding Product with the particular price
    { $set: { "availableTravels.$.hour": hour } }
  ).catch((err) => handleError(err, res));
  await Guide.updateOne(
    { user: userId, "availableTravels._id": travelId }, //Finding Product with the particular price
    { $set: { "availableTravels.$.available": available } }
  ).catch((err) => handleError(err, res));
  Guide.findById(travelId)
    .then((guide) => {
      return res.status(200).send(guide);
    })
    .catch((err) => handleError(err, res));
});
//delete travels as a guide
exports.deleteOneTravel = catchAsync(async (req, res) => {
  let userId = req.params.id;
  let travelId = req.query._id;
  await Guide.findOneAndUpdate(
    { user: userId },
    { $pull: { availableTravels: { _id: travelId } } }
  )
    .then((guide) => {
      return res.status(200).send(guide);
    })
    .catch((err) => handleError(err, res));
});
//All booking info as a guide
exports.Allbook = catchAsync(async (req, res) => {
  let userId = req.params.id;
  await Book.find({ userId: userId })
    .then((books) => {
      return res.status(200).send(books);
    })
    .catch((err) => handleError(err, res));
});
