const express = require('express');
const morgan = require('morgan');
const handleBars = require('express-handlebars');
const path = require('path');
const routeCustomer = require('./routes/customer');
const routeAdmin = require('./routes/admin');

const app = express();
const port = 3000;

//Setup morgan
app.use(morgan('combined'));

//Setup view engine with handlebars
app.engine('handlebars', handleBars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, "resource/views"));

//Setup CSS
app.use(express.static(path.join(__dirname, '../publicCus')));
app.use(express.static(path.join(__dirname, '../publicAdmin')));

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('login', { layout: 'admin/login' })
})

//Route init
routeCustomer(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
})