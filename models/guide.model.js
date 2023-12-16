var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var GuideSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  guideOverview:{
    type:String,
    default:""
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
      travelName: {
        type: String,
        required: [true, "Insert your travelName"],
      },
      travelType: {
        type: String,
        required: [true, "Insert your travelType"],
      },
      travelIntroImageUrl: {
        type: String,
        // required: [true, "Insert your travel IntroImage"],
        default:""
      },
      hour: {
        type: Number,
        required: [true, "Insert your travel duration"],
      },
      price: {
        type: Number,
        required: [true, "Insert your travel Price"],
      },
      availableNow:{
        type: Number,
        default:1 //0: not available, -1: blocked
      }
    },
  ],
  social: [
    {
      facebook: {
        type: String,
        default:""
      },
      linkedin: {
        type: String,
        default:""
      },
      youtube: {
        type: String,
        default:""
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

mongoose.model("Guide", GuideSchema, "guide");
