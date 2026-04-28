const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

//Defincion de rutas apuntando al controller
router.get('/', citaController.listar);
router.post('/', citaController.crear);
router.put('/:id/estado', citaController.actualizarEstado);

module.exports = router;