const Usuario = require('../models/usuarioModel');

const usuarioController = {
    crear: async (req, res) => {
        try{
            const { nombre, email, password, rol } = req.body;
            const result = await Usuario.crear(nombre, email, password, rol);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = usuarioController;