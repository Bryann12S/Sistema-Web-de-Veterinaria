const express = require('express');
const router = express.Router();
const cita = require('../models/citasModel');

//obtener todas las citas
router.get('/', async (req, res) => {
    try {
        const citas = await cita.getAll();
        res.json(citas);
    } catch (error){
        res.status(500).json({error: error.message});
    }
});

//agendar cita
router.post('/', async (req, res) => {
    try {
        const id = await cita.crear(req.body);
        res.status(201).json({ message: "Cita creada exitosamente", id });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la cita", error: error.message });
    }
});

module.exports = router;