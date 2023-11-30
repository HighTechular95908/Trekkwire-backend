var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  crypto = require("crypto");

var GuideSchema = new Schema(
  {
    userId: {
      type: String,
    },
    skill: {
      type: Schema.Types.Array,
      default: [],
    },
    language: {
      type: Schema.Types.Array,
      default: [],
    },
    availableTravels: {
      type: Object,
      default: {},
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
