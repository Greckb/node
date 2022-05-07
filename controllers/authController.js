//const req = require("express/lib/request");
const User = require("../models/User");
const { nanoid } = require("nanoid");
const {validationResult} = require("express-validator");
const { insertMany } = require("../models/User");


const registerForm = (req, res) => {
    res.render('Register');
}

const registerUser = async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.json(errors);
    }
   
    const {userName, email, password } = req.body;
    try {
        let user = await User.findOne({email: email});
        if (user) throw new Error("Ya existe el usuario");
        user = new User ({userName, email, password, tokenConfirm: nanoid() });
        
        await user.save();

        //Enviar correo para confirmar la cuenta.

        res.redirect('/auth/login');
        //res.json(user);
    } catch (error) {
        
        res.json({ error: error.message });
        
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
        res.redirect('/auth/login');
        
    } catch (error) {

        res.json({ error: error.message });
    }
    //res.json(token);
};

const loginForm = (req, res) => {
    res.render("login");

};

const loginUser = async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.json(errors);
    }

    const {email, password} = req.body;
    try {
        
        const user = await User.findOne({email})
        if (!user) throw new Error("El Usuario no existe");
        if (!user.cuentaConfirmada) throw new Error("La cuenta no esta confirmada");
        if (!await user.comparePassword(password)) throw new Error("La contraseña no es correcta");

        res.redirect('/');
        
    } catch (error) {
        res.json({ error: error.message });
    }

};



module.exports = { loginForm, registerForm, registerUser, confirmarCuenta, loginUser}