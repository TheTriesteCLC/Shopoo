const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

class siteController {
  //[GET] /
  index(req, res) {
    res.render('admin/home', { layout: 'admin/main' });
  }

  //[GET] /home
  home(req, res) {
    res.render('admin/home', { layout: 'admin/main' });
  }

  //[GET] /dashboard
  dashboard(req, res) {
    res.render('admin/dashboard', { layout: 'admin/main' });
  }

  //[GET] /tables
  async tables(req, res, next) {
    await User.find({})
      .then(users => {
        res.render('admin/tables',
          { layout: 'admin/main', users: multipleMongooseToObject(users) });
      })
      .catch(error => next(error));
  }

  //[GET] /billing
  billing(req, res) {
    res.render('admin/billing', { layout: 'admin/main' });
  }

  //[GET] /virtual-reality
  virtualReality(req, res) {
    res.render('admin/virtual-reality', { layout: 'admin/custom' });
  }

  //[GET] /rtl
  rtl(req, res) {
    res.render('admin/rtl', { layout: 'admin/custom' });
  }

  //[GET] /notifications
  notifications(req, res) {
    res.render('admin/notifications', { layout: 'admin/main' });
  }

  //[GET] /profile
  profile(req, res) {
    res.render('admin/profile', { layout: 'admin/main' });
  }

  //[GET] /sign-in
  signIn(req, res) {
    res.render('admin/sign-in', { layout: 'admin/customSignin' });
  }

  //[GET] /sign-up
  signUp(req, res) {
    res.render('admin/sign-up', { layout: 'admin/customSignin' });
  }

  //[POST] /stored
  stored(req, res) {
    const formData = req.body;

    const newAdmin = new Admin(formData);
    newAdmin.save()
      .then(() => res.redirect('/admin'))
      .catch(error => {

      });
    res.json(formData);
  }

  //[GET] /admin/tables/:slug
  viewUserProfile(req, res, next) {

    User.findOne({ slug: req.params.slug }).lean()
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

        let ordersWithGrandTotal = [];
        await Order.find({ username: user.username }).lean()
          .then(orders => {
            ordersWithGrandTotal = orders.map((order) => {
              order['grandTotal'] = order.cart.reduce((accum, ele) => {
                return accum + (ele.quant * ele.price);
              }, 0);
              return order;
            });
            // res.json(ordersWithGrandTotal);
            // res.render('customer/order', { layout: 'customer/main', ordersWithGrandTotal: ordersWithGrandTotal, username: user.username });
          })

        res.render('admin/userProfile', { layout: 'admin/main', user: user, cartWithImg: cartWithImg, ordersWithGrandTotal: ordersWithGrandTotal });

        // res.json({ layout: 'admin/main', user: user, cartWithImg: cartWithImg, ordersWithGrandTotal: ordersWithGrandTotal });
      })
      .catch(error => next(error));
  }

  //[GET] /order/:slug
  order(req, res, next) {
    User.findOne({ slug: req.params.slug }).lean()
      .then(user => {
        Order.find({ username: user.username }).lean()
          .then(orders => {
            const ordersWithGrandTotal = orders.map((order) => {
              order['grandTotal'] = order.cart.reduce((accum, ele) => {
                return accum + (ele.quant * ele.price);
              }, 0);
              return order;
            });
            // res.json(ordersWithGrandTotal);
            res.render('customer/order', { layout: 'customer/main', ordersWithGrandTotal: ordersWithGrandTotal, username: user.username });
          })

      })
  }
}

module.exports = new siteController;