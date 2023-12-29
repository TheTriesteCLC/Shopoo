var LocalStrategy = require('passport-local').Strategy;
var User = require('../../app/models/User');
var bcrypt = require('bcrypt'); 

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        console.log("Serializing");

        done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {
        User.findByUsername(username).then(function(user) {
          console.log('deserializing user:',user);
          done(null, user);
        }).catch(function(err) {
          if (err) {
            throw err;
          }
        });
    });

}