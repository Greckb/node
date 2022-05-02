const express = require('express');
const { leerUrls, agregarUrl, eliminarUrl } = require('../controllers/homeController');
const UrlValidar = require('../middlewares/UrlValidar');
const router = express.Router();


router.get('/', leerUrls);
router.post('/',UrlValidar, agregarUrl);
router.get('/eliminar/:id',eliminarUrl);




module.exports = router


