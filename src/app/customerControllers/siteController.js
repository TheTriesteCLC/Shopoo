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
}

module.exports = new siteController;