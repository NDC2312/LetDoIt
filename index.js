const express = require('express')
const path = require("path")
const methodOverride = require("method-override");
const bodyParse = require("body-parser");
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("express-flash")  
const moment = require("moment")
require("dotenv").config()
const app = express()


const http = require('http');
const { Server } = require("socket.io");

// Socket IO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
io.on('connection', (socket) => {
  console.log('a user connected');
});

//END SocketIO

const database = require("./config/database")

const systemConfig = require("./config/system")
const route = require("./routes/client/index.route")
const routeAdmin = require("./routes/admin/index.route")

database.connect();

const port = process.env.PORT;
app.use(methodOverride("_method"));

app.use(bodyParse.urlencoded({extended: false}))

app.set('views',`${__dirname}/views`);
app.set('view engine', 'pug')

// flash
app.use(cookieParser('TranNhatNam '));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));


// App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

// Routes
route(app);
routeAdmin(app);
app.get("*", (req,res) => {
  res.render("client/pages/errors/404",{
    pageTitle: "404 Not Found"
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})