const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport/passport')(passport);

const siteController = require('../../app/customerControllers/siteController');

//Login
router.use('/login', siteController.login);
router.post('/login',
passport.authenticate('local-login', { failureRedirect : './login'}), 
function(req,res){
    console.log("redirecting");
    res.redirect('./protected');
}, siteController.loginPost);

//Update profile
router.use('/profile/:slug', siteController.profile);
router.use('/update-profile/:slug', siteController.updateProfile);
router.post('/update-profile/updated', siteController.update);

//Signup new profile
router.use('/signup', siteController.signup);
router.post('/signup', 
passport.authenticate('local-signup', { failureRedirect : './signup'}), 
function(req,res){
    console.log("redirecting");
    res.redirect('./protected');
}, siteController.signupPost);

//Cart 
router.use('/cart-login', siteController.loginCart);
router.post('/cart-login-success', siteController.loginCartSuccess);
router.use('/cart/:slug', siteController.cart);
router.post('/update-cart/:slug', siteController.updateCart);

//Trivial path
router.use('/thankyou', siteController.thankyou);
router.use('/checkout', siteController.checkout);
router.use('/contact', siteController.contact);
router.use('/elements', siteController.elements);
router.use('/about', siteController.about);
router.use('/home', siteController.home);
router.use('/', siteController.index);

//Route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    console.log("Authenticate checking");
    if (req.isAuthenticated()){ // is authenticated
        return next();
    }

    // is not authenticated
    res.redirect('/user/login');
}

module.exports = router;