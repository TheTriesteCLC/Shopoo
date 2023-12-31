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

module.exports = router;