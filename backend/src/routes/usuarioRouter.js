const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

//Defincion de rutas apuntando al controller
router.post('/', usuarioController.crear);

module.exports = router;