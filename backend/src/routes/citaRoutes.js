const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');
const { verificacionToken } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

//Defincion de rutas apuntando al controller
router.get('/', verificacionToken, authorize('admin', 'veterinario', 'cliente'), citaController.listar);
router.post('/', verificacionToken, authorize('cliente'), citaController.crear);
router.put('/:id/estado', verificacionToken, authorize('admin', 'veterinario'), citaController.actualizarEstado);

module.exports = router;