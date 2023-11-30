var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  crypto = require("crypto");

var BookingInfo = new Schema(
  {
    userId: {
      guideId: {
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
  },
  {
    timestamps: true,
  }
);
