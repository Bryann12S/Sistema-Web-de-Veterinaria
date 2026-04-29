const Mascota = require('../models/mascotaModel');

const mascotaController = {
    //obtener mascotas por usuario o todas si es admin
    listar: async (req, res) => {
        try {
            const userId = req.user.id; // Asumiendo que el middleware de autenticación agrega el usuario al request
            const rol = req.user.rol; // Obtener el rol del usuario
            let mascotas;
            if (rol === 'admin') {
                mascotas = await Mascota.getAll(); // Si es admin, obtiene todas las mascotas
            } else {
                mascotas = await Mascota.getByUser(userId); // Si no es admin, obtiene solo las mascotas del usuario
            }
            res.json(mascotas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //registrar una nueva mascota 
    crear: async (req, res) => {
        try {
            const id = await Mascota.crear(req.body);
            res.status(201).json({ message: "Mascota creada exitosamente", id });
        } catch (error) {
            res.status(500).json({ error: "Error al crear la mascota: " + error.message });
        }
    },
    //Actualizar datos de una mascota
    actualizar: async (req, res) => {
        try {
            const id = req.params.id;
            await Mascota.actualizar(id, req.body);
            res.json({ message: "Mascota actualizada exitosamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar la mascota: " + error.message });
        }
    },
    //eliminar mascota
    eliminar: async (req, res)=>{
        try{
            const id = req.params.id;
            await Mascota.eliminar(id);
            res.json({ message: "Mascota eliminada exitosamente" });
        } catch (error){
            res.status(500).json({ error: "Error al eliminar la mascota: " + error.message });
        }
    }
};

module.exports = mascotaController;