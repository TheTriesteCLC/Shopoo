const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handleBars = require('express-handlebars');

const routeCustomer = require('./routes/customer');
const routeAdmin = require('./routes/admin');
const db = require('./config/db');

//Connect to DB
const databaseUrl = 'mongodb+srv://vmtriet21:vmtriet21@ptudweb-ga02.dbulhp7.mongodb.net/PTUDWEB-GA03';
db.connect(databaseUrl);

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

//Setup morgan
app.use(morgan('combined'));

//Setup view engine with handlebars
app.engine('hbs', handleBars.engine({
  extname: '.hbs',
  helpers: {
    sum: (a, b) => a + b,
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resource', 'views'));

//Setup CSS
app.use(express.static(path.join(__dirname, '../publicCus')));
app.use(express.static(path.join(__dirname, '../publicAdmin')));

//Setup session
const store = session.MemoryStore();
app.use(session({
    saveUninitialized: false,
    secret: "440457",
    cookie: {
        maxAge: 1000 * 10 // 1s * 10
    },
    store
}))

//Passport init
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.render('login', { layout: 'admin/login' })
})

//Route init
routeCustomer(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
})