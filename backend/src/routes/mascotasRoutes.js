const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController');
const { verificacionToken } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// ========== RUTAS DINÁMICAS ==========

// Listar mascotas
router.get('/', verificacionToken, mascotaController.listar);

// Crear mascota (cliente)
router.post('/', verificacionToken, authorize('cliente'), mascotaController.crear);

// Obtener mascota por ID
router.get('/:id', verificacionToken, mascotaController.getById);

// Actualizar mascota (dueño o admin)
router.put('/:id', verificacionToken, mascotaController.actualizar);

// Eliminar mascota (dueño o admin)
router.delete('/:id', verificacionToken, mascotaController.eliminar);

module.exports = router;
