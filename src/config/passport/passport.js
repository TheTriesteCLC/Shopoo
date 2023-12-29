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

    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // pass the request to the callback
    }, async (req, username, password, done) => { // email and password from form
        console.log('proccessing');
        var user = await User.findOne({ 'username' :  username });
        console.log('ok');
        
        if (!user) // not exists
            return done(null, false); 

        var checkPass = await user.comparePassword(password);
        console.log('passed')

        if (!checkPass)  // wrong password
            return done(null, false); 

        console.log('success');
        return done(null, user);
    }));

}