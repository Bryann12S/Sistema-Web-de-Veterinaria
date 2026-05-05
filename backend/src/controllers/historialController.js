const Historial = require('../models/historialModel');

const historialController = {
    //obtener historial por id de mascota
    listarPorMascota: async (req, res) => {
        try {
            const idMascota = req.params.idMascota;
            const {id: usuarioId, rol } = req.user;

            if (rol === 'cliente') {
                const mascota = await Historial.getDuenio(idMascota);

                if (!mascota || mascota.user_id !== usuarioId) {
                    return res.status(403).json({ message: "No tienes permiso para ver este historial" });
                }
            }

            const historial = await Historial.getByMascotaId(idMascota);
            res.json(historial);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //crear nuevo historial
    crear: async (req, res) => {
        try {
            //Obtenemos el ID del veterinario del token
            const veterinarioId = req.user.id;
            const data = {
                ...req.body,
                veterinario_id: veterinarioId
            };
            
            const id = await Historial.crear(data);
            res.status(201).json({ message: "Historial creado exitosamente", id });
        } catch (error) {
            res.status(500).json({ message: "Error al crear el historial", error: error.message });
        }   
    }
};

module.exports = historialController;