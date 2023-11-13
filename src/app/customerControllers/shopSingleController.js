class shopSingleController {
  //[GET] /shop-single
  index(req, res) {
    res.render('customer/shop-single', { layout: 'customer/main' })
  }

  //[GET] /shop-single/:slug
  item(req, res) {
    res.render('customer/shop-single', { layout: 'customer/main' });
  }
}

module.exports = new shopSingleController;