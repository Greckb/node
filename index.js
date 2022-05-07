const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");

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


require('dotenv').config();
require('./database/db');
const { create } = require("express-handlebars");

const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({extended: true}));

app.use("/", require("./routes/home"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log("Funcionado " + PORT);
})

