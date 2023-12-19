var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var BookSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
  },
  userId: {
    // guideId for traveler, where it indicates itself since guide model
    type: String,
    required: true,
  },
  travelId: {
    type: String,
    required: true,
  },
  //
  startDate: {
    type: Date,
    default: Date.now(),
  },
  endDate: {
    type: Date,
    default: Date.now(),
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  where: {
    type: String,
    required: true,
  },
  //
  travelerName: {
    type: String,
    required: true,
  },
  guideName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  travelName: {
    type: String,
    required: true,
  },
  travelImageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  hour: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 0, //0->no allow, 1-> accept by gudie
  }
});

mongoose.model("Book", BookSchema, "Book");
