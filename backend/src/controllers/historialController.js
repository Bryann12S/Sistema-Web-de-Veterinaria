const Historial = require('../models/historialModel');

const historialController = {
    //obtener todos los historiales
    listar: async (req, res) => {
        try {
            const { rol } = req.user;
            let historiales;
            if (rol === 'admin' || rol === 'veterinario') {
                historiales = await Historial.getAll();
            } else {
                return res.status(403).json({ error: "No tienes permiso para listar todos los historiales" });
            }
            res.json(historiales);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //obtener historial por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const historial = await Historial.getById(id);
            if (!historial) {
                return res.status(404).json({ error: "Historial no encontrado" });
            }
            res.json(historial);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //obtener historial por id de mascota
    listarPorMascota: async (req, res) => {
        try {
            const { mascotaId } = req.params;
            const { id: usuarioId, rol } = req.user;

            if (rol === 'cliente') {
                const mascota = await Historial.getDuenio(mascotaId);
                if (!mascota || mascota.user_id !== usuarioId) {
                    return res.status(403).json({ error: "No tienes permiso para ver este historial" });
                }
            }

            const historial = await Historial.getByMascotaId(mascotaId);
            res.json(historial);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //obtener historial por veterinario
    listarPorVeterinario: async (req, res) => {
        try {
            const { veterinarioId } = req.params;
            const { id: usuarioId, rol } = req.user;

            if (rol === 'veterinario' && usuarioId !== parseInt(veterinarioId)) {
                return res.status(403).json({ error: "Solo puedes ver tu propio historial" });
            }

            const historial = await Historial.getByVeterinario(veterinarioId);
            res.json(historial);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //crear nuevo historial
    crear: async (req, res) => {
        try {
            const { mascota_id, cita_id, diagnostico, peso, temperatura, tratamiento, notas, proxima_visita } = req.body;
            
            if (!mascota_id) {
                return res.status(400).json({ error: "Mascota ID es obligatorio" });
            }

            const veterinarioId = req.user.id;
            const id = await Historial.crear({
                mascota_id,
                veterinario_id: veterinarioId,
                cita_id: cita_id || null,
                diagnostico: diagnostico || null,
                peso: peso || null,
                temperatura: temperatura || null,
                tratamiento: tratamiento || null,
                notas: notas || null,
                proxima_visita: proxima_visita || null
            });

            res.status(201).json({ message: "Historial creado exitosamente", id });
        } catch (error) {
            res.status(500).json({ error: "Error al crear el historial: " + error.message });
        }   
    },
    //actualizar historial
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { diagnostico, peso, temperatura, tratamiento, notas, proxima_visita } = req.body;

            const historial = await Historial.getById(id);
            if (!historial) {
                return res.status(404).json({ error: "Historial no encontrado" });
            }

            await Historial.actualizar(id, {
                diagnostico: diagnostico || historial.diagnostico,
                peso: peso || historial.peso,
                temperatura: temperatura || historial.temperatura,
                tratamiento: tratamiento || historial.tratamiento,
                notas: notas || historial.notas,
                proxima_visita: proxima_visita || historial.proxima_visita
            });

            res.json({ message: "Historial actualizado exitosamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el historial: " + error.message });
        }
    },
    //eliminar historial
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const historial = await Historial.getById(id);

            if (!historial) {
                return res.status(404).json({ error: "Historial no encontrado" });
            }

            await Historial.eliminar(id);
            res.json({ message: "Historial eliminado exitosamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar el historial: " + error.message });
        }
    }
};

module.exports = historialController;