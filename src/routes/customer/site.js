const express = require('express');
const router = express.Router();

const siteController = require('../../app/customerControllers/siteController');

router.post('/login-success', siteController.loginSuccess);
router.post('/stored', siteController.stored);
router.use('/login', siteController.login);
router.use('/sign-up', siteController.signup);
router.use('/thankyou', siteController.thankyou);
router.use('/checkout', siteController.checkout);
router.use('/cart', siteController.cart);
router.use('/contact', siteController.contact);
router.use('/elements', siteController.elements);
router.use('/about', siteController.about);
router.use('/home', siteController.home);
router.use('/', siteController.index);

module.exports = router;