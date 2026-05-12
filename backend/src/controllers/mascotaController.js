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
            const userIdToken = req.user.id;
            const { nombre, especie, raza, sexo, color, peso, fecha_nacimiento, esterilizado, foto } = req.body;
            
            if (!nombre || !especie || !raza) {
                return res.status(400).json({ error: "Nombre, especie y raza son obligatorios" });
            }
            
            const datosMascota = {
                nombre,
                especie,
                raza,
                sexo: sexo || null,
                color: color || null,
                peso: peso || null,
                fecha_nacimiento: fecha_nacimiento || null,
                esterilizado: esterilizado || 0,
                foto: foto || null,
                user_id: userIdToken
            };
            
            const id = await Mascota.crear(datosMascota);
            res.status(201).json({ message: "Mascota creada exitosamente", id });
        } catch (error) {
            res.status(500).json({ error: "Error al crear la mascota: " + error.message });
        }
    },
    //Actualizar datos de una mascota
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const {id: userId, rol} = req.user;
            const { nombre, especie, raza, sexo, color, peso, fecha_nacimiento, esterilizado, foto } = req.body;

            const mascota = await Mascota.getById(id);
            if (!mascota) {
                return res.status(404).json({ error: "Mascota no encontrada" });
            }
            if (rol === 'cliente' && mascota.user_id !== userId) {
                return res.status(403).json({ error: "No tienes permiso para actualizar esta mascota" });
            }

            const datosMascota = {
                nombre: nombre || mascota.nombre,
                especie: especie || mascota.especie,
                raza: raza || mascota.raza,
                sexo: sexo !== undefined ? sexo : mascota.sexo,
                color: color || mascota.color,
                peso: peso || mascota.peso,
                fecha_nacimiento: fecha_nacimiento || mascota.fecha_nacimiento,
                esterilizado: esterilizado !== undefined ? esterilizado : mascota.esterilizado,
                foto: foto || mascota.foto,
                user_id: mascota.user_id
            };

            await Mascota.actualizar(id, datosMascota);
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