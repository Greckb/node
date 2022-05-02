const {URL} = require("url");
const UrlValidar = (req, res, next) =>{
    try {
        const {origen} = req.body;
        const urlFronted = new URL(origen);
        if (urlFronted.origen !== null){
            return next();
        } else {
            throw new Error("URL no valida"); 
        }
    } catch (error) {
        
        return res.redirect("/");      
    }
};

module.exports = UrlValidar;