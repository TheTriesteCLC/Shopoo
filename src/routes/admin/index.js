const siteAdminRouter = require('../admin/site');

function route(app) {
  app.use('/admin', siteAdminRouter);
}

module.exports = route;