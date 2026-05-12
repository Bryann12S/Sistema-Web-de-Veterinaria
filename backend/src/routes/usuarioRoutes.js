const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificacionToken } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Autenticación
router.post('/registro', usuarioController.registrarCliente);
router.post('/login', usuarioController.login);

// Perfil del usuario autenticado
router.get('/perfil', verificacionToken, usuarioController.obtenerPerfil);
router.put('/perfil', verificacionToken, usuarioController.actualizarPerfil);

// Gestión de personal (solo admin)
router.post('/crear-personal', verificacionToken, authorize('admin'), usuarioController.crearPersonal);
router.get('/todos', verificacionToken, authorize('admin'), usuarioController.obtenerTodos);
router.put('/:id/estado', verificacionToken, authorize('admin'), usuarioController.cambiarEstado);
router.put('/:id/rol', verificacionToken, authorize('admin'), usuarioController.actualizarRol);
router.put('/:id', verificacionToken, authorize('admin'), usuarioController.actualizarUsuario);

// Obtener veterinarios (público, cualquier rol autenticado)
router.get('/veterinarios', verificacionToken, usuarioController.obtenerVeterinarios);

module.exports = router;