var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  crypto = require("crypto");

var TravelerSchema = new Schema(
  {
    userId: {
      type: String,
    },
    booking: {
      type: Schema.Types.Array,
      default: [], //BookingInfo here.
    },
  },
  {
    timestamps: true,
  }
);
