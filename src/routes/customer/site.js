const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../../config/passport/passport')(passport);
const jwt = require("jsonwebtoken");

const { generateToken, getMailOptions, getTransport } = require("../../config/service/service");

const siteController = require('../../app/customerControllers/siteController');

//Login
router.get('/login', siteController.login);
router.post('/login',
    passport.authenticate('local-login', { failureRedirect: './login' }),
    function (req, res) {
        console.log("redirecting");
        var email = req.user.email;
        //Prepare variables
        const token = generateToken({
            email: email
        });
        const link = `http://localhost:3000/customer/verify?token=${token}`;
        console.log("link");
        console.log(link);

        //Create mailrequest
        let mailRequest = getMailOptions(email, link);
        

        //Send mail
        // return getTransport().sendMail(mailRequest, (error) => {
        //     if (error) {
        //         res.status(500).send("Can't send email.");
        //     } else {
        //         res.status(200);
        //         res.send({
        //             message: `Link sent to ${email}`,
        //         });
        //     }
        // });
        res.send({
            message: `Link: ${link}`,
        });

    }
);

//Verify
router.get('/verify', (req, res) => {
    console.log("VERIFY");
    console.log(req.user);
    const token = req.query.token;
    console.log("token");
    console.log(token);

    if (Object.keys(token).length === 0) {
      res.status(401).send("Invalid user token");
      return;
    }
  
    const secretKey = '440457';
    let decodedToken;
    try {

        decodedToken = jwt.verify(token, secretKey);
    } catch(err) {
        console.log(err);
        res.status(401).send("Invalid authentication credentials");
        return;
    }
  
    if (
      !decodedToken.hasOwnProperty("email")
    ) {
      res.status(401).send("No email found");
      return;
    }

    console.log("decodedToken");
    console.log(decodedToken);

    // const expirationDate = decodedToken;
    // if (expirationDate < new Date()) {
    //     console.log("Token has expired.");
    //     return;
    // }  
    res.redirect('./protected');
});

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
router.get('/logout',isLoggedIn, siteController.logout);

//Test authentication
router.get('/protected', isLoggedIn, siteController.protected);

//Email

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
        if (req.user.status === "Active") { // is not Banned
            return next();
        }
    }

    // is not authenticated
    res.redirect('/customer/login');
}

module.exports = router;