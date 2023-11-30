const getToken = require("../config/utils/getToken");
const handleError = require("../config/utils/handleError");
const catchAsync = require("../config/utils/catchAsync");

var mongoose = require("mongoose"),
    User = mongoose.model("User"),
    jwt = require("jsonwebtoken"),
    url = require("url"),
    config = require("../config/config");

exports.register = (req, res) => {
    let { useremail, password = "1234567890", fullName, gender, birthday, location, phone } = req.body;
    User.create({
        useremail, password, name, gender, birthday, address, phone,
    }).then(user => {
        res.status(200).send(user);
    }).catch(err => handleError(err, res));
}

exports.login = (req, res) => {
    res.status(200).send({
        token: getToken(req.user),
        user: req.user
    });
}

exports.loginWithToken = (req, res) => {
    let { token } = req.body;
    jwt.verify(token, config.secret, (err, payload) => {
        if (err) return res.status(401).send("Unauthorized.");
        else {
            User.findById(payload._id).select('-password -salt').then(user => {
                return res.status(200).send({
                    token: getToken(user),
                    user
                });
            }).catch(err => handleError(err, res));
        }
    });
}

exports.detail = (req, res) => {
    User.findById(req.params.id)
        .select("-password -salt")
        .then(user => {
            if (!user) return res.status(404).send("Cannot find user.");
            else return res.status(200).send(user);
        }).catch(err => handleError(err, res));
}

exports.list = (req, res) => {
    var { search } = url.parse(req.url, true).query;
    var query = [
        {
            $project: {
                password: 0, lastLogin: 0, logins: 0, role: 0, allow: 0, salt: 0, createdAt: 0, updatedAt: 0
            }
        }
    ];
    if (search) {
        query.unshift({
            $match: {
                $or: [
                    {
                        useremail: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        name: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                    {
                        address: {
                            $regex: search,
                            $options: "i"
                        }
                    },
                ]

            }
        });
    };
    User.aggregate(query).then(data => {
        res.status(200).send(data);
    }).catch(err => handleError(err, res));
}

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