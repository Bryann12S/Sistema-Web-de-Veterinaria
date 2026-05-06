const Mascota = require('../models/mascotaModel');

const mascotaController = {
    //obtener mascotas por usuario o todas si es admin
    listar: async (req, res) => {
        try {
            const userId = req.user.id; // Asumiendo que el middleware de autenticación agrega el usuario al request
            const rol = req.user.rol; // Obtener el rol del usuario

            let mascotas;
            if (rol === 'admin' || rol === 'veterinario') {
                mascotas = await Mascota.getAll(); // Si es admin, obtiene todas las mascotas
            } else {
                mascotas = await Mascota.getByUser(userId); // Si no es admin, obtiene solo las mascotas del usuario
            }
            res.json(mascotas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    //obtener una mascota por su ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const mascota = await Mascota.getById(id);
            if (!mascota) {
                return res.status(404).json({ error: "Mascota no encontrada" });
            }
            res.json(mascota);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //registrar una nueva mascota 
    crear: async (req, res) => {
        try {
            const userIdToken = req.user.id; // Obtener el ID del usuario desde el token
            //const id = await Mascota.crear(req.body);
            const datosMascota = { ...req.body, user_id: userIdToken }; // Agregar el ID del usuario a los datos de la mascota
            
            const id = await Mascota.crear(datosMascota); // Crear la mascota con los datos completos
            res.status(201).json({ message: "Mascota creada exitosamente", id });
        } catch (error) {
            res.status(500).json({ error: "Error al crear la mascota: " + error.message });
        }
    },
    //Actualizar datos de una mascota
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const {id: userId, rol} = req.user; // Obtener el ID y rol del usuario desde el token
            const {nombre, especie, raza} = req.body; // Obtener los datos a actualizar

            const mascota = await Mascota.getById(id); // Obtener la mascota por su ID
            if (!mascota) {
                return res.status(404).json({ error: "Mascota no encontrada" });
            }
            if (rol === 'cliente' && mascota.user_id !== userId) { // Verificar si el usuario es cliente y dueño de la mascota
                return res.status(403).json({ error: "No tienes permiso para actualizar esta mascota" });
            }

            await Mascota.actualizar(id, { nombre, especie, raza, user_id: mascota.user_id }); // Actualizar la mascota con los datos proporcionados
            res.json({ message: "Mascota actualizada exitosamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar la mascota: " + error.message });
        }
    },
    //eliminar mascota
    eliminar: async (req, res)=>{
        try{
            const {id} = req.params;
            const {id: userId, rol} = req.user; // Obtener el ID y rol del usuario desde el token
            
            const mascota = await Mascota.getById(id); // Obtener la mascota por su ID
            
            if (!mascota) { 
                return res.status(404).json({ error: "Mascota no encontrada" });
            }

            if (rol !== 'admin' && mascota.user_id !== userId) { // Verificar si el usuario es admin o dueño de la mascota
                return res.status(403).json({ error: "No tienes permiso para eliminar esta mascota" });
            }

            await Mascota.eliminar(id);
            res.json({ message: "Mascota eliminada exitosamente" });
        } catch (error){
            res.status(500).json({ error: "Error al eliminar la mascota: " + error.message });
        }
    }
};

module.exports = mascotaController;