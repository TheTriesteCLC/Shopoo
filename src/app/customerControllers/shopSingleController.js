const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');
const Product = require('../models/Product');
const Review = require('../models/Review');
const User = require('../models/User');

class shopSingleController {

  //[GET] /shop-single/all
  async index(req, res, next) {
    // console.log(req.query);
    var page = 1;

    if (req == {}) {
      page = 1;
    } else {
      page = req.query.page;
    }
    var skip = (page - 1) * 6;
    const productPerPage = 6;

    const constriesChoice = await Product.distinct('from').lean();

    const datesChoice = await Product.distinct('date').lean();

    Product.find({}).limit(productPerPage).skip(skip)
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
  item(req, res, next) {

    // res.render('customer/item', { layout: 'customer/main' });
    // console.log(req.params);
    Product.findOne({ slug: req.params.slug }).lean()
      .then(async thisProduct => {
        var related = [];

        // console.log(thisProduct);
        // console.log(reviews);

        for (var propt in thisProduct) {
          if (thisProduct[propt] === true) {
            related.push(... await Product.find({ [propt]: true, slug: { $ne: thisProduct.slug } }).lean());
            //console.log(`${propt} : ${product[propt]}`);  
          }
        }

        const reviews = await (Review.find({ product: thisProduct.name }).lean());

        // remove duplicate objects
        const jsonObject = related.map(JSON.stringify);
        const uniqueSet = new Set(jsonObject);
        related = Array.from(uniqueSet).map(JSON.parse);

        // limit to 4 products
        while (related.length > 4) related.pop();

        res.render('customer/item',
          { layout: 'customer/main', title: 'Item', product: thisProduct, related: related, reviews: reviews });
        // res.json({ title: 'All', products: multipleMongooseToObject(products), countries: constriesChoice });

      })
      .catch(error => next(error));

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

  //[POST] /shop-single/review?product=
  review(req, res) {
    const formData = req.body;
    const productReview = req.query.product;

    formData.product = productReview;
    const newReview = new Review(formData);
    newReview.save()
      .then(() => res.redirect('/customer'))
      .catch(error => {

      });
  }

  //[POST] /shop-single/adding?product=&price=
  async adding(req, res) {
    const formData = req.body;

    const productAdded = {
      prod: req.query.prod,
      quant: parseInt(req.body.quant),
      price: parseFloat(req.query.price),
    };

    await User.updateOne(
      { username: formData.username, password: formData.password },
      {
        $push: {
          cart: {
            prod: req.query.prod,
            quant: parseInt(req.body.quant),
            price: parseFloat(req.query.price),
          }
        }
      },
      { upsert: true });

    res.json(productAdded);

  }
}

module.exports = new shopSingleController;