const express = require('express');
const router = express.Router();
const vacunaController = require('../controllers/vacunaController');
const { verificacionToken } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// ========== RUTAS ESPECÍFICAS ==========

// Obtener próximas dosis (próximos 30 días)
router.get('/proximas/dosis', verificacionToken, authorize('admin', 'veterinario'), vacunaController.getProximasDosis);

// ========== RUTAS DINÁMICAS ==========

// Listar todas las vacunas
router.get('/', verificacionToken, authorize('admin', 'veterinario'), vacunaController.listar);

// Registrar vacuna (veterinario o admin)
router.post('/', verificacionToken, authorize('admin', 'veterinario'), vacunaController.crear);

// Obtener vacunas por mascota
router.get('/mascota/:mascotaId', verificacionToken, vacunaController.listarPorMascota);

// Obtener vacuna por ID
router.get('/:id', verificacionToken, vacunaController.getById);

// Actualizar vacuna
router.put('/:id', verificacionToken, authorize('admin', 'veterinario'), vacunaController.actualizar);

// Eliminar vacuna
router.delete('/:id', verificacionToken, authorize('admin'), vacunaController.eliminar);

module.exports = router;
