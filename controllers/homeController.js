const { request } = require("http");
const Url = require("../models/url");
const {nanoid} = require('nanoid');
const { findById } = require("../models/url");
//const { url } = require("inspector");


const leerUrls = async(req, res) =>{
    //console.log(req.user);
    try {
        const urls = await Url.find({user: req.user.id}).lean(); 
        res.render("home", {urls: urls}); 
        
    } catch (error) {
        //console.log(error);
        //res.send("Algo esta pasando")
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/");
    }
};

const eliminarUrl = async (req, res) =>{
    const { id } = req.params;
    try {
        //await Url.findByIdAndDelete(id);
        const url = await Url.findById(id);
        if(!url.user.equals(req.user.id)){
            throw new Error("No es tu URL")
        }
        await url.remove();
        req.flash("mensajes", [{msg: "URL Eliminada"}]);
        return res.redirect('/');
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/");
        
    }
};

const agregarUrl = async (req, res) =>{
    const { origen } = req.body;
    
    try {  
        
        const url = new Url({origen: origen, shortURL: nanoid(8), user: req.user.id});
        
        await url.save();
        req.flash("mensajes", [{msg: "URL Agregada"}]);
        return res.redirect('/');   
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/"); 
    }
};

const editarUrlForm = async (req, res) => {
    const { id } = req.params;
    try {
        const url = await Url.findById(id).lean();
        //console.log(url);

        if(!url.user.equals(req.user.id)){
            throw new Error("No es tu URL")
        }
        res.render("home", {  url });
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/");
    }
};

const editarUrl = async (req, res) => {
    const { id } = req.params;
    const { origen } = req.body;
    try {
        const url = await Url.findById(id);
        if(!url.user.equals(req.user.id)){
            throw new Error("No es tu URL")
        }
        await url.updateOne({origen});
        req.flash("mensajes", [{msg: "URL Actualizada"}]);

        //await Url.findByIdAndUpdate(id, {origen: origen});    
        return res.redirect('/');
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/");
    }
};

const redireccionamiento = async (req, res) =>{
    const {shortURL} = req.params;
    //console.log(shortURL);
    try {
        const urldb = await Url.findOne({shortURL: shortURL});
        res.redirect(urldb.origen);     
    } catch (error) {
        req.flash("mensajes", [{msg: "Esa Url no existe"}]);
        return res.redirect("/auth/login");   
    }
};

module.exports = {
    leerUrls, agregarUrl, eliminarUrl, editarUrlForm, editarUrl, redireccionamiento
}