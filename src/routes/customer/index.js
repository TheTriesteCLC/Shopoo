const siteCustomerRouter = require('./site')
const shopSingleRouter = require('./shopSingle')

function route(app) {
  app.use('/customer/shop-single', shopSingleRouter);
  app.use('/customer', siteCustomerRouter);

}

module.exports = route;