//const req = require("express/lib/request");
const User = require("../models/User");
const { nanoid } = require("nanoid");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
require("dotenv").config();
//const { insertMany } = require("../models/User");


const registerForm = (req, res) => {
    res.render("register");
    //res.render('Register');
};

const loginForm = (req, res) => {
    res.render("login");

};

const registerUser = async (req,res) => {
   
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        req.flash("mensajes", errors.array());
        return res.redirect("/auth/register");
    }
   
    const {userName, email, password } = req.body;
    try {
        let user = await User.findOne({email: email});
        if (user) throw new Error("Ya existe el usuario");
        user = new User ({userName, email, password, tokenConfirm: nanoid() });

        await user.save();

        //Enviar correo para confirmar la cuenta.
        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.USEREMAIL,
              pass: process.env.PASSEMAIL,
            },
          });

          await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: user.email, // list of receivers
            subject: "Verifica tu cuenta de Email", // Subject line
            text: "Hello world?", // plain text body
            html: `<a href="${process.env.PATHHEROKU || `http://127.0.0.1:5000`}auth/confirmar/${user.tokenConfirm}">Verifica tu cuenta aqui</a>`, // html body
          });

        req.flash("mensajes",[{msg:"Revisa tu correo electronico para validar Contraseña"}])
        res.redirect("/auth/login");
        //res.json(user);
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/auth/register");
        //res.json({ error: error.message });
        
    }
};

const confirmarCuenta = async (req, res) =>{
    const {token} = req.params;

    try {
        let user = await User.findOne({tokenConfirm: token});
        if (!user) throw new Error("No existe este usuario");

        user.cuentaConfirmada = true;
        user.tokenConfirm = null;
        await user.save();


        req.flash("mensajes",[{msg:"Cuenta verificada, puedes iniciar session"}])
        res.redirect("/auth/login");
        
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/auth/login");

        //res.json({ error: error.message });
    }
    //res.json(token);
};



const loginUser = async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash("mensajes", errors.array());
        return res.redirect("/auth/login");
    }

    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) throw new Error("No existe este email");
        if (!user.cuentaConfirmada) throw new Error("La cuenta no esta confirmada");
        if (!(await user.comparePassword(password))) 
            throw new Error("La contraseña no es correcta");

        //Me esta creando la session de usuario a traves de passport
        req.login(user, function(err){
            if(err) throw new Error("Error al crear la session");
            return res.redirect("/");
        })
        //return res.redirect("/");
        
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/auth/login");
    }
};



const cerrarSesion =(req,res) =>{
    req.logout();
    return res.redirect("/auth/login");
};

module.exports = { loginForm, registerForm, registerUser, confirmarCuenta, loginUser, cerrarSesion}