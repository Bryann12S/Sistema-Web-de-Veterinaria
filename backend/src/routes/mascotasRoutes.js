const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController');
const {verificacionToken} = require('../middlewares/authMiddleware');

//Defincion de rutas apuntando al controller

router.get('/', verificacionToken, mascotaController.listar);
router.post('/', verificacionToken, mascotaController.crear);
router.put('/:id', verificacionToken, mascotaController.actualizar);
router.delete('/:id', verificacionToken, mascotaController.eliminar);

module.exports = router;
