const express = require('express');
const { route } = require('express/lib/application');
const { leerUrls, agregarUrl, eliminarUrl, editarUrl, editarUrlForm, redireccionamiento} = require('../controllers/homeController');
const UrlValidar = require('../middlewares/UrlValidar');
const verificarUser = require('../middlewares/verificarUser');
const router = express.Router();


router.get("/", verificarUser,leerUrls);
router.post("/",UrlValidar, agregarUrl);
router.get("/eliminar/:id",eliminarUrl);
router.get("/editar/:id", editarUrlForm);
router.post("/editar/:id", UrlValidar, editarUrl);
router.get("/:shortURL", redireccionamiento);




module.exports = router


