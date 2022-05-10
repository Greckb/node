const {URL} = require("url");
const UrlValidar = (req, res, next) =>{
    try {
        const {origen} = req.body;
        const urlFronted = new URL(origen);
        if (urlFronted.origen !== null){
            if(
                urlFronted.protocol === "http:" ||
                urlFronted.protocol === "https:"
            ){
            return next();
            }
            throw new Error("Tiene que tener http://"); 
        } 
            throw new Error("URL no valida"); 
    } catch (error) {     
        //return res.redirect("/"); 
        if(error.message === "Invalid URL"){
            req.flash("mensajes", [{msg: "URL no valida"}]);
        }else{
            req.flash("mensajes", [{msg: error.message}]);
        }
        return res.redirect("/");
        
    }
};

module.exports = UrlValidar;