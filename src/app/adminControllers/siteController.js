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
  async home(req, res) {
    let ordersWithGrandTotal = [];
    let totalOrder = 0;
    let totalRevenue = 0;
    let totalUser = 0;
    let totalProduct = 0;

    await User.find({}).lean()
      .then(users => {
        totalUser = users.length;
      })

    await Product.find({}).lean()
      .then(products => {
        totalProduct = products.length;
      })

    await Order.find({}).lean()
      .then(orders => {
        ordersWithGrandTotal = orders.map((order) => {
          order['grandTotal'] = order.cart.reduce((accum, ele) => {
            return accum + (ele.quant * ele.price);
          }, 0);
          return order;
        });
        totalOrder = ordersWithGrandTotal.length;
        totalRevenue = ordersWithGrandTotal.reduce((accum, ele) => {
          return accum + ele.grandTotal;
        }, 0);

        // res.json(ordersWithGrandTotal);
        // res.render('customer/order', { layout: 'customer/main', ordersWithGrandTotal: ordersWithGrandTotal, username: user.username });
        res.render('admin/home', { layout: 'admin/main', totalOrder, totalRevenue, totalUser, totalProduct });
      })


  }

  //[GET] /dashboard
  dashboard(req, res) {
    res.render('admin/dashboard', { layout: 'admin/main' });
  }

  //[GET] /tables
  async tables(req, res, next) {
    await User.find({}).lean()
      .then(async users => {
        await Product.find({}).lean()
          .then(products => {

            products = products.map((ele) => {
              return {
                ...ele,
                category: Object.keys(ele).filter((k) => { return ele[k] === true; })
              }
            });
            // res.json(products);
            res.render('admin/tables',
              { layout: 'admin/main', users: users, products: products });
          })
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

  //[GET] /login
  login(req, res, next) {
    res.render('admin/login', { layout: 'admin/customSignin' });
  }

  //[GET] /signup
  signup(req, res, next) {
    res.render('admin/signup', { layout: 'admin/customSignin' });
  }

  //[GET] /logout
  logout(req, res, next) {
    console.log("Loging out");
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('./login');
    })
  };

  //[GET] /admin/tables/user/:slug
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

  //[POST] /admin/table/user/update/:slug
  async updateUserSuccess(req, res, next) {
    await User.findOne({ slug: req.params.slug }).lean()
      .then(async user => {
        if (user.status === 'Active') {
          await User.updateOne(
            { slug: user.slug },
            {
              $set: {
                "status": "Banned"
              }
            });
        } else if (user.status === 'Banned') {
          await User.updateOne(
            { slug: user.slug },
            {
              $set: {
                "status": "Active"
              }
            });
        }
        res.redirect('/admin/tables');
      })
      .catch(error => next(error))
  }

  //[GET] /admin/tables/product/:slug
  viewProductProfile(req, res, next) {

    Product.findOne({ slug: req.params.slug }).lean()
      .then(async product => {
        await Order.find({ "cart.prod": product.name }).lean()
          .then(orders => {
            let pendingCount = 0;
            let shippingCount = 0;
            let doneCount = 0;

            for (let i = 0; i < orders.length; ++i) {
              if (orders[i].status === 'Pending') {
                pendingCount += orders[i].cart.filter((ele) => ele.prod === product.name)[0].quant;
              } else if (orders[i].status === 'Shipping') {
                shippingCount += orders[i].cart.filter((ele) => ele.prod === product.name)[0].quant;
              } else if (orders[i].status === 'Done') {
                doneCount += orders[i].cart.filter((ele) => ele.prod === product.name)[0].quant;
              }

              orders[i]['grandTotal'] = orders[i].cart.reduce((accum, ele) => {
                return accum + (ele.quant * ele.price);
              }, 0);
            }

            product['category'] = Object.keys(product).filter((k) => product[k] === true);

            // res.json({ product });
            res.render('admin/productProfile', {
              layout: 'admin/main', product: product, orders: orders,
              pendingCount: pendingCount, shippingCount: shippingCount, doneCount: doneCount
            });

          })

        // res.render('admin/productProfile', { layout: 'admin/main', product: product });

        // res.json({ layout: 'admin/main', user: user, cartWithImg: cartWithImg, ordersWithGrandTotal: ordersWithGrandTotal });
      })
      .catch(error => next(error));
  }

  //[POST] /admin/tables/product/order/update/:slug
  async updateOrderSuccess(req, res, next) {
    const formData = req.body;
    await Order.updateOne(
      { slug: req.params.slug },
      {
        $set: {
          'status': formData.status
        }
      }
    );
    res.redirect('/admin/tables')
  }
  //[POST] /admin/tables/product/update/:slug
  async updateProductSuccess(req, res, next) {
    const formData = req.body;
    await Product.updateOne(
      { slug: req.params.slug },
      {
        $set: {
          'status': formData.status
        }
      }
    );
    res.redirect('/admin/tables')
  }
}

module.exports = new siteController;