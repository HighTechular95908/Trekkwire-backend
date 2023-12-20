var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var GuideSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  guideOverview: {
    type: String,
    default: "",
  },
  activities: String,
  activities: {
    type: Schema.Types.Array,
    default: [],
  },
  languages: String,
  languages: {
    type: Schema.Types.Array,
    default: [],
  },
  availableTravels: [
    {
      travelId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      travelName: {
        type: String,
        required: [true, "Insert your travelName"],
      },
      travelImageUrl: {
        type: String,
        default: "",
      },
      hour: {
        type: Number,
        required: [true, "Insert your travel duration"],
      },
      price: {
        type: Number,
        required: [true, "Insert your travel Price"],
      },
      available: {
        type: Boolean,
        default: true, //
      },
    },
  ],
  social: {
    facebook: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    youtube: {
      type: String,
      default: "",
    },
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

mongoose.model("Guide", GuideSchema, "guide");
