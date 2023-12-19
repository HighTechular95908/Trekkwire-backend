const catchAsync = require("../config/utils/catchAsync");
const handleError = require("../config/utils/handleError");
var mongoose = require("mongoose"),
  Book = mongoose.model("Book");
//create a book
exports.create = catchAsync(async (req, res) => {
  let bookingInfo = req.body;
  await Book.create(bookingInfo)
    .then((book) => {
      return res.status(200).send({});
    })
    .catch((err) => {
      handleError(err, res);
    });
});
//get all books
exports.Allbook = catchAsync(async (req, res) => {
  await Book.find()
    .then((books) => {
      return res.status(200).send(books);
    })
    .catch((err) => handleError(err, res));
});
//cancel a book
exports.cancel = catchAsync(async (req, res) => {
  let userId = req.params.id;
  try {
    await Book.findOneAndDelete({ userId: userId });
    return res.status(200).send({});
  } catch (err) {
    handleError(err, res);
  }
});
