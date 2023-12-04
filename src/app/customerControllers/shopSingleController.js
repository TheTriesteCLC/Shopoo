const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');
const Product = require('../models/Product');

class shopSingleController {

  //[GET] /shop-single/all
  async index(req, res, next) {
    const constriesChoice = await Product.distinct('from').lean();

    const datesChoice = await Product.distinct('date').lean();

    Product.find({})
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'All', products: multipleMongooseToObject(products), countries: constriesChoice, dates: datesChoice });
        // res.json({ title: 'All', products: multipleMongooseToObject(products), countries: constriesChoice });
      })
      .catch(error => next(error));
  }





  //[GET] /shop-single/outer
  async outer(req, res, next) {
    const constriesChoice = await Product.distinct('from').lean();

    const datesChoice = await Product.distinct('date').lean();

    Product.find({ outer: true })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Outerwear', products: multipleMongooseToObject(products), countries: constriesChoice, dates: datesChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/top
  async top(req, res, next) {
    const constriesChoice = await Product.distinct('from').lean();

    const datesChoice = await Product.distinct('date').lean();


    Product.find({ top: true })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Top', products: multipleMongooseToObject(products), countries: constriesChoice, dates: datesChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/bottom
  async bottom(req, res, next) {
    const constriesChoice = await Product.distinct('from').lean();

    const datesChoice = await Product.distinct('date').lean();

    Product.find({ bottom: true })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Bottom', products: multipleMongooseToObject(products), countries: constriesChoice, dates: datesChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/accessories
  async accessories(req, res, next) {
    const constriesChoice = await Product.distinct('from').lean();

    const datesChoice = await Product.distinct('date').lean();

    Product.find({ accessories: true })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Accessories', products: multipleMongooseToObject(products), countries: constriesChoice, dates: datesChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/shoes
  async shoes(req, res, next) {
    const constriesChoice = await Product.distinct('from').lean();

    const datesChoice = await Product.distinct('date').lean();

    Product.find({ shoes: true })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Shoes', products: multipleMongooseToObject(products), countries: constriesChoice, dates: datesChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }





  //[GET] /shop-single/price-asc
  async priceAsc(req, res, next) {
    const constriesChoice = await Product.distinct('from').lean();

    const datesChoice = await Product.distinct('date').lean();

    Product.find({}).sort({ price: 1 })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Ascending price', products: multipleMongooseToObject(products), countries: constriesChoice, dates: datesChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/price-dec
  async priceDec(req, res, next) {
    const constriesChoice = await Product.distinct('from').lean();

    const datesChoice = await Product.distinct('date').lean();

    Product.find({}).sort({ price: -1 })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Decending price', products: multipleMongooseToObject(products), countries: constriesChoice, dates: datesChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/price-50
  async price50(req, res, next) {
    const constriesChoice = await Product.distinct('from').lean();

    const datesChoice = await Product.distinct('date').lean();

    Product.find({ price: { $lt: 50 } }).sort({ price: 1 })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Under $50', products: multipleMongooseToObject(products), countries: constriesChoice, dates: datesChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/price-100
  async price100(req, res, next) {
    const constriesChoice = await Product.distinct('from').lean();

    const datesChoice = await Product.distinct('date').lean();

    Product.find({ price: { $lt: 100 } }).sort({ price: 1 })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Under $100', products: multipleMongooseToObject(products), countries: constriesChoice, dates: datesChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
  //[GET] /shop-single/price-300
  async price300(req, res, next) {
    const constriesChoice = await Product.distinct('from').lean();

    const datesChoice = await Product.distinct('date').lean();

    Product.find({ price: { $lt: 300 } }).sort({ price: 1 })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: 'Under $300', products: multipleMongooseToObject(products), countries: constriesChoice, dates: datesChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }




  //[GET] /shop-single/from
  async from(req, res, next) {
    const constriesChoice = await Product.distinct('from').lean();

    const datesChoice = await Product.distinct('date').lean();

    Product.find({ from: req.query.country })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: `From ${req.query.country}`, products: multipleMongooseToObject(products), countries: constriesChoice, dates: datesChoice });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }

  //[GET] /shop-single/collection
  async collection(req, res, next) {
    const constriesChoice = await Product.distinct('from').lean();

    const datesChoice = await Product.distinct('date').lean();

    Product.find({ date: req.query.date })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: `Collection ${req.query.date}`, products: multipleMongooseToObject(products), countries: constriesChoice, dates: datesChoice });
        // res.json({ products: multipleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }



  //[GET] /shop-single/:slug
  async item(req, res, next) {

    // res.render('customer/item', { layout: 'customer/main' });
    console.log(req.params);
    const product = await Product.findOne({ slug: req.params.slug }).lean();
    var related = [];


    for (var propt in product) {
      if (product[propt] === true) {
        related.push(... await Product.find({ [propt]: true, slug: { $ne: product.slug } }).lean());
        //console.log(`${propt} : ${product[propt]}`);  
      }
    }
    while (related.length > 4) related.pop();
    console.log(related);

    res.render('customer/item',
      { layout: 'customer/main', title: 'Item', product, related });
    // res.json({ title: 'All', products: multipleMongooseToObject(products), countries: constriesChoice });

  }



  //[GET] /shop-single/search
  async search(req, res, next) {
    const formData = req.body;
    const constriesChoice = await Product.distinct('from').lean();

    const datesChoice = await Product.distinct('date').lean();

    Product.find({ $text: { $search: formData.nameSearch, $caseSensitive: false } })
      .then(products => {
        res.render('customer/shop-single',
          { layout: 'customer/main', title: `Result for "${formData.nameSearch}"`, products: multipleMongooseToObject(products), countries: constriesChoice, dates: datesChoice });
        // res.json({ products: multipleMongooseToObject(products) });
      })
      .catch(error => next(error));

  }
}

module.exports = new shopSingleController;