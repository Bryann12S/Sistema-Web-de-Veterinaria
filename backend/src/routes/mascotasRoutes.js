const express = require('express');
const router = express.Router();
const mascota = require('../models/mascotaModel');

router.get('/', async (req, res) => {
    try {
        const mascotas = await mascota.getAll();
        res.json(mascotas);
    } catch (error){
        res.status(500).json({error: error.menssage});
    }
});

module.exports = router;
