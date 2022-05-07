const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const { create } = require("express-handlebars");
const csrf = require("csurf")
const User = require("./models/User");
require('dotenv').config();
require('./database/db');

const app = express();

//Con session creamos una session el usuario
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    name: "secret-name-greck"
    })
);

//Con esto guardamos la session en flash, solo dura una vez
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(
    (user, done) => done(null, { id: user._id, userName: user.userName }) //se guardará en req.user
);

// preguntar en DB por el usuario???
passport.deserializeUser(async (user, done) => {
    const userDB = await User.findById(user.id).exec();
    return done(null, { id: userDB._id, userName: userDB.userName }); //se guardará en req.user
});


const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({extended: true}));

app.use(csrf());


app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.mensajes = req.flash("mensajes");
    next();
});

app.use("/", require("./routes/home"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log("Funcionado " + PORT);
})

