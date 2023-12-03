const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');
const Product = require('../models/Product');

class shopSingleController {

  //[GET] /shop-single/all
  index(req, res, next) {
    let constriesChoice;
    Product.distinct('from').lean()
      .then(countries => {
        constriesChoice = countries;
      })
      .catch(error => next(error));

    let yearsChoice;
    Product.distinct('date').lean()
      .then(years => {
        yearsChoice = years;
      })
      .catch(error => next(error));

    Product.find({})
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'All', products: multipleMongooseToObject(products), countries: constriesChoice, year: yearsChoice });
        // res.json({ title: 'All', products: multipleMongooseToObject(products), countries: constriesChoice });
      })
      .catch(error => next(error));
  }





  //[GET] /shop-single/outer
  outer(req, res, next) {
    let constriesChoice;
    Product.distinct('from').lean()
      .then(countries => {
        constriesChoice = countries;
      })
      .catch(error => next(error));

    let yearsChoice;
    Product.distinct('date').lean()
      .then(years => {
        yearsChoice = years;
      })
      .catch(error => next(error));

    Product.find({ outer: true })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Outerwear', products: multipleMongooseToObject(products), countries: constriesChoice, year: yearsChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/top
  top(req, res, next) {
    let constriesChoice;
    Product.distinct('from').lean()
      .then(countries => {
        constriesChoice = countries;
      })
      .catch(error => next(error));

    let yearsChoice;
    Product.distinct('date').lean()
      .then(years => {
        yearsChoice = years;
      })
      .catch(error => next(error));

    Product.find({ top: true })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Top', products: multipleMongooseToObject(products), countries: constriesChoice, year: yearsChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/bottom
  bottom(req, res, next) {
    let constriesChoice;
    Product.distinct('from').lean()
      .then(countries => {
        constriesChoice = countries;
      })
      .catch(error => next(error));

    let yearsChoice;
    Product.distinct('date').lean()
      .then(years => {
        yearsChoice = years;
      })
      .catch(error => next(error));

    Product.find({ bottom: true })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Bottom', products: multipleMongooseToObject(products), countries: constriesChoice, year: yearsChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/accessories
  accessories(req, res, next) {
    let constriesChoice;
    Product.distinct('from').lean()
      .then(countries => {
        constriesChoice = countries;
      })
      .catch(error => next(error));

    let yearsChoice;
    Product.distinct('date').lean()
      .then(years => {
        yearsChoice = years;
      })
      .catch(error => next(error));

    Product.find({ accessories: true })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Accessories', products: multipleMongooseToObject(products), countries: constriesChoice, year: yearsChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/shoes
  shoes(req, res, next) {
    let constriesChoice;
    Product.distinct('from').lean()
      .then(countries => {
        constriesChoice = countries;
      })
      .catch(error => next(error));

    let yearsChoice;
    Product.distinct('date').lean()
      .then(years => {
        yearsChoice = years;
      })
      .catch(error => next(error));

    Product.find({ shoes: true })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Shoes', products: multipleMongooseToObject(products), countries: constriesChoice, year: yearsChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }





  //[GET] /shop-single/price-asc
  priceAsc(req, res, next) {
    let constriesChoice;
    Product.distinct('from').lean()
      .then(countries => {
        constriesChoice = countries;
      })
      .catch(error => next(error));

    let yearsChoice;
    Product.distinct('date').lean()
      .then(years => {
        yearsChoice = years;
      })
      .catch(error => next(error));

    Product.find({}).sort({ price: 1 })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Ascending price', products: multipleMongooseToObject(products), countries: constriesChoice, year: yearsChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/price-dec
  priceDec(req, res, next) {
    let constriesChoice;
    Product.distinct('from').lean()
      .then(countries => {
        constriesChoice = countries;
      })
      .catch(error => next(error));

    let yearsChoice;
    Product.distinct('date').lean()
      .then(years => {
        yearsChoice = years;
      })
      .catch(error => next(error));

    Product.find({}).sort({ price: -1 })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Decending price', products: multipleMongooseToObject(products), countries: constriesChoice, year: yearsChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/price-50
  price50(req, res, next) {
    let constriesChoice;
    Product.distinct('from').lean()
      .then(countries => {
        constriesChoice = countries;
      })
      .catch(error => next(error));

    let yearsChoice;
    Product.distinct('date').lean()
      .then(years => {
        yearsChoice = years;
      })
      .catch(error => next(error));

    Product.find({ price: { $lt: 50 } }).sort({ price: 1 })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Under $50', products: multipleMongooseToObject(products), countries: constriesChoice, year: yearsChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/price-100
  price100(req, res, next) {
    let constriesChoice;
    Product.distinct('from').lean()
      .then(countries => {
        constriesChoice = countries;
      })
      .catch(error => next(error));

    let yearsChoice;
    Product.distinct('date').lean()
      .then(years => {
        yearsChoice = years;
      })
      .catch(error => next(error));

    Product.find({ price: { $lt: 100 } }).sort({ price: 1 })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Under $100', products: multipleMongooseToObject(products), countries: constriesChoice, year: yearsChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/price-300
  price300(req, res, next) {
    let constriesChoice;
    Product.distinct('from').lean()
      .then(countries => {
        constriesChoice = countries;
      })
      .catch(error => next(error));

    let yearsChoice;
    Product.distinct('date').lean()
      .then(years => {
        yearsChoice = years;
      })
      .catch(error => next(error));

    Product.find({ price: { $lt: 300 } }).sort({ price: 1 })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Under $300', products: multipleMongooseToObject(products), countries: constriesChoice, year: yearsChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }




  //[GET] /shop-single/from
  from(req, res, next) {
    let constriesChoice;
    Product.distinct('from').lean()
      .then(countries => {
        constriesChoice = countries;
      })
      .catch(error => next(error));

    let yearsChoice;
    Product.distinct('date').lean()
      .then(years => {
        yearsChoice = years;
      })
      .catch(error => next(error));

    Product.find({ from: req.query.country })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: `From ${req.query.country}`, products: multipleMongooseToObject(products), countries: constriesChoice, year: yearsChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }

  //[GET] /shop-single/collection
  collection(req, res, next) {
    let constriesChoice;
    Product.distinct('from').lean()
      .then(countries => {
        constriesChoice = countries;
      })
      .catch(error => next(error));

    let yearsChoice;
    Product.distinct('date').lean()
      .then(years => {
        yearsChoice = years;
      })
      .catch(error => next(error));

    Product.find({ date: req.query.year })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: `Collection ${req.query.year}`, products: multipleMongooseToObject(products), countries: constriesChoice, years: yearsChoice });
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