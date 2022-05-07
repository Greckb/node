const { request } = require("http");
const Url = require("../models/url");
const {nanoid} = require('nanoid');
//const { url } = require("inspector");

const leerUrls = async(req, res) =>{
    console.log(req.user);
    try {
        const urls = await Url.find().lean(); 
        res.render("home", {urls: urls});
        
    } catch (error) {
        console.log(error);
        res.send("Algo esta pasando")
        
    }
};

const eliminarUrl = async (req, res) =>{

    const { id } = req.params;
    try {
        
        await Url.findByIdAndDelete(id);
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.send("Algo fallo al Eliminar");
        
    }
};

const agregarUrl = async (req, res) =>{

    const { origen } = req.body;

    try {
       const url = new Url({origen: origen, shortURL: nanoid(8)});
        await url.save();
        res.redirect('/');
        
    } catch (error) {
        console.log(error)
        res.send("error algo fallo")
        
    }
};

const editarUrlForm = async (req, res) => {
    const { id } = req.params;
    try {
        const url = await Url.findById(id).lean();
        //console.log(url);
        res.render("home", {  url });
    } catch (error) {
        console.log(error);
        res.send("Algo fallo al editar");
    }
};

const editarUrl = async (req, res) => {
    const { id } = req.params;
    const { origen } = req.body;
    try {
        await Url.findByIdAndUpdate(id, {origen: origen});
        
        res.redirect('/');
       
    } catch (error) {
        console.log(error);
    }
};

const redireccionamiento = async (req, res) =>{
    const {shortURL} = req.params;
    console.log(shortURL);
    try {
        const urldb = await Url.findOne({shortURL: shortURL});
        res.redirect(urldb.origen);
        
    } catch (error) {
        console.log(error);
        
    }

};

module.exports = {
    leerUrls, agregarUrl, eliminarUrl, editarUrlForm, editarUrl, redireccionamiento
}