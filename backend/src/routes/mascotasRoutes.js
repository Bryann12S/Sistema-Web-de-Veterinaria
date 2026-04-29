const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController');
const { verificacionToken } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

//Defincion de rutas apuntando al controller

router.get('/', verificacionToken, mascotaController.listar);
router.post('/', verificacionToken, mascotaController.crear);

// Actualizar y eliminar solo para personal autorizado ; admin o veterinarios
router.put('/:id', verificacionToken, authorize('admin', 'veterinario'), mascotaController.actualizar);
router.delete('/:id', verificacionToken, authorize('admin'), mascotaController.eliminar);

module.exports = router;
