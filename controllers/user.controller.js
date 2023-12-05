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
        })
          .then((user) => {
            res.status(200).send(req.body);
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
      });
    })
    .catch((err) => {
      console.error("Database Server don't works.");
      return res.status(500).send({
        code: "500",
        error: "Database Server don't works.",
      });
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
