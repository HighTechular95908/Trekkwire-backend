var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var TravelerSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  booking: [
    {
      bookId: {
        type: Schema.Types.ObjectId,
      },
      userId: {
        // guideId
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
    },
  ],
  rating: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
});
mongoose.model("Traveler", TravelerSchema, "traveler");
