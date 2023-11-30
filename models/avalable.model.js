var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  crypto = require("crypto");

var AvailableTravelSchema = new Schema(
  {
    userId: {
      type: String,
    },
    travelName: {
      type: String,
      required: [true, "Insert your travelName"],
      unique: [true, "travelName have to be unique string."],
    },
    travelType: {
      type: String,
      required: [true, "Insert your travelType"],
      unique: [true, "travelType have to be unique string."],
    },
    travelIntroImageUrl: {
      type: String,
      required: [true, "Insert your travelName"],
    },
    hour: {
      type: Number,
      required: [true, "Insert your travelName"],
    },
    price: {
      type: Number,
      required: [true, "Insert your travelName"],
    },
    special: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
