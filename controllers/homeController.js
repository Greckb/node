const { request } = require("http");
const Url = require("../models/url");
const {nanoid} = require('nanoid');
const { url } = require("inspector");

const leerUrls = async(req, res) =>{

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

module.exports = {
    leerUrls, agregarUrl, eliminarUrl
}