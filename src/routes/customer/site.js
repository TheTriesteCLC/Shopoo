const express = require('express');
const router = express.Router();

const siteController = require('../../app/customerControllers/siteController');

//Login and update profile
router.use('/login', siteController.login);
router.post('/login-success', siteController.loginSuccess);
router.use('/profile/:slug', siteController.profile);
router.use('/update-profile/:slug', siteController.updateProfile);
router.post('/update-profile/updated', siteController.update);

//Signup new profile
router.use('/sign-up', siteController.signup);
router.post('/stored', siteController.stored);

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

module.exports = router;