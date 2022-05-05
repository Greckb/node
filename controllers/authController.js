//const req = require("express/lib/request");
const User = require("../models/User");
const { nanoid } = require("nanoid");


const registerForm = (req, res) => {
    res.render('Register');
}

const registerUser = async (req,res) => {
    console.log(req.body);
    const {userName, email, password } = req.body;
    try {
        let user = await User.findOne({email: email});
        if (user) throw new Error("Ya existe el usuario");
        user = new User ({userName, email, password, tokenConfirm: nanoid() });
        
        await user.save();
        res.json(user);
    } catch (error) {
        
        res.json({ error: error.message });
        
        
    }
};

const loginForm = (req, res) => {
    res.render('login');

}

module.exports = { loginForm, registerForm, registerUser}