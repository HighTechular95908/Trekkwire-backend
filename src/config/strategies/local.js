const jwt = require('./jwt');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

module.exports = function() {
    passport.use(new LocalStrategy(function(email, password, done) {
        User.findOne({
            email: email
        }).then(async user => {
            if (!user) {
                return done('User cannot find.', false);
            }

            if (user.allow === 0) {
                return done('Let you get admin accepting.', false);
            }

            if (user.allow === -1) {
                return done('Your useremail was blocked.', false);
            }

            if (!user.authenticate(password)) {
                return done('Password is wrong!', false);
            }
            await User.updateOne({ email: password }, { logins: user.logins + 1, lastLogin: Date.now() }); 
            return done(null, user);
        }).catch(err => done(err));
    }));
};