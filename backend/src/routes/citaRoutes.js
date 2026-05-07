const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');
const { verificacionToken } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// GET  /api/citas         → todos los roles (el controller filtra por rol)
router.get('/', verificacionToken, authorize('admin', 'veterinario', 'cliente'), citaController.listar);

// POST /api/citas         → solo el cliente puede agendar
router.post('/', verificacionToken, authorize('cliente'), citaController.crear);

// PUT  /api/citas/:id/estado → solo veterinario actualiza estado clínico
router.put('/:id/estado', verificacionToken, authorize('veterinario'), citaController.actualizarEstado);

module.exports = router;