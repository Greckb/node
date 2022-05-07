const express = require('express');
const { route } = require('express/lib/application');
const { leerUrls, agregarUrl, eliminarUrl, editarUrl, editarUrlForm, redireccionamiento} = require('../controllers/homeController');
const UrlValidar = require('../middlewares/UrlValidar');
const verificarUser = require('../middlewares/verificarUser');
const router = express.Router();


router.get("/", verificarUser,leerUrls);
router.post("/",verificarUser,UrlValidar, agregarUrl);
router.get("/eliminar/:id",verificarUser,eliminarUrl);
router.get("/editar/:id", verificarUser,editarUrlForm);
router.post("/editar/:id",verificarUser ,UrlValidar, editarUrl);
router.get("/:shortURL", redireccionamiento);




module.exports = router


