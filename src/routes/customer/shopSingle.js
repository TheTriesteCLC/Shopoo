const express = require('express');
const router = express.Router();

const shopSingleController = require('../../app/customerControllers/shopSingleController');

router.use('/item', shopSingleController.item);
// router.use('/:id', shopSingleController.item);


router.use('/outer', shopSingleController.outer);
router.use('/top', shopSingleController.top);
router.use('/bottom', shopSingleController.bottom);
router.use('/accessories', shopSingleController.accessories);
router.use('/shoes', shopSingleController.shoes);

router.use('/price-asc', shopSingleController.priceAsc);
router.use('/price-dec', shopSingleController.priceDec);
router.use('/price-50', shopSingleController.price50);
router.use('/price-100', shopSingleController.price100);
router.use('/price-300', shopSingleController.price300);

router.use('/from', shopSingleController.from);
router.use('/collection', shopSingleController.collection);


router.use('/all', shopSingleController.index);
router.use('/', shopSingleController.index);

module.exports = router;