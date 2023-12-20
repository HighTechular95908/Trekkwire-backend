const getToken = require("../config/utils/getToken");
const handleError = require("../config/utils/handleError");
const catchAsync = require("../config/utils/catchAsync");
const { PATH_IMAGE_UPLOAD } = require("../config/constants");

var { LANGUAGES, ACTIVITIES } = require("../config/constants");
const upload = require("../config/upload");
var mongoose = require("mongoose"),
  User = mongoose.model("User"),
  Traveler = mongoose.model("Traveler"),
  Guide = mongoose.model("Guide"),
  jwt = require("jsonwebtoken"),
  url = require("url"),
  config = require("../config/config");
//upload user's avatar, objecs.jpeg
exports.avatar = catchAsync(async (req, res) => {
  let userId = req.params.id;
  let base64Data = req.body.uri;
  upload("avatar", userId, base64Data, res);
  let avatarUrl = `${PATH_IMAGE_UPLOAD}/avatar/${userId}.jpeg`; // /assets/media/images/avatar/objectId.jpeg
  await User.findByIdAndUpdate(userId, { avatar: avatarUrl })
    .then((user) => {
      return res.status(200).send({});
    })
    .catch((err) => {
      handleError(err, res);
    });
});
exports.register = (req, res) => {
  let { fullName, email, password, phone, gender, birth } = req.body;
  User.findOne({ email: email })
    .then(async (user) => {
      if (user) {
        console.error("Same Email Already exist !");
        return res.status(400).send({
          code: "400",
          error: "Same Email Already exist !",
        });
      } else {
        User.create({
          fullName,
          email,
          password,
          phone,
          gender,
          birth,
        })
          .then((user) => {
            console.log(user.id);
            Traveler.create({ user: user.id });
          })
          .then((user) => {
            return res.status(200).send(req.body);
          })
          .catch((err) => {
            console.error("Database Server don't works.");
            return res.status(500).send({
              code: "500",
              error: "Database Server don't works.",
            });
          });
      }
    })
    .catch((err) => {
      console.error("Database Server don't works.");
      return res.status(500).send({
        code: "500",
        error: "Database Server don't works.",
      });
    });
};
exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({
    email: email,
  })
    .then(async (user) => {
      if (!user) {
        // return done("User cannot find.", false);
        console.error("User cannot find");
        return res.status(404).send({
          code: "404",
          error: "User Not found!!!",
        });
      }
      if (user.allow === 0) {
        console.error("UnAuthorized");
        return res.status(401).send({
          code: "401",
          error: "UnAuthorized",
        });
      }

      if (user.allow === -1) {
        console.error("User Blocked");
        return res.status(401).send({
          code: "401",
          error: "User Blocked",
        });
      }

      if (!user.authenticate(password)) {
        console.error("Password Wrong!");
        return res.status(401).send({
          code: "404",
          error: "Password Wrong!",
        });
      }
      await User.updateOne(
        { email: email },
        { logins: user.logins + 1, lastLogin: Date.now() }
      );
      return res.status(200).send({
        token: getToken(user),
        user: user,
        languages: LANGUAGES,
        activities: ACTIVITIES,
      });
    })
    .catch((err) => {
      console.error("Database Server don't works.");
      handleError(err, res);
    });
};



exports.all = (req, res) => {
  Traveler.find()
    .populate("user", ["fullName", "ratingCount", "guideOverview"])
    .select("-password -salt")
    .then((users) => {
      console.log(users);
      return res.status(200).send(users);
    })
    .catch((err) => {
      return res.status(400).send({
        code: "400",
        error: "users No exist",
      });
    });
};
//???
exports.search = (req, res) => {
  var location = req.query._location;
  var name = req.query._name;
  if ((location == "" && name == "") || (location == null && name == null)) {
    console.log("---------->both are null or empty");
    User.find()
      .select("-password -salt")
      .then((users) => {
        return res.status(200).send(users);
      })
      .catch((err) => {
        return res.status(400).send({
          code: "400",
          error: "users No exist",
        });
      });
  } else {
    let regFilter = {};
    if (name == "" || name == null) {
      console.log("----------->case1");
      regFilter = {
        $or: [
          { city: { $regex: location, $options: "i" } }, // Case-insensitive search for location
          { country: { $regex: location, $options: "i" } }, // Case-insensitive search for location
        ],
      };
    } else if (location == "" || location == null) {
      console.log("----------->case2");
      regFilter = {
        $or: [
          { fullName: { $regex: name, $options: "i" } }, // Case-insensitive search for name
        ],
      };
    } else {
      console.log("----------->case3");
      regFilter = {
        $or: [
          { fullName: { $regex: name, $options: "i" } }, // Case-insensitive search for name
          { city: { $regex: location, $options: "i" } }, // Case-insensitive search for location
          { country: { $regex: location, $options: "i" } }, // Case-insensitive search for location
        ],
      };
    }

    User.find(regFilter)
      .select("-password -salt")
      .then((users) => {
        if (users.length === 0) {
          // Handle the case where the filtered guide does not exist
          console.log("No guides found for the specified search value");
          return res.status(400).send({
            code: "400",
            error: "users No exist",
          });
        } else {
          return res.status(200).send(users);
          // Use the retrieved guides as needed
        }
      })
      .catch((err) => {
        console.error(err);
        handleError(err, res);
        // Handle the error
      });
  }
};
exports.loginWithToken = (req, res) => {
  let { token } = req.body;
  jwt.verify(token, config.secret, (err, payload) => {
    if (err) return res.status(401).send("Unauthorized.");
    else {
      User.findById(payload._id)
        .select("-password -salt")
        .then((user) => {
          return res.status(200).send({
            token: getToken(user),
            user,
          });
        })
        .catch((err) => handleError(err, res));
    }
  });
};
exports.detail = (req, res) => {
  User.findById(req.params.id)
    .select("-password -salt")
    .then((user) => {
      if (!user) return res.status(404).send("Cannot find user.");
      else return res.status(200).send(user);
    })
    .catch((err) => handleError(err, res));
};
exports.list = (req, res) => {
  var { search } = url.parse(req.url, true).query;
  var query = [
    {
      $project: {
        password: 0,
        lastLogin: 0,
        logins: 0,
        role: 0,
        allow: 0,
        salt: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    },
  ];
  if (search) {
    query.unshift({
      $match: {
        $or: [
          {
            useremail: {
              $regex: search,
              $options: "i",
            },
          },
          {
            name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            address: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      },
    });
  }
  User.aggregate(query)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => handleError(err, res));
};
exports.update = catchAsync(async (req, res) => {
  let id = req.params.id;
  let userInfo = req.body;
  if (userInfo.email) {
    User.findOne({
      email: userInfo.email,
    }).then(async (user) => {
      if (user) {
        console.error("Same Email Already exist !");
        return res.status(400).send({
          code: "400",
          error: "Same Email Already exist !",
        });
      } else {
        await User.findByIdAndUpdate(id, userInfo);
        res.status(200).send({});
      }
    });
  } else {
    await User.findByIdAndUpdate(id, userInfo);
  }
});
exports.delete = catchAsync(async (req, res) => {
  let id = req.params.id;
  await User.findByIdAndDelete(id);
  res.status(200).send("Successfully deleted.");
});
//password change
exports.changePassword = catchAsync(async (req, res) => {
  let id = req.params.id;
  let { password_cur, password_new } = req.body;
  let user = await User.findById(id);
  if (!user.authenticate(password_cur)) {
    //password wrong
    console.error("Current Password Wrong!");
    return res.status(400).send({
      code: "400",
      error: "Current Password Wrong!",
    });
  } else {
    user.password = password_new;
    await user.save();
    res.status(200).send({});
  }
});
exports.formatPassword = catchAsync(async (req, res) => {
  let id = req.params.id;
  let user = await User.findById(id);
  user.password = "1234567890";
  await user.save();
  res.status(200).send("Successfully updated.");
});
