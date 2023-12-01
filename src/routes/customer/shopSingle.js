const express = require('express');
const router = express.Router();

const shopSingleController = require('../../app/customerControllers/shopSingleController');

router.use('/item', shopSingleController.item);
// router.use('/:id', shopSingleController.item);
router.use('/:slug', shopSingleController.index);
router.use('/', shopSingleController.index);

module.exports = router;