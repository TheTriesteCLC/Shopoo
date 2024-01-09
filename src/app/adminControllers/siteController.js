const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const moment = require('moment')
const today = moment().startOf('day')

const itemPerPage = 5;

class siteController {

  //[GET] /dashboard
  async dashboard(req, res) {
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
        res.render('admin/dashboard', { layout: 'admin/main', title: 'All time statistics', totalOrder, totalRevenue, totalUser, totalProduct });
      })
  }

  //[POST] /dashboard/time
  async dashboardTime(req, res, next) {
    const formData = req.body;

    let ordersWithGrandTotal = [];
    let totalOrder = 0;
    let totalRevenue = 0;
    let totalUser = 0;
    let totalProduct = 0;

    await User.find({
      createdAt: {
        $gte: new Date(Date.parse(formData.startDate)),
        $lte: new Date(Date.parse(formData.endDate))
      }
    }).lean()
      .then(users => {
        totalUser = users.length;
      })

    await Product.find({
      createdAt: {
        $gte: new Date(Date.parse(formData.startDate)),
        $lte: new Date(Date.parse(formData.endDate))
      }
    }).lean()
      .then(products => {
        totalProduct = products.length;
      })

    await Order.find({
      createdAt: {
        $gte: new Date(Date.parse(formData.startDate)),
        $lte: new Date(Date.parse(formData.endDate))
      }
    }).lean()
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
        res.render('admin/dashboard', { layout: 'admin/main', title: `From ${formData.startDate} to ${formData.endDate}`, totalOrder, totalRevenue, totalUser, totalProduct });
      })
  }

  //[GET] /tables /tables?getall
  async tables(req, res, next) {
    console.log(req.query);

    if (Object.keys(req.query).length !== 0) { // not empty
      // prepare queries
      var condition = {};

      if (req.query.condition === undefined) {
        console.log("condition is empty")
      } else {
        condition = JSON.parse(req.query.condition);
        console.log(condition);
      }

      var sortBy = {};

      if (req.query.sortBy === undefined) {
        console.log('sort is empty');
      } else {
        if (req.query.sortBy.includes("purchase")) {
          console.log('redirect purchase')
          this.purchaseAscSort({ condition: condition, page: req.query.page }, res, next);
          // res.redirect("./products/purchase-asc");
          return;
        }
        sortBy = JSON.parse(req.query.sortBy);
        console.log(sortBy);
      }

      var page = parseInt(req.query.page);
      if (page < 1) page = 1;

      var pagingFlag = 0;

      if (page === 1) {
        pagingFlag = -1;
      }

      //checking user or product
      if (req.query.getall == 'users') {

        var count = await User.countDocuments(condition);
        console.log(count);
        if (page * itemPerPage >= count) {
          page = Math.ceil(count / itemPerPage);
          if (pagingFlag === -1) {
            pagingFlag = 2;
          } else pagingFlag = 1;
        }

        var skip = (page - 1) * itemPerPage;

        await User.find(condition).limit(itemPerPage).skip(skip).collation({ locale: 'vi', strength: 2 }).sort(sortBy)
          .then(users => {
            res.json({
              users: multipleMongooseToObject(users), titleUsers: 'All users',
              page: page, pagingFlag: pagingFlag
            });
          })
      } else
        if (req.query.getall === 'products') {

          var count = await Product.countDocuments(condition);
          console.log(count);
          if (page * itemPerPage >= count) {
            page = Math.ceil(count / itemPerPage);
            if (pagingFlag === -1) {
              pagingFlag = 2;
            } else pagingFlag = 1;
          }
          console.log(pagingFlag);

          var skip = (page - 1) * itemPerPage;

          await Product.find(condition).limit(itemPerPage).skip(skip).collation({ locale: 'vi', strength: 2 }).sort(sortBy).lean()
            .then(products => {
              products = products.map((ele) => {
                return {
                  ...ele,
                  category: Object.keys(ele).filter((k) => { return ele[k] === true; })
                }
              });
              res.json({
                products: products, titleProducts: 'All products',
                page: page, pagingFlag: pagingFlag
              });
            })
        }

    } else {
      console.log('render');

      const userFullname = await User.distinct('fullname').lean();
      const userEmail = await User.distinct('email').lean();

      const productFrom = await Product.distinct('from').lean();
      const productDate = await Product.distinct('date').lean();

      res.render('admin/tables',
        {
          layout: 'admin/main', userFullname, userEmail, productFrom, productDate
        });
    }
  }


  // products/purchase
  async purchaseAscSort(req, res, next) {

    console.log(req);
    var page = req.page;
    var condition = req.condition;
    var pagingFlag = 0;

    if (page == 1) {
      pagingFlag = -1;
    }

    console.log(page);
    console.log(pagingFlag);
    var count = await Product.countDocuments(condition);
    console.log(count);

    if (page * itemPerPage >= count) {
      page = Math.ceil(count / itemPerPage);

      if (pagingFlag === -1) {
        pagingFlag = 2;
      } else pagingFlag = 1;
    }

    console.log(pagingFlag);


    var skip = (page - 1) * itemPerPage;

    await Product.find(condition).limit(itemPerPage).skip(skip).lean()
      .then(async products => {
        for (let i = 0; i < products.length; ++i) {
          await Order.find({ "cart.prod": products[i].name }).lean()
            .then(orders => {
              products[i]['totalOrdered'] = orders.reduce((accumOrder, order) => {
                return accumOrder + order.cart.reduce((accumCart, ele) => {
                  return accumCart + (ele.prod === products[i].name ? ele.quant : 0);
                }, 0);
              }, 0)
            })
        }
        products = products.sort(function (a, b) { return a['totalOrdered'] - b['totalOrdered'] })
        products = products.map((ele) => {
          return {
            ...ele,
            category: Object.keys(ele).filter((k) => { return ele[k] === true; })
          }
        });
        res.json({
          products: products, titleProducts: 'All products',
          page: page, pagingFlag: pagingFlag
        });
      })
    console.log('Stop');
    return;
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
    res.render('admin/rtl', { layout: 'admin/main' });
  }

  //[GET] /orders
  orders(req, res) {
    Order.find({}).lean()
      .then(orders => {
        for (let i = 0; i < orders.length; ++i) {
          orders[i]['grandTotal'] = orders[i].cart.reduce((accum, prod) => {
            return accum + (prod.price * prod.quant);
          }, 0);
        }
        res.render('admin/orders', { layout: 'admin/main', title: 'All orders', orders });
        // res.json(orders.length);
      })
  }

  //[GET] /orders/pending
  ordersPending(req, res) {
    Order.find({ status: 'Pending' }).lean()
      .then(orders => {
        for (let i = 0; i < orders.length; ++i) {
          orders[i]['grandTotal'] = orders[i].cart.reduce((accum, prod) => {
            return accum + (prod.price * prod.quant);
          }, 0);
        }
        res.render('admin/orders', { layout: 'admin/main', title: 'All pending orders', orders });
        // res.json(orders.length);
      })
  }
  //[GET] /orders/shipping
  ordersShipping(req, res) {
    Order.find({ status: 'Shipping' }).lean()
      .then(orders => {
        for (let i = 0; i < orders.length; ++i) {
          orders[i]['grandTotal'] = orders[i].cart.reduce((accum, prod) => {
            return accum + (prod.price * prod.quant);
          }, 0);
        }
        res.render('admin/orders', { layout: 'admin/main', title: 'All shipping orders', orders });
        // res.json(orders.length);
      })
  }

  //[GET] /orders/done
  ordersDone(req, res) {
    Order.find({ status: 'Done' }).lean()
      .then(orders => {
        for (let i = 0; i < orders.length; ++i) {
          orders[i]['grandTotal'] = orders[i].cart.reduce((accum, prod) => {
            return accum + (prod.price * prod.quant);
          }, 0);
        }
        res.render('admin/orders', { layout: 'admin/main', title: 'All done orders', orders });
        // res.json(orders.length);
      })
  }

  //[POST] /orders/time
  ordersTime(req, res) {
    const formData = req.body;

    Order.find({
      createdAt: {
        $gte: new Date(Date.parse(formData.startDate)),
        $lte: new Date(Date.parse(formData.endDate))
      }
    }).lean()
      .then(orders => {
        for (let i = 0; i < orders.length; ++i) {
          orders[i]['grandTotal'] = orders[i].cart.reduce((accum, prod) => {
            return accum + (prod.price * prod.quant);
          }, 0);
        }
        res.render('admin/orders', { layout: 'admin/main', title: `All orders from ${formData.startDate} to ${formData.endDate}`, orders });
      })

  }

  //[GET] /profile
  profile(req, res) {
    const currAdmin = req.user;

    res.render('admin/profile', { layout: 'admin/main', currAdmin });
  }

  //[GET] /update-profile
  updateProfile(req, res) {
    const currAdmin = req.user;

    res.render('admin/update-profile', { layout: 'admin/main', currAdmin });
  }

  //[POST] /update-profile/updated
  async update(req, res) {
    const formData = req.body;

    // get current user session
    var currAdmin = await Admin.findOne({ username: req.user.username });

    // check two passwords
    var checkPass = await currAdmin.comparePassword(formData.password);

    if (checkPass) {
      currAdmin = await Admin.findOneAndUpdate({ username: formData.username },
        {
          fullname: formData.fullname,
          email: formData.email,
          dob: formData.dob,
          phone: formData.phone,
          address: formData.address,
          sex: formData.sex,
          canAdd: formData.canAdd === 'adding' ? true : false,
          canBan: formData.canAdd === 'adding' ? true : false,
        },
        {
          new: true
        }
      );

      console.log('Updated');

      if (currAdmin === null) {
        res.redirect('/admin/update-profile');
      } else {
        // update session user
        req.session.passport.user = currAdmin;
        res.redirect('/admin/profile');
      }
    }
  }

  //[GET] /login
  login(req, res, next) {
    let messFailed = "";
    if (req.query.status === 'failed') {
      messFailed = 'Wrong username or password.';
    }
    res.render('admin/login', { layout: 'admin/customSignin', messFailed });
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
    console.log('updateUserSuccess');
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
    console.log('updateOrderSuccess');

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
    console.log('updateProductSuccess');

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
  //[GET] /admin/tables/product/update-info/:slug
  updateProductProfile(req, res, next) {
    Product.findOne({ slug: req.params.slug }).lean()
      .then(product => {
        res.render('admin/updateProduct', { layout: 'admin/main', product });
      })
      .catch(error => next(error));
  }

  //[GET] admin/product/add
  addProduct(req, res, next) {
    res.render('admin/addProduct', { layout: 'admin/main' });
  }

  //[POST] admin/product/save
  saveProduct(req, res, next) {
    var formData = req.body;
    console.log('saveProduct');


    formData = {
      'name': formData.name,
      'price': parseFloat(formData.price),
      'description': formData.description,
      'top': 'top' in formData ? true : false,
      'bottom': 'bottom' in formData ? true : false,
      'accessories': 'accessories' in formData ? true : false,
      'outer': 'outer' in formData ? true : false,
      'shoes': 'shoes' in formData ? true : false,
      'buyers': parseFloat(formData.buyers),
      'date': parseFloat(formData.year),
      'from': formData.from,
      'stock': parseFloat(formData.stock),
      'popular': parseFloat(formData.buyers) > 500 ? true : false,
      'image': 'defaultProductIcon.jpg',
      'status': formData.stock > 0 ? 'OnStock' : 'OutStock'
    };

    const newProduct = new Product(formData);
    newProduct.image = "null";
    newProduct.save();
    // newProduct
    console.log(newProduct);

    res.redirect('/admin/tables');
  }

  //[POST] /admin/table/product/update-info/updated
  async updateProductProfileSuccess(req, res, next) {
    const formData = req.body;

    await Product.updateOne(
      { slug: req.params.slug },
      {
        $set: {
          'name': formData.name,
          'price': parseFloat(formData.price),
          'description': formData.description,
          'top': 'top' in formData ? true : false,
          'bottom': 'bottom' in formData ? true : false,
          'accessories': 'accessories' in formData ? true : false,
          'outer': 'outer' in formData ? true : false,
          'shoes': 'shoes' in formData ? true : false,
          'buyers': parseFloat(formData.buyers),
          'date': parseFloat(formData.year),
          'from': formData.from,
          'stock': parseFloat(formData.stock),
          'popular': parseFloat(formData.buyers) > 500 ? true : false,
        }
      }
    );

    await Product.updateOne(
      { name: formData.name },
      {
        slug: slugify(formData.name)
      }
    )

    console.log('updated success')

    res.redirect('/admin/tables');
  }

  //[GET] /admin/product-report
  async productReport(req, res, next) {
    await Product.find({}).lean()
      .then(async products => {
        let productReports = [];
        for (let i = 0; i < products.length; ++i) {
          let productReport = {
            name: products[i].name,
            price: products[i].price,
            category: Object.keys(products[i]).filter((k) => { return products[i][k] === true; })
          };

          let totalOrders = 0;
          let totalOrdered = 0;
          let revenue = 0;
          await Order.find({ "cart.prod": productReport.name }).lean()
            .then(orders => {
              totalOrders = orders.length;
              for (let i = 0; i < orders.length; ++i) {
                totalOrdered += orders[i].cart.filter((ele) => ele.prod === productReport.name)[0].quant;
              }

              productReport['totalOrders'] = orders.length;
              productReport['totalOrdered'] = totalOrdered;
              productReport['revenue'] = totalOrdered * productReport.price;
            })
          productReports.push(productReport);
        }
        res.render('admin/productReport', { layout: 'admin/main', title: 'All products report', productReports });
      })
      .catch(error => next(error));
  }

  //[POST] /admin/product-report/time
  async productReportTime(req, res, next) {
    const formData = req.body;

    await Product.find({}).lean()
      .then(async products => {
        let productReports = [];
        for (let i = 0; i < products.length; ++i) {
          let productReport = {
            name: products[i].name,
            price: products[i].price,
            category: Object.keys(products[i]).filter((k) => { return products[i][k] === true; })
          };

          let totalOrders = 0;
          let totalOrdered = 0;
          let revenue = 0;
          await Order.find(
            {
              "cart.prod": productReport.name,
              createdAt: {
                $gte: new Date(Date.parse(formData.startDate)),
                $lte: new Date(Date.parse(formData.endDate))
              }
            }).lean()
            .then(orders => {
              totalOrders = orders.length;
              for (let i = 0; i < orders.length; ++i) {
                totalOrdered += orders[i].cart.filter((ele) => ele.prod === productReport.name)[0].quant;
              }

              productReport['totalOrders'] = orders.length;
              productReport['totalOrdered'] = totalOrdered;
              productReport['revenue'] = totalOrdered * productReport.price;
            })
          productReports.push(productReport);
        }
        res.render('admin/productReport', { layout: 'admin/main', title: `All products report <br/>Start: ${formData.startDate}<br/>End:${formData.endDate}`, productReports });
      })
      .catch(error => next(error));
  }
}

const slugify = (textToSlugify) => {
  if (!textToSlugify) return '';

  const lowercaseText = textToSlugify.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/ +(?= )/g, '');

  return lowercaseText.split(' ').join('-');
}

module.exports = new siteController;