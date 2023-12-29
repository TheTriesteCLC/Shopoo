const { singleMongooseToObject } = require('../../util/mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const passport = require('passport');
require('../../config/passport/passport')(passport);


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

  //[GET] /cart-login
  loginCart(req, res) {
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

  //[GET] /sign-up
  //[GET] /signup
  signup(req, res) {
    res.render('customer/signup', { layout: 'customer/main' });
  }

  //[POST] /stored
  stored(req, res) {
    const formData = req.body;
    formData.status = 'active';

    const newUser = new User(formData);
    newUser.save()
      .then(() => res.redirect('/customer'))
      .catch(error => {

      });
    //[POST] /signup
    signupPost(req, res, next) { }

    //[GET] /login
    login(req, res, next){
      res.render('customer/login', { layout: 'customer/main' });
    }

    // [POST] /login
    loginPost(req, res, next) { }

    //[GET] /logout
    logout(req, res, next){
      console.log("Loging out");
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('./login');
      });
    }

    //[GET] /protected
    protected(req, res, next){
      res.render('customer/protected', { layout: 'customer/main' })
      //[POST] /login-success
      loginSuccess(req, res, next) {
        User.findOne({ username: req.body.username, password: req.body.password, status: 'active' }).lean()
          .then(user => {
            res.redirect(`/customer/profile/${user.slug}`);
            // res.json({ products: singleMongooseToObject(products) });
          })
          .catch(error => next(error));
      }

      //[GET] /profile/:slug
      profile(req, res, next) {
        User.findOne({ slug: req.params.slug, status: 'active' }).lean()
          .then(user => {
            res.render('customer/profile', { layout: 'customer/main', user: user });
            // res.json({ products: singleMongooseToObject(products) });
          })
          .catch(error => next(error));
      }

      //[GET] /update-profile/:slug
      updateProfile(req, res, next) {
        User.findOne({ slug: req.params.slug, status: 'active' }).lean()
          .then(user => {
            res.render('customer/update-profile', { layout: 'customer/main', user: user });
            // res.json({ products: singleMongooseToObject(products) });
          })
          .catch(error => next(error));
      }

  //[POST] /update-profile/updated
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

      //[POST] /cart-login-success
      loginCartSuccess(req, res, next) {
        const formData = req.body;
        User.findOne({ username: formData.username, password: formData.password, status: 'active' }).lean()
          .then(user => {
            res.redirect(`/customer/cart/${user.slug}`);
          })
          .catch(error => next(error));
      }

  //[GET] /cart/:slug
  async cart(req, res, next) {
        let haha = [];

        await User.findOne({ slug: req.params.slug, status: 'active' }).lean()
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

            res.render('customer/cart', { layout: 'customer/main', userFullname: user.fullname, cartWithImg: cartWithImg, userSlug: user.slug })
            // res.json(haha);
          })
          .catch(error => next(error));
      }

  //[POST] /update-cart/:slug
  async updateCart(req, res, next) {
        const formData = req.body;
        const allProducts = Object.keys(formData);
        const allQuant = Object.values(formData).map(ele => parseFloat(ele));

        if (allProducts.length != 0) {
          for (var i = 0; i < allProducts.length; ++i) {
            if (allQuant[i] > 0) {
              await User.updateOne(
                { slug: req.params.slug, "cart.prod": allProducts[i] },
                {
                  $set: {
                    "cart.$.quant": allQuant[i]
                  }
                }
              );
            } else {
              await User.updateOne(
                { slug: req.params.slug },
                {
                  $pull: {
                    'cart': { 'prod': allProducts[i] }
                  }
                });
            }
          }
        }
        res.redirect('/customer/home');
      }
    }

    module.exports = new siteController;