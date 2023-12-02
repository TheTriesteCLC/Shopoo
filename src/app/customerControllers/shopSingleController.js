class shopSingleController {

  //[GET] /shop-single/:id
  item(req, res) {
    res.render('customer/item', { layout: 'customer/main' });
  }
  //[GET] /shop-single/:slug
  index(req, res) {
    res.render('customer/shop-single', { layout: 'customer/main' })
  }
}

module.exports = new shopSingleController;