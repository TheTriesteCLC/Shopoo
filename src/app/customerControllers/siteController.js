const { singleMongooseToObject } = require('../../util/mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const { raw } = require('express');
const Order = require('../models/Order');


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

        if (subtotalAll.length > 0) {
          res.render('customer/checkout', { layout: 'customer/main', username: user.username, userSlug: req.params.slug, subtotalAll: subtotalAll, grandTotal: grandTotal });
        } else {
          res.redirect('/customer/shop-single');
        }
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

  //[GET] /login
  login(req, res, next) {
    res.render('customer/login', { layout: 'customer/main' });
  }

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
    res.render('customer/protected', { layout: 'customer/main', user: req.user })
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

  //[POST] /update-profile/:slug // password has not hashed
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

  //[GET] /cart
  async cart(req, res, next){
    const user = req.user;
    const cartProducts = user.cart;
    let cartWithImg = [];
    let grandTotal = 0;

    for (var i = 0; i < cartProducts.length; ++i) {
      let element = cartProducts[i];

      // get cart's products
      await Product.findOne({ name: ele.prod }).lean()
        .then(product => {
          element['image'] = product.image;
        });
        element['prodTotal'] = element.quant * element.price;
      grandTotal += element.quant * element.price;
      cartWithImg.push(element);
    }
    res.render('customer/cart', { layout: 'customer/main', user: user, cartWithImg: cartWithImg, grandTotal: grandTotal })
  }

  //[POST] /customer/cart/update-cart
  async updateCart(req, res, next) {
    const formData = req.body;
    const allProducts = Object.keys(formData);
    const allQuant = Object.values(formData).map(element => parseFloat(element));

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
            { slug: req.user.slug },
            {
              $pull: {
                'cart': { 'prod': allProducts[i] }
              }
            });
        }
      }
      res.redirect(`/customer/cart`);
    } else {
      res.redirect('/customer/shop-single');
    }

  }

  //[POST] /checkout-success/:slug
  checkoutSuccess(req, res) {
    const formData = req.body;
    const rawCart = formData.cart;

    if (Array.isArray(rawCart[0].prod)) {
      let convertedCart = [];
      for (let i = 0; i < rawCart[0].prod.length; ++i) {
        convertedCart.push({
          prod: rawCart[0].prod[i],
          quant: parseFloat(rawCart[0].quant[i]),
          price: parseFloat(rawCart[0].price[i])
        });
      }
      formData.cart = convertedCart;
    }


    const newOrder = new Order(formData);
    newOrder.save()
      .then(async () => {
        await User.updateOne(
          { slug: req.params.slug },
          {
            $set: { 'cart': [] }
          }
        );
      })
      .catch(error => {

      });

    res.redirect('/customer/thankyou');
    // res.json(formData)
  }

  //[GET] /order/
  order(req, res, next) {
    const user = req.user;

    Order.find({ username: user.username }).lean()
      .then(orders => {
        const ordersWithGrandTotal = orders.map((order) => {
          order['grandTotal'] = order.cart.reduce((accum, element) => {
            return accum + (element.quant * element.price);
          }, 0);
          return order;
        });
        // res.json(ordersWithGrandTotal);
        res.render('customer/order', { layout: 'customer/main', ordersWithGrandTotal: ordersWithGrandTotal, username: user.username });
      })

  }

  //[GET] /forgot-password
  forgot(req, res, next) {
    res.render('customer/forgot', { layout: 'customer/main' });
  }

  //[POST] /forgot-success
  async forgotSuccess(req, res, next) {
    const formData = req.body;
    if (formData.newPassword === formData.againPassword) { 
      const user = await User.findByUsername(formData.username);
      user.setPassword(formData.newPassword);     
      res.redirect('/customer/login');
    } else {
      res.redirect('/customer/forgot-password');
    }
  }
}


module.exports = new siteController;