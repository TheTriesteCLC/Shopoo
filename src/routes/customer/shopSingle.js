const express = require('express');
const router = express.Router();

const shopSingleController = require('../../app/customerControllers/shopSingleController');

router.use('/:slug', shopSingleController.item);
router.use('/', shopSingleController.index);

module.exports = router;