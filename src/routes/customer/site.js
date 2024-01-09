const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../../config/passport/passport')(passport);

const { generateToken, getMailOptions, getTransport } = require("../../config/service/service");

const siteController = require('../../app/customerControllers/siteController');

//Login
router.get('/login', siteController.login);
router.post('/login',
    passport.authenticate('local-login', { failureRedirect: './login?status=failed' }),
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
router.post('/signup/available', siteController.avalable);
router.get('/signup', siteController.signup);
router.post('/signup',
    passport.authenticate('local-signup', { failureRedirect: './signup' }),
    function (req, res) {
        console.log("redirecting");
        console.log(req.user);
        var email = req.user.email;
        //Prepare variables
        const token = generateToken({
            email: email
        });
        const link = `https://shopoo.onrender.com/customer/verify?token=${token}`;
        console.log("link");
        console.log(link);

        //Create mailrequest
        let mailRequest = getMailOptions(email, link);

        //Send mail
        return getTransport().sendMail(mailRequest, (error) => {
            if (error) {
                res.status(500).send("Can't send email.");
            } else {
                // res.status(200);
                // res.send({
                //     message: `Link sent to ${email}`,
                // });
                res.redirect('./activate');
            }
        });
    }
);



//Activate profile
router.get('/activate', isPending, siteController.activate);

//Verify profile
router.get('/verify', siteController.verify);

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
router.get('/about', siteController.about);
router.get('/home', siteController.home);
router.get('/', siteController.index);

//Route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    console.log("Authenticate checking");
    if (req.isAuthenticated()) { // is authenticated
        if (req.user.status === "Active") { // is not Banned or Pending
            console.log("is Active");
            return next();
        } else
            if (req.user.status === "Pending") { // is Pending
                console.log("is Pending")
                res.redirect('/customer/activate');
            } else console.log("is Banned");
    } else {
        console.log("is not authenticated")
        // is not authenticated
        res.redirect('/customer/login');
    }

}

function isPending(req, res, next) {
    if (req.isAuthenticated()) { // is authenticated
        if (req.user.status === "Pending") {
            return next();
        }
    }
    res.redirect('/customer/');
}

module.exports = router;