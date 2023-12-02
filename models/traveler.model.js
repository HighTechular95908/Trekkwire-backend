var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  crypto = require("crypto");

var TravelerSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    booking: [
      {
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
    ],
  },
  {
    timestamps: true,
  }
);
