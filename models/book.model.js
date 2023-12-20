var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var BookSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
  },
  travelerId: {
    // guideId for traveler, where it indicates itself since guide model
    type: String,
    required: true,
  },
  guideId: {
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
    default: "",
  },
  email: {
    type: String,
    default: "",

  },
  where: {
    type: String,
    default: "",

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
    default: "",

  },
  city: {
    type: String,
    default: "",

  },
  travelName: {
    type: String,
    default: "",
  },
  travelImageUrl: {
    type: String,
    default: "",

  },
  price: {
    type: Number,
    default: 0,

  },
  hour: {
    type: Number,
    default: 0,

  },
  status: {
    type: Number,
    default: 0, //0->no allow, 1-> accept by guide, 2->End
  },
  staredStatus: {
    type: Number,
    default: 0, //0->no stared, 1-> stared by guide, 2-> stared by guide
  },
});

mongoose.model("Book", BookSchema, "Book");
