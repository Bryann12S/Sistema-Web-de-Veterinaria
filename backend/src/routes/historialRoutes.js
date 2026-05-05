const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController');
const { verificacionToken } = require('../middlewares/authMiddleware'); 
const { authorize } = require('../middlewares/roleMiddleware');

//definimos las rutas apuntando al controller
router.get('/mascota/:idMascota', verificacionToken, historialController.listarPorMascota);
router.post('/', verificacionToken, authorize('admin', 'veterinario'), historialController.crear);

module.exports = router;