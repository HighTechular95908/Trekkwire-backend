var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var TravelerSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  booking: [
    {
      bookId:{
        type:Schema.Types.ObjectId
      },
      userId: { // guideId
        type: String,
        required: true,
      },
      travelId: {
        type: String,
        required: true,
      },
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
