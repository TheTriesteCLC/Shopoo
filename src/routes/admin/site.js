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

//Ban or unban user
router.post('/tables/user/update/:slug', siteController.updateUserSuccess);

//Update product info
router.post('/tables/product/order/update/:slug', siteController.updateOrderSuccess);
router.post('/tables/product/update/:slug', siteController.updateProductSuccess);
// router.get('/update-profile/:slug', siteController.updateProfile);
// router.post('/update-profile/updated', siteController.update);


router.get('/tables/user/:slug', isLoggedIn, siteController.viewUserProfile);
router.get('/tables/product/:slug', isLoggedIn, siteController.viewProductProfile);
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