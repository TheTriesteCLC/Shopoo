const User = require('../models/User');
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
    res.render('customer/cart', { layout: 'customer/main' });
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
        res.json(user);
        // res.json({ products: singleMongooseToObject(products) });
      })
      .catch(error => next(error));
  }
}

module.exports = new siteController;