const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');
const Product = require('../models/Product');

class shopSingleController {

  //[GET] /shop-single/all
  index(req, res, next) {
    Product.find({})
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'All', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }





  //[GET] /shop-single/outer
  outer(req, res, next) {
    Product.find({ outer: true })
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'Outerwear', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/top
  top(req, res, next) {
    Product.find({ top: true })
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'Top', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/bottom
  bottom(req, res, next) {
    Product.find({ bottom: true })
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'Bottom', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/accessories
  accessories(req, res, next) {
    Product.find({ accessories: true })
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'Accessories', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/shoes
  shoes(req, res, next) {
    Product.find({ shoes: true })
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'Shoes', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }



  //[GET] /shop-single/price-asc
  priceAsc(req, res, next) {
    Product.find({}).sort({ price: 1 })
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'All', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/price-dec
  priceDec(req, res, next) {
    Product.find({}).sort({ price: -1 })
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'All', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/price-50
  price50(req, res, next) {
    Product.find({ price: { $lt: 50 } }).sort({ price: 1 })
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'All', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/price-100
  price100(req, res, next) {
    Product.find({ price: { $lt: 100 } }).sort({ price: 1 })
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'All', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/price-300
  price300(req, res, next) {
    Product.find({ price: { $lt: 300 } }).sort({ price: 1 })
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'All', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }





  //[GET] /shop-single/england
  england(req, res, next) {
    Product.find({ from: 'England' })
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'From England', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/japan
  japan(req, res, next) {
    Product.find({ from: 'Japan' })
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'From Japan', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/korea
  korea(req, res, next) {
    Product.find({ from: 'Korea' })
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'From Korea', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/viet-nam
  vietnam(req, res, next) {
    Product.find({ from: 'Viet Nam' })
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'From Viet Nam', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/us
  us(req, res, next) {
    Product.find({ from: 'US' })
      .then(products => {
        res.render('customer/shop-single', { layout: 'customer/main', title: 'From US', products: multipleMongooseToObject(products) });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }



  //[GET] /shop-single/:id
  item(req, res) {
    res.render('customer/item', { layout: 'customer/main' });
  }

}

module.exports = new shopSingleController;