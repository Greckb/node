module.exports.formPerfil = async (req,res) => {
    res.render("perfil");
};

module.exports.editarFotoPerfil = async (req, res) =>{
    return res.json({ok: true});
}