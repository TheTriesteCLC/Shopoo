const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../../config/passport/passport')(passport);

const shopSingleController = require('../../app/customerControllers/shopSingleController');

router.post('/adding', isLoggedIn, shopSingleController.adding);
router.post('/review', isLoggedIn, shopSingleController.review);
router.post('/search', shopSingleController.search);

// router.use('/outer', shopSingleController.outer);
// router.use('/top', shopSingleController.top);
// router.use('/bottom', shopSingleController.bottom);
// router.use('/accessories', shopSingleController.accessories);
// router.use('/shoes', shopSingleController.shoes);

router.use('/price-asc', shopSingleController.priceAsc);
router.use('/price-dec', shopSingleController.priceDec);
router.use('/price-50', shopSingleController.price50);
router.use('/price-100', shopSingleController.price100);
router.use('/price-300', shopSingleController.price300);

router.use('/from', shopSingleController.from);
router.use('/collection', shopSingleController.collection);


router.use('/all', shopSingleController.index);
router.use('/product/:slug', shopSingleController.item);
router.use('/:slug', shopSingleController.index); // ?page=
// router.use('/:slug', shopSingleController.item);
// router.use('/:id', shopSingleController.item);
router.use('/', shopSingleController.index);

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