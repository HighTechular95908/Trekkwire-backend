var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var TravelerSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  booking: [
    {
      guideId: {
        type: String,
        required: true,
      },
      travelId: {
        type: String,
        required: true,
      },
      travelName: {
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
