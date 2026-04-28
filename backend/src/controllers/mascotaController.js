const Mascota = require('../models/mascotaModel');

const mascotaController = {
    //obtener todas kas mascotas 
    listar: async (req, res) => {
        try {
            const mascotas = await Mascota.getAll();
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