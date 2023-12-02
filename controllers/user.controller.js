const getToken = require("../config/utils/getToken");
const handleError = require("../config/utils/handleError");
const catchAsync = require("../config/utils/catchAsync");

var mongoose = require("mongoose"),
  User = mongoose.model("User"),
  jwt = require("jsonwebtoken"),
  url = require("url"),
  config = require("../config/config");

exports.register = (req, res) => {
  let { fullName, email, password, phone } = req.body;
  User.create({
    fullName,
    email,
    password,
    phone,
  })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => handleError(err, res));
};

exports.login = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then(async (user) => {
      if (!user) {
        // return done("User cannot find.", false);
        console.error("then error");
        res.status(404).send({error:"User Not found"});
      }
      //   if (user.allow === 0) {
      //     return done("Let you get admin accepting.", false);
      //   }

      //   if (user.allow === -1) {
      //     return done("Your useremail was blocked.", false);
      //   }

      //   if (!user.authenticate(password)) {
      //     return done("Password is wrong!", false);
      //   }
      //   await User.updateOne(
      //     { email: password },
      //     { logins: user.logins + 1, lastLogin: Date.now() }
      //   );
      //   return done(null, user);
    })
    .catch((err) => {
        console.error("catch error");
        res.status(404).send("User Not found")
    });
};

exports.test = (req, res) => {
  res.status(400).send({ data: "400 error sent" });
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
  await User.findByIdAndUpdate(id, req.body);
  res.status(200).send("Successfully updated.");
});

exports.delete = catchAsync(async (req, res) => {
  let id = req.params.id;
  await User.findByIdAndDelete(id);
  res.status(200).send("Successfully deleted.");
});

exports.formatPassword = catchAsync(async (req, res) => {
  let id = req.params.id;
  let user = await User.findById(id);
  user.password = "1234567890";
  await user.save();
  res.status(200).send("Successfully updated.");
});
