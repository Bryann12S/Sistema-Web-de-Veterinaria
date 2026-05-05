const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificacionToken } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

//Defincion de rutas apuntando al controller
router.post('/registro', usuarioController.registrarCliente);
router.post('/crear-personal',verificacionToken, authorize('admin'), usuarioController.crearPersonal);
router.post('/login', usuarioController.login);
router.get('/perfil', verificacionToken, usuarioController.obtenerPerfil);

module.exports = router;