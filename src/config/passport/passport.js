var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt'); 
var Account;

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        console.log("Serializing");

        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        console.log("Deseriaize User");
        console.log(user);
        done(null, user);
    });

    // passport.deserializeUser(function(username, done) {
    //     Account.findByUsername(username).then(function(user) {
    //       console.log('deserializing user:',user);
    //       done(null, user); 
    //     }).catch(function(err) {
    //       if (err) {
    //         throw err;
    //       }
    //     });
    // });

    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // pass the request to the callback
    }, async (req, username, password, done) => { // email and password from form

        if (req.headers.referer.includes('customer')){
            console.log('This is a customer');
            Account = require('../../app/models/User');
        } else {
            console.log('This is an admin');
            Account = require('../../app/models/Admin');
        }

        console.log('processing');
        var account = await Account.findOne({ 'username' :  username });
        console.log('ok');
        
        if (!account) // not exists
            return done(null, false); 

        var checkPass = await account.comparePassword(password);
        console.log('passed')

        if (!checkPass)  // wrong password
            return done(null, false); 

        console.log('success');
        return done(null, account);
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // pass the request to the callback
    }, async (req, username, password, done) => {
        var newUser;

        console.log('processing');
        console.log(req);
        

        if (req.headers.referer.includes('customer')){
            console.log('This is a customer');
            Account = require('../../app/models/User');
            
            // set the user's local credentials
            newUser = new Account(req.body);            
            newUser.slug = 'user-' + username;
        } else {
            console.log('This is an admin');
            Account = require('../../app/models/Admin');
            
            // set the user's local credentials
            newUser = new Account(req.body);
            newUser.slug = 'admin-' + username;
        }

        newUser.username = username;
        const hashedPassword = await bcrypt.hash(password, 7);
        newUser.password = hashedPassword;

        var account = await Account.findOne({ 'username' :  username });

        if (account) { // already existed
            // return done(null, user);
            console.log('Existed');
            return done(null, false);
        } 
        // return done(null, false);

        // save the user
        newUser.save();

        // User.create({username: username, password: password});
        console.log('created');
        return done(null, newUser);
    }));
}