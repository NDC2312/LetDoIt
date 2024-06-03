const express = require('express')
const methodOverride = require("method-override");
const bodyParse = require("body-parser");
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("express-flash")  
require("dotenv").config()

const database = require("./config/database")

const systemConfig = require("./config/system")
const route = require("./routes/client/index.route")
const routeAdmin = require("./routes/admin/index.route")

database.connect();

const app = express()
const port = process.env.PORT;
app.use(methodOverride("_method"));

app.use(bodyParse.urlencoded({extended: false}))

app.set('views',`${__dirname}/views`);
app.set('view engine', 'pug')

// flash
app.use(cookieParser('TranNhatNam '));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

// Routes
route(app);
routeAdmin(app);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})