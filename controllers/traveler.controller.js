const catchAsync = require("../config/utils/catchAsync");
const handleError = require("../config/utils/handleError");

var mongoose = require("mongoose"),
  Traveler = mongoose.model("Traveler"),
  Guide = mongoose.model("Guide");
//All travelers
exports.all = catchAsync(async (req, res) => {
  try {
    const travelers = await Traveler.find().populate("user", [
      "fullName",
      "avatar",
      "country",
      "city",
    ]);
    return res.status(200).send(travelers);
  } catch (err) {
    handleError(err, res);
  }
});
//Search traveler

//book a travel
exports.book = catchAsync(async (req, res) => {
  let userId = req.params.id;
  let bookInfo = req.body;
  try {
    //traveler booking info saving
    const traveler = await Traveler.findOne({ user: userId });
    traveler.booking.unshift(bookInfo);
    await traveler.save().catch((err) => handleError(err, res));
    //guide simultaneously saving
    await Guide.findOne({ user: userId }).then(async (guide) => {
      guide.booking.unshift(bookInfo);
      await guide.save().catch((err) => handleError(err, res))
    })
    res.status(200).send({});
  } catch (err) {
    handleError(err, res);
  }
});
//All books as a travel
exports.Allbook = catchAsync(async (req, res) => {
  let userId = req.params.id;

  await Traveler.findOne({ user: userId })
    .then((traveler) => {
      return res.status(200).send(traveler.booking);
    })
    .catch((err) => handleError(err, res));
});
//book a travel cancel???????
exports.cancel = catchAsync(async (req, res) => {
  let userId = req.params.id;
  let { guideId, travelName } = req.body;
  let Traveler = await Traveler.findOne({ user: userId });
  let bookingInfoArray = Traveler;
  let condition1 = guideId;
  let condition2 = travelName;
  const filteredArr = filterArray(Traveler.booking, filterFn1, filterFn2);
  console.log(JSON.stringify(filteredArr));
});
//search traveler ????????
exports.search = (req, res) => {
  let { location, name } = req.body;
  if ((location == "" && name == "") || (location == null && name == null)) {
    console.log("---------->both are null or empty");
    Traveler.find()
      .populate("user", ["fullName", "avatar"])
      .then((travelers) => {
        return res.status(200).send(travelers);
      })
      .catch((err) => {
        return res.status(400).send({
          code: "400",
          error: "users No exist",
        });
      });
  } else {
    let regFilter = {};
    if (name == "" || name == null) {
      console.log("----------->case1");
      regFilter = {
        $or: [
          { city: { $regex: location, $options: "i" } }, // Case-insensitive search for location
          { country: { $regex: location, $options: "i" } }, // Case-insensitive search for location
        ],
      };
    } else if (location == "" || location == null) {
      console.log("----------->case2");
      regFilter = {
        $or: [
          { fullName: { $regex: name, $options: "i" } }, // Case-insensitive search for name
        ],
      };
    } else {
      console.log("----------->case3");
      regFilter = {
        $or: [
          { fullName: { $regex: name, $options: "i" } }, // Case-insensitive search for name
          { city: { $regex: location, $options: "i" } }, // Case-insensitive search for location
          { country: { $regex: location, $options: "i" } }, // Case-insensitive search for location
        ],
      };
    }
    Traveler.find()
      .populate("user", ["fullName", "avatar"])
      .where({
        $or: [
          { fullName: { $regex: name, $options: "i" } }, // Case-insensitive search for name
          { city: { $regex: location, $options: "i" } }, // Case-insensitive search for location
          { country: { $regex: location, $options: "i" } }, // Case-insensitive search for location
        ],
      })
      .then((travelers) => {
        console.log(travelers);
        return res.status(200).send(travelers);
      })
      .catch((err) => {
        return res.status(400).send({
          code: "400",
          error: "users No exist",
        });
      });
  }
};