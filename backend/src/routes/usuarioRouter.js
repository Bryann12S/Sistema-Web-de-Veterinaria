const express = require('express');
const router = express.Router();
const usuario = require('../models/usuarioModel');

router.post('/', async (req, res) => {
    const {nombre, email, password, rol} = req.body;
    try{
        const id = await usuario.crear(nombre, email, password, rol);
        res.status(201).json({ message: "Usuario creado exitosamente", id });
    } catch (error){
        res.status(500).json({ message: "Error al crear el usuario", error: error.message });
    }
});

module.exports = router;