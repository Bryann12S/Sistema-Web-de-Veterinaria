const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController');

//Defincion de rutas apuntando al controller
router.get('/', mascotaController.listar);
router.post('/', mascotaController.crear);
router.put('/:id', mascotaController.actualizar);
router.delete('/:id', mascotaController.eliminar);

module.exports = router;
