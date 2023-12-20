const catchAsync = require("../config/utils/catchAsync");
const handleError = require("../config/utils/handleError");

var mongoose = require("mongoose"),
  Traveler = mongoose.model("Traveler"),
  Book = mongoose.model("Book");
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

//get all booking Info
exports.Allbook = catchAsync(async (req, res) => {
  let id = req.params.id;
  await Book.find({ travelerId: id })
    .then((books) => {
      if (books.length == 0) {
        console.log("----------->1");
        return res.status(200).send(books);
      }
      return res.status(200).send(books);
    })
    .catch((err) => {
      console.log("----------->2");
      handleError(err, res);
    });
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
exports.updateStar = catchAsync(async (req, res) => {
  let userId = req.params.id;
  let star = req.query._star;
  console.log("sendedStar--------->", star);
  let traveler = await Traveler.findOne({ user: userId });
  console.log("traveler.Rating--------->", traveler.rating);
  let beforeCount = traveler.ratingCount;
  let afterCount = beforeCount + 1;
  let total = parseFloat(traveler.rating * beforeCount) + parseFloat(star);
  console.log("------------>beforetotal", total);
  let afterStar = total / afterCount;
  console.log("beforeStarCount--------->", beforeCount);
  console.log("afterStarCount--------->", afterCount);
  console.log("afterStar--------->", afterStar);
  await Traveler.findOneAndUpdate(
    { user: userId },
    {
      rating: afterStar.toFixed(1),
      ratingCount: afterCount,
    }
  )
    .then((traveler) => {
      console.log("afterStarCount--------->", traveler.ratingCount);
      return res.status(200).send({
        staredStatus: 2,
      });
    })
    .catch((err) => handleError(err, res));
});
