var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var TravelerSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
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
