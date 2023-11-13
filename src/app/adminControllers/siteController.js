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
  tables(req, res) {
    res.render('admin/tables', { layout: 'admin/main' });
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
    res.render('admin/sign-Up', { layout: 'admin/customSignin' });
  }
}

module.exports = new siteController;