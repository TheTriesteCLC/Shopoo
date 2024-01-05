const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../../config/passport/passport')(passport);

const siteController = require('../../app/customerControllers/siteController');

//Login
router.get('/login', siteController.login);
router.post('/login',
    passport.authenticate('local-login', { failureRedirect: './login' }),
    function (req, res) {
        console.log("redirecting");
        res.redirect('./protected');
    }
);

//Forgot password
router.get('/forgot-password', siteController.forgot);
router.post('/forgot-success', siteController.forgotSuccess);

//Update profile
router.get('/profile/', isLoggedIn, siteController.profile);
router.get('/update-profile/', isLoggedIn, siteController.updateProfile);
router.post('/update-profile/updated/', siteController.update);

//Signup new profile
router.get('/signup', siteController.signup);
router.post('/signup',
    passport.authenticate('local-signup', { failureRedirect: './signup' }),
    function (req, res) {
        console.log("redirecting");
        res.redirect('./protected');
    }
);

//Logout
router.get('/logout', siteController.logout);

//Test authentication
router.get('/protected', isLoggedIn, siteController.protected);

//Cart 
router.get('/cart', isLoggedIn, siteController.cart);
router.post('/update-cart/', siteController.updateCart);

//Checkout
router.get('/checkout/', isLoggedIn, siteController.checkout);
router.post('/checkout-success/', siteController.checkoutSuccess);

//View Order
router.get('/order/', isLoggedIn, siteController.order);

//Trivial path
router.get('/thankyou', isLoggedIn, siteController.thankyou);
router.get('/contact', siteController.contact);
router.get('/elements', siteController.elements);
router.get('/about',siteController.about);
router.get('/home', siteController.home);
router.get('/', siteController.index);

//Route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    console.log("Authenticate checking");
    if (req.isAuthenticated()) { // is authenticated
        return next();
    }

    // is not authenticated
    res.redirect('/customer/login');
}

module.exports = router;