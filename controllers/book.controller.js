const catchAsync = require("../config/utils/catchAsync");
const handleError = require("../config/utils/handleError");
var mongoose = require("mongoose"),
  Book = mongoose.model("Book");
//create a book
exports.create = catchAsync(async (req, res) => {
  let bookingInfo = req.body;
  console.log("bookinginfo", bookingInfo)
  await Book.create(bookingInfo)
    .then((book) => {
      console.log("------->1")
      return res.status(200).send({
        status:0
      });
    })
    .catch((err) => {
      console.log("------->2")
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
//delete a book
exports.bookDelete = catchAsync(async (req, res) => {
  let userId = req.params.id;
  try {
    await Book.findOneAndDelete({ userId: userId });
    return res.status(200).send({});
  } catch (err) {
    handleError(err, res);
  }
});
