const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

//Defincion de rutas apuntando al controller
router.post('/', usuarioController.crear);
router.post('/login', usuarioController.login);

module.exports = router;