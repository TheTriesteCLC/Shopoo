const { singleMongooseToObject } = require('../../util/mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const { raw } = require('express');
const Order = require('../models/Order');


class siteController {
  //[GET] /
  index(req, res) {
    const currUser = req.user;
    res.render('customer/home', { layout: 'customer/main', currUser });
  }

  //[GET] /home
  home(req, res) {
    const currUser = req.user;
    res.render('customer/home', { layout: 'customer/main', currUser });
  }

  //[GET] /about
  about(req, res) {
    const currUser = req.user;
    res.render('customer/about', { layout: 'customer/main', currUser });
  }

  //[GET] /elements
  elements(req, res) {
    const currUser = req.user;
    res.render('customer/elements', { layout: 'customer/main', currUser });
  }

  //[GET] /contact
  contact(req, res) {
    const currUser = req.user;
    res.render('customer/contact', { layout: 'customer/main', currUser });
  }

  //[GET] /checkout/:slug
  async checkout(req, res, next) {
    const currUser = req.user;
    if (!currUser) {
      res.redirect('/customer/login');
    } else {
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
  }

  //[GET] /thankyou
  thankyou(req, res) {
    const currUser = req.user;
    res.render('customer/thankyou', { layout: 'customer/main', currUser });
  }

  //[GET] /customer/signup
  signup(req, res) {
    const currUser = req.user;
    if (!currUser) {
      res.render('customer/signup', { layout: 'customer/main' });
    }
    else {
      res.redirect('/customer/home');
    }
  }

  //[GET] /customer/login
  login(req, res, next) {
    const user = req.user;
    if (!user) {
      res.render('customer/login', { layout: 'customer/main' });
    } else {
      res.redirect('/customer/profile');
    }
  }

  //[GET] /customer/logout
  logout(req, res, next) {
    // console.log("Loging out");
    const user = req.user;
    if (!user) {
      res.redirect('/customer/login');
    } else {
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('./home');
      });
    }
  }

  //[GET] /protected
  // protected(req, res, next) {
  //   res.render('customer/protected', { layout: 'customer/main', user: req.user })
  // }

  //[GET] /customer/profile/
  profile(req, res, next) {
    const currUser = req.user;
    if (!currUser) {
      res.redirect('/customer/login');
    } else {
      res.render('customer/profile', { layout: 'customer/main', currUser, user: currUser });
    }
  }

  //[GET] /update-profile
  updateProfile(req, res, next) {
    const currUser = req.user;
    if (!currUser) {
      res.redirect('/customer/login');
    } else {
      res.render('customer/update-profile', { layout: 'customer/main', currUser, user: currUser });
    }
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
    res.redirect('/customer/home');
  }

  //[GET] /cart
  async cart(req, res, next) {
    const currUser = req.user;
    if (!currUser) {
      res.redirect('/customer/login');
    } else {
      const cartProducts = currUser.cart;
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
      res.render('customer/cart', { layout: 'customer/main', currUser, user: currUser, cartWithImg: cartWithImg, grandTotal: grandTotal })
    }
  }

  //[POST] /customer/cart/update-cart
  async updateCart(req, res, next) {
    const currUser = req.user;
    if (!currUser) {
      res.redirect('/customer/login');
    } else {
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
        res.redirect(`/customer/cart/`);
      } else {
        res.redirect('/customer/shop-single');
      }
    }
  }

  //[POST] /checkout-success/
  checkoutSuccess(req, res) {
    const currUser = req.user;
    if (!currUser) {
      res.redirect('/customer/login');
    } else {
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
    }
  }

  // //[GET] /order-login
  // loginOrder(req, res) {
  //   res.render('customer/loginOrder', { layout: 'customer/main' });
  // }

  // //[POST] /order-login-success
  // loginOrderSuccess(req, res) {
  //   const formData = req.body;

  //   User.findOne({ username: formData.username, password: formData.password }).lean()
  //     .then(user => {
  //       res.redirect(`/customer/order/${user.slug}`);
  //     })
  //     .catch(error => next(error));
  // }

  //[GET] /order
  order(req, res, next) {
    const currUser = req.user;
    if (!currUser) {
      res.redirect('/customer/login');
    } else {
      Order.find({ username: currUser.username }).lean()
        .then(orders => {
          const ordersWithGrandTotal = orders.map((order) => {
            order['grandTotal'] = order.cart.reduce((accum, ele) => {
              return accum + (ele.quant * ele.price);
            }, 0);
            return order;
          });
          // res.json(ordersWithGrandTotal);
          res.render('customer/order', { layout: 'customer/main', currUser, ordersWithGrandTotal: ordersWithGrandTotal, username: currUser.username });
        })
    }
  }

  //[GET] /forgot-password
  forgot(req, res, next) {
    const currUser = req.user;
    if (!currUser) {
      res.render('customer/forgot', { layout: 'customer/main' });
    } else {
      res.redirect('/customer/home');
    }
  }

  //[POST] /forgot-success
  async forgotSuccess(req, res, next) {
    const formData = req.body;
    if (formData.newPassword === formData.againPassword) {
      await User.updateOne(
        { username: formData.username, email: formData.email },
        {
          $set: { 'password': formData.newPassword }
        }
      );
      res.redirect('/customer/login');
    } else {
      res.redirect('/customer/forgot-password');
    }
  }
}


module.exports = new siteController;