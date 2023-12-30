const { singleMongooseToObject } = require('../../util/mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const passport = require('passport');
const { raw } = require('express');
const Order = require('../models/Order');
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

  //[GET] /cart
  loginCart(req, res) {
    res.render('customer/loginCart', { layout: 'customer/main' });
  }

  //[GET] /checkout/:slug
  async checkout(req, res, next) {
    await User.findOne({ slug: req.params.slug }).lean()
      .then(user => {
        let subtotalAll = user.cart.map(ele => {
          return {
            name: ele.prod,
            price: ele.price,
            quant: ele.quant,
            subtotal: ele.quant * ele.price
          }
        });
        const grandTotal = subtotalAll.reduce((accum, ele) => {
          return accum + ele.subtotal;
        }, 0);

        res.render('customer/checkout', { layout: 'customer/main', username: user.username, userSlug: req.params.slug, subtotalAll: subtotalAll, grandTotal: grandTotal });
      })
  }

  //[GET] /thankyou
  thankyou(req, res) {
    res.render('customer/thankyou', { layout: 'customer/main' });
  }

  //[GET] /signup
  signup(req, res) {
    res.render('customer/signup', { layout: 'customer/main' });
  }

  //[POST] /signup
  signupPost(req, res, next) { }

  //[GET] /login
  login(req, res, next) {
    res.render('customer/login', { layout: 'customer/main' });
  }

  // [POST] /login
  loginPost(req, res, next) { }

  //[GET] /logout
  logout(req, res, next) {
    console.log("Loging out");
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('./login');
    });
  }

  //[GET] /protected
  protected(req, res, next) {
    res.render('customer/protected', { layout: 'customer/main' })
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
  loginCartSuccess(req, res, next) {
    const formData = req.body;
    User.findOne({ username: formData.username, password: formData.password }).lean()
      .then(user => {
        res.redirect(`/customer/cart/${user.slug}`);
      })
      .catch(error => next(error));
  }

  //[GET] /cart/:slug
  async cart(req, res, next) {
    await User.findOne({ slug: req.params.slug }).lean()
      .then(async user => {
        let cartProducts = user.cart;

        let cartWithImg = [];
        let grandTotal = 0;
        for (var i = 0; i < cartProducts.length; ++i) {
          let ele = cartProducts[i];

          await Product.findOne({ name: ele.prod }).lean()
            .then(product => {
              ele['image'] = product.image;
            });
          ele['prodTotal'] = ele.quant * ele.price;
          grandTotal += ele.quant * ele.price;
          cartWithImg.push(ele);
        }


        res.render('customer/cart', { layout: 'customer/main', userFullname: user.fullname, cartWithImg: cartWithImg, userSlug: user.slug, grandTotal: grandTotal })
        // res.json(haha);
      })
      .catch(error => next(error));
  }

  //[POST] /customer/cart/update-cart/:slug
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

  //[POST] /checkout-success/:slug
  checkoutSuccess(req, res) {
    const formData = req.body;
    const rawCart = formData.cart;
    let convertedCart = [];

    for (let i = 0; i < rawCart[0].prod.length; ++i) {
      convertedCart.push({
        prod: rawCart[0].prod[i],
        quant: parseFloat(rawCart[0].quant[i]),
        price: parseFloat(rawCart[0].price[i])
      });
    }
    formData.cart = convertedCart;

    const newOrder = new Order(formData);
    newOrder.save()
      .then(async () => {
        await User.updateOne(
          { slug: req.params.slug },
          {
            $set: { 'cart': [] }
          }
        )
      })
      .catch(error => {

      });

    res.redirect('/customer/thankyou')
  }
}

module.exports = new siteController;