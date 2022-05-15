const formidable = require('formidable');
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs");
const User = require('../models/User');


module.exports.formPerfil = async (req,res) => {
    try {
        const user = await User.findById(req.user.id);

        res.render("perfil", {user: req.user, imagen: user.imagen, email: user.email});
    } catch (error) {
        req.flash("mensajes", [{msg: "Error al leer el usuario"}])
    }
};

module.exports.editarFotoPerfil = async (req, res) =>{

    const form = new formidable.IncomingForm();

    
    form.maxFileSize = 50 * 1024 * 1024 //estos datos son 5M bytes

    form.parse(req, async(err, fields, files) =>{
        try {
            if(err){
                throw new Error("Error al subir la imagen")
            }
            //console.log(fields);
            console.log(files);

            const file = files.myFile

            if (file.originalFilename === ""){
                throw new Error("Por favor, agrege una imagen")

            }

            const imageTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
                "image/gif",
            ];
            if(!(imageTypes.includes(file.mimetype) )){
                throw new Error("Por favor, agrege una imagen correcta (Jpeg, Png, Webp, Gif)")
            }

            if(file.size > 50 * 1024 * 1024){
                throw new Error("Por favor, la imagen no puede acceder mas de 1024x1024 y tampoco puede superar los 5M ")
            }

            //Con esto pillo la extension del archivo, porque separa el image/ que seria el 0 y nos devuelve el 1 que seria jpg,png,...
            const extension = file.mimetype.split("/")[1]
            const dirFile = path.join(__dirname, `../public/img/perfiles/${req.user.id}.${extension}`) 
            var is = fs.createReadStream('/tmp/');
            var os = fs.createWriteStream(dirFile);

            is.pipe(os);
            is.on('end',function() {
                fs.unlinkSync('/tmp/');
            });
            
            //Redirigo la direccion para poder guardar la imagen
            
            
            console.log(dirFile + extension)

            //Con esto cogemos la ruta de donde viene y la redirigimos a nuestro servidor
            fs.renameSync(file.filepath, dirFile);

            //Con esto lo leemos la imagen y la reajustamos
            const image = await Jimp.read(dirFile);
            image.resize(200, 200).quality(90).writeAsync(dirFile)

            const user = await User.findById(req.user.id);
            user.imagen = `${req.user.id}.${extension}`
            await user.save();

            req.flash("mensajes", [{msg: "Imagen actualizada"}])
            
        } catch (error) {
            console.log(error)
            req.flash("mensajes", [{msg: error.message}]);
        } finally{
            return res.redirect("/perfil");

        }


    })
}