const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../../config/passport/passport')(passport);

const siteController = require('../../app/adminControllers/siteController');

//Login
router.get('/login', siteController.login);
router.post('/login',
    passport.authenticate('local-login', { failureRedirect: './login' }),
    function (req, res) {
        console.log("redirecting");
        res.redirect('./home');
    }
);

//Signup new profile
router.get('/signup', siteController.signup);
router.post('/signup',
    passport.authenticate('local-signup', { failureRedirect: './signup' }),
    function (req, res) {
        console.log("redirecting");
        res.redirect('./home');
    }
);

//Logout
router.get('/logout', siteController.logout);

router.get('/tables/:slug', isLoggedIn, siteController.viewUserProfile);
router.get('/profile', isLoggedIn, siteController.profile);
router.get('/notifications', isLoggedIn, siteController.notifications);
router.get('/rtl', isLoggedIn, siteController.rtl);
router.get('/virtual-reality', isLoggedIn, siteController.virtualReality);
router.get('/billing', isLoggedIn, siteController.billing);
router.get('/tables', isLoggedIn, siteController.tables);
router.get('/dashboard', isLoggedIn, siteController.dashboard);
router.get('/home', isLoggedIn, siteController.home);
router.get('/', isLoggedIn, siteController.index);

//Route middleware to make sure an admin is logged in
function isLoggedIn(req, res, next) {

    console.log("Authenticate checking");
    if (req.isAuthenticated()) { // is authenticated
        return next();
    }

    // is not authenticated
    res.redirect('/admin/login');
}

module.exports = router;