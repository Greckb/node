const express = require("express");
const { body } = require("express-validator");
const req = require("express/lib/request");
const { loginForm, registerForm, registerUser, confirmarCuenta, loginUser, cerrarSesion } = require('../controllers/authController');
const router = express.Router();

router.get("/register", registerForm);
router.post("/register", 
    [
        body("userName","Ingrese un nombre Valido")
            .trim()
            .notEmpty()
            .escape(),
        body("email","Ingrese un email Valido")
            .trim()
            .isEmail()
            .normalizeEmail({remove_dots: false}),
            
        body("password","Ingrese contraseña de minimo de 6 caracteres")
            .trim()
            .isLength({min: 6, max: 15})
            .escape()
            .custom((value, {req})=>{
                if(value !== req.body.repassword){
                    throw new Error("No coincide las contraseñas")
                }else{
                    return value;
                }
            }),
        ],registerUser );
router.get("/confirmar/:token", confirmarCuenta );

router.get("/login", loginForm);
router.post("/login",
    [
        body("email","Ingrese un email Valido")
            .trim()
            .isEmail()
            .normalizeEmail(),
        body("password","Ingrese contraseña de minimo de 6 caracteres")
            .trim()
            .isLength({min: 6, max: 15})
            .escape(),
    ],loginUser);

router.get("/logout", cerrarSesion);


module.exports = router
