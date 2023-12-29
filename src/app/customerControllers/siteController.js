const { singleMongooseToObject } = require('../../util/mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
class siteController {
  //[GET] /
  index(req, res) {
    res.render('customer/home', { layout: 'customer/main' });
  }

  //[GET] /home
  home(req, res) {
    res.render('customer/home', { layout: 'customer/main' });
  }

  //[GET] /about
  about(req, res) {
    res.render('customer/about', { layout: 'customer/main' });
  }

  //[GET] /elements
  elements(req, res) {
    res.render('customer/elements', { layout: 'customer/main' });
  }

  //[GET] /contact
  contact(req, res) {
    res.render('customer/contact', { layout: 'customer/main' });
  }

  //[GET] /cart
  cart(req, res) {
    res.render('customer/loginCart', { layout: 'customer/main' });
  }

  //[GET] /checkout
  checkout(req, res) {
    res.render('customer/checkout', { layout: 'customer/main' });
  }

  //[GET] /thankyou
  thankyou(req, res) {
    res.render('customer/thankyou', { layout: 'customer/main' });
  }

  //[GET] /login
  login(req, res) {
    res.render('customer/login', { layout: 'customer/main' });
  }

  //[GET] /home
  signup(req, res) {
    res.render('customer/signup', { layout: 'customer/main' });
  }

  //[POST] /stored
  stored(req, res) {
    const formData = req.body;

    const newUser = new User(formData);
    newUser.save()
      .then(() => res.redirect('/customer'))
      .catch(error => {

      });
  }

  //[POST] /login-success
  loginSuccess(req, res, next) {
    User.findOne({ username: req.body.username, password: req.body.password }).lean()
      .then(user => {
        res.redirect(`/customer/profile/${user.slug}`);
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }

  //[GET] /profile/:slug
  profile(req, res, next) {
    User.findOne({ slug: req.params.slug }).lean()
      .then(user => {
        res.render('customer/profile', { layout: 'customer/main', user: user });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }

  //[GET] /update-profile/:slug
  updateProfile(req, res, next) {
    User.findOne({ slug: req.params.slug }).lean()
      .then(user => {
        res.render('customer/update-profile', { layout: 'customer/main', user: user });
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }

  //[POST] /update-profile/:slug
  async update(req, res, next) {
    const formData = req.body;
    await User.findOneAndUpdate({ username: formData.username, password: formData.password },
      {
        fullname: formData.fullname,
        email: formData.email,
        dob: formData.dob,
        phone: formData.phone,
        address: formData.address,
        sex: formData.sex
      });
    // res.json({ huhu });
    res.redirect('/customer/home');
  }

  //[POST] /cart/login-success
  async loginCart(req, res, next) {
    const formData = req.body;
    let haha = [];

    await User.findOne({ username: formData.username, password: formData.password }).lean()
      .then(async user => {
        let cartProducts = user.cart;

        let cartWithImg = [];
        for (var i = 0; i < cartProducts.length; ++i) {
          let ele = cartProducts[i];

          await Product.findOne({ name: ele.prod }).lean()
            .then(product => {
              ele['image'] = product.image;
            });
          cartWithImg.push(ele);
        }

        res.render('customer/cart', { layout: 'customer/main', userFullname: user.fullname, cartWithImg: cartWithImg })
        // res.json(haha);
      })
      .catch(error => next(error));
  }
}

module.exports = new siteController;