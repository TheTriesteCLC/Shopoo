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
        res.redirect('./dashboard');
    }
);

//Signup new profile
router.get('/signup', isLoggedIn, siteController.signup);
router.post('/signup',
    passport.authenticate('local-signup', { failureRedirect: './signup' }),
    function (req, res) {
        console.log("redirecting");
        res.redirect('./dashboard');
    }
);

//Logout
router.get('/logout', isLoggedIn, siteController.logout);

//Ban or unban user
router.post('/tables/user/update/:slug', siteController.updateUserSuccess);

//Update product status
router.post('/tables/product/order/update/:slug', siteController.updateOrderSuccess);
router.post('/tables/product/update/:slug', siteController.updateProductSuccess);
router.get('/product/add', isLoggedIn, siteController.addProduct);
router.post('/product/save', siteController.saveProduct);
// router.get('/update-profile/:slug', siteController.updateProfile);
// router.post('/update-profile/updated', siteController.update);


//Update product info
router.get('/tables/product/update-info/:slug', isLoggedIn, siteController.updateProductProfile);
router.post('/tables/product/update-info/updated/:slug', siteController.updateProductProfileSuccess);

//Tables
router.get('/tables/user/:slug', siteController.viewUserProfile);
router.get('/tables/name/', siteController.nameFilter);
router.get('/tables/email/', siteController.emailFilter);
router.get('/tables/name-asc/', siteController.nameAscFilter);
router.get('/tables/email-asc/', siteController.emailAscFilter);
router.get('/tables/time-asc/', siteController.timeAscFilter);

router.get('/tables/product/:slug', isLoggedIn, siteController.viewProductProfile);
router.get('/tables/', siteController.tables);

//product (need fix)
// router.get('/tables/product-popular', isLoggedIn, siteController.tablesProductPopular);
// router.get('/tables/product-outer', isLoggedIn, siteController.tablesProductOuter);
// router.get('/tables/product-top', isLoggedIn, siteController.tablesProductTop);
// router.get('/tables/product-bottom', isLoggedIn, siteController.tablesProductBottom);
// router.get('/tables/product-accessories', isLoggedIn, siteController.tablesProductAccessories);
// router.get('/tables/product-shoes', isLoggedIn, siteController.tablesProductShoes);

//View orders and filtered
router.get('/orders', isLoggedIn, siteController.orders);
router.get('/orders/pending', isLoggedIn, siteController.ordersPending);
router.get('/orders/shipping', isLoggedIn, siteController.ordersShipping);
router.get('/orders/done', isLoggedIn, siteController.ordersDone);
router.post('/orders/time', isLoggedIn, siteController.ordersTime);

//Product report
router.get('/product-report', isLoggedIn, siteController.productReport);
router.post('/product-report/time', isLoggedIn, siteController.productReportTime);

//Admin profile
router.get('/profile', isLoggedIn, siteController.profile);
router.get('/update-profile', isLoggedIn, siteController.updateProfile);
router.post('/update-profile/updated', isLoggedIn, siteController.update);


//Trivial path

router.get('/virtual-reality', isLoggedIn, siteController.virtualReality);
router.get('/billing', isLoggedIn, siteController.billing);

//Report in dashboard
router.post('/dashboard/time', isLoggedIn, siteController.dashboardTime);
router.get('/dashboard', isLoggedIn, siteController.dashboard);
router.get('/', isLoggedIn, siteController.dashboard);

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