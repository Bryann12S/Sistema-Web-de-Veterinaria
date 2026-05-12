const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController');
const { verificacionToken } = require('../middlewares/authMiddleware'); 
const { authorize } = require('../middlewares/roleMiddleware');

// ========== RUTAS DINÁMICAS ==========

// Listar todos los historiales (admin, veterinario)
router.get('/', verificacionToken, authorize('admin', 'veterinario'), historialController.listar);

// Crear historial (veterinario o admin)
router.post('/', verificacionToken, authorize('admin', 'veterinario'), historialController.crear);

// Obtener historial por mascota
router.get('/mascota/:mascotaId', verificacionToken, historialController.listarPorMascota);

// Obtener historial por veterinario
router.get('/veterinario/:veterinarioId', verificacionToken, historialController.listarPorVeterinario);

// Obtener historial por ID
router.get('/:id', verificacionToken, historialController.getById);

// Actualizar historial
router.put('/:id', verificacionToken, authorize('admin', 'veterinario'), historialController.actualizar);

// Eliminar historial
router.delete('/:id', verificacionToken, authorize('admin'), historialController.eliminar);

module.exports = router;