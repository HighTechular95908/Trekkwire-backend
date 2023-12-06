var UserSchema = new Schema(
  {
    useremail: {
      type: String,
      required: [true, "Insert your useremail."],
      unique: [true, "useremail have to be unique string."],
      lowercase: true,
    },
    password: {
      type: String,
      validate: [
        function (password) {
          return password && password.length >= 6;
        },
        "Password must provide over 6 characters.",
      ],
    },
    avatarUrl: {
      type: String,
      default: "photeUrl",
    },
    fullName: {
      type: String,
      required: [true, "Insert name."],
    },
    gender: {
      type: String,
      default: "male", //
    },
    location: {
      country: {
        type: String,
        default: "Japan",
      },
      city: {
        type: String,
        default: "Nagoya",
      },
    },
    phone: {
      type: String,
      default: "555-555-5555",
    },
    contacts: {
      facebook: {
        type: String,
        default: "",
      },
      skype: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      instgram: {
        type: String,
        default: "",
      },
    },
    lastLogin: {
      // lastest login time
      type: Date,
      default: Date.now(),
    },
    logins: {
      // login number
      type: Number,
      default: 0,
    },
    roles: {
      //
      type: Schema.Types.Array,
      default: ["traveler"], // 'traveler' is common user, "admin" is administrator, "guide" is guider
    },
    allow: {
      // using allow
      type: Number,
      default: 1, // 0 is waiting, -1 is block, 1 is accept
    },
    salt: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

var TravelerSchema = new Schema(
  {
    userId: {
      type: String,
    },
    booking: {
      type: Schema.type.Array,
      default: [], //BookingInfo here.
    },
  },
  {
    timestamps: true,
  }
);

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
    rating:{
      type: Number,
      default:0
    }
  },
  {
    timestamps: true,
  }
);

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
