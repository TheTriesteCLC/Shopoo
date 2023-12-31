const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../../config/passport/passport')(passport);

const siteController = require('../../app/adminControllers/siteController');

router.post('/stored', siteController.stored);

router.use('/tables/:slug', siteController.viewUserProfile);
router.use('/sign-up', siteController.signUp);
router.use('/sign-in', siteController.signIn);
router.use('/profile', siteController.profile);
router.use('/notifications', siteController.notifications);
router.use('/rtl', siteController.rtl);
router.use('/virtual-reality', siteController.virtualReality);
router.use('/billing', siteController.billing);
router.use('/tables', siteController.tables);
router.use('/dashboard', siteController.dashboard);
router.use('/home', siteController.home);
router.use('/', siteController.index);

//Route middleware to make sure an admin is logged in
function isLoggedIn(req, res, next) {

    console.log("Authenticate checking");
    if (req.isAuthenticated()) { // is authenticated
        return next();
    }

    // is not authenticated
    res.redirect('/admin/sign-in');
}

module.exports = router;