const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');
const { verificacionToken } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Listar citas (todos los roles, el controller filtra por rol)
router.get('/', verificacionToken, citaController.listar);

// Obtener cita por ID
router.get('/:id', verificacionToken, citaController.getById);

// Obtener citas por veterinario
router.get('/veterinario/:veterinarioId', verificacionToken, authorize('admin', 'veterinario'), citaController.getPorVeterinario);

// Obtener citas por fecha
router.get('/fecha', verificacionToken, authorize('admin', 'veterinario'), citaController.getPorFecha);

// Crear cita (cliente)
router.post('/', verificacionToken, authorize('cliente'), citaController.crear);

// Actualizar cita
router.put('/:id', verificacionToken, citaController.actualizar);

// Actualizar estado de la cita (veterinario o admin)
router.put('/:id/estado', verificacionToken, authorize('veterinario', 'admin'), citaController.actualizarEstado);

// Asignar veterinario a cita (admin)
router.put('/:id/veterinario', verificacionToken, authorize('admin'), citaController.asignarVeterinario);

// Eliminar cita (admin)
router.delete('/:id', verificacionToken, authorize('admin'), citaController.eliminar);

module.exports = router;