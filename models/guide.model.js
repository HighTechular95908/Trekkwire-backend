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
});

mongoose.model("Guide", GuideSchema, "guide");
