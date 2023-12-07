var config = require("../config"),
    jwt = require("jsonwebtoken");

// Generate token
module.exports = (user) => {
    var jsonData = {
        _id: user._id,
        email: user.email,
        role: user.role
    };
    return jwt.sign(jsonData, config.secret, {
        expiresIn: '1h'
    });
}