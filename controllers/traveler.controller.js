const catchAsync = require("../config/utils/catchAsync");
const handleError = require("../config/utils/handleError");

var mongoose = require("mongoose"),
  Traveler = mongoose.model("Traveler");
exports.create = (req, res) => {
  let travelerId = req.params.id;
  try {
    Traveler.create({
      user: travelerId,
    });
    return res.status(200).send({});
  } catch {
    return res.status(500).send({
      code: "500",
      error: "Server Disconnected!",
    });
  }
};
exports.book = catchAsync(async (req, res) => {
  let userId = req.params.id;
  let bookInfo = req.body;
  console.log(bookInfo);
  try {
    const traveler = await Traveler.findOne({ user: userId });
    traveler.booking.unshift(bookInfo);
    await traveler.save();
    res.status(200).send(traveler);
  } catch (err) {
    handleError(err, res);
  }
});
exports.cancel = catchAsync(async (req, res) => {
  
  let userId = req.params.id;
  let {guideId, travelName} = req.body;
  let Traveler = await Traveler.findOne({ user: userId });
  let bookingInfoArray = Traveler;
  let condition1 = guideId;
  let condition2 = travelName; 
  const filteredArr = filterArray(Traveler.booking, filterFn1,filterFn2);
  console.log(JSON.stringify(filteredArr));
});
const filterFn1 = (item) => {
  return item.id === condition1;
};
const filterFn2 = (item) => {
  return item.id === condition2;
};
function filterArray(arr, filter1, filter2) {
  const filteredArr = [];
  for (const item of arr) {
    if (!filter1(item) && !filter2(item)) {
      filteredArr.push(item);
    }
  }
  return filteredArr;
}