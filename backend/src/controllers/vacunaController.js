const Vacuna = require('../models/vacunaModel');

const vacunaController = {
    //obtener todas las vacunas
    listar: async (req, res) => {
        try {
            const vacunas = await Vacuna.getAll();
            res.json(vacunas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //obtener vacuna por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const vacuna = await Vacuna.getById(id);
            if (!vacuna) {
                return res.status(404).json({ error: "Vacuna no encontrada" });
            }
            res.json(vacuna);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //obtener vacunas por mascota
    listarPorMascota: async (req, res) => {
        try {
            const { mascotaId } = req.params;
            const vacunas = await Vacuna.getByMascotaId(mascotaId);
            res.json(vacunas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //obtener proximas dosis de vacunas (proximas 30 días)
    getProximasDosis: async (req, res) => {
        try {
            const vacunas = await Vacuna.getProximasDosis();
            res.json(vacunas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //registrar vacuna
    crear: async (req, res) => {
        try {
            const { mascota_id, nombre, fecha_aplicacion, proxima_dosis, observaciones } = req.body;
            
            if (!mascota_id || !nombre || !fecha_aplicacion) {
                return res.status(400).json({ error: "Mascota ID, nombre de vacuna y fecha de aplicación son obligatorios" });
            }

            const veterinarioId = req.user.id;
            const id = await Vacuna.crear({
                mascota_id,
                nombre,
                fecha_aplicacion,
                proxima_dosis: proxima_dosis || null,
                veterinario_id: veterinarioId,
                observaciones: observaciones || null
            });

            res.status(201).json({ message: "Vacuna registrada exitosamente", id });
        } catch (error) {
            res.status(500).json({ error: "Error al registrar la vacuna: " + error.message });
        }
    },
    //actualizar vacuna
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, fecha_aplicacion, proxima_dosis, observaciones } = req.body;

            const vacuna = await Vacuna.getById(id);
            if (!vacuna) {
                return res.status(404).json({ error: "Vacuna no encontrada" });
            }

            await Vacuna.actualizar(id, {
                nombre: nombre || vacuna.nombre,
                fecha_aplicacion: fecha_aplicacion || vacuna.fecha_aplicacion,
                proxima_dosis: proxima_dosis !== undefined ? proxima_dosis : vacuna.proxima_dosis,
                veterinario_id: vacuna.veterinario_id,
                observaciones: observaciones || vacuna.observaciones
            });

            res.json({ message: "Vacuna actualizada exitosamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar la vacuna: " + error.message });
        }
    },
    //eliminar vacuna
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const vacuna = await Vacuna.getById(id);

            if (!vacuna) {
                return res.status(404).json({ error: "Vacuna no encontrada" });
            }

            await Vacuna.eliminar(id);
            res.json({ message: "Vacuna eliminada exitosamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar la vacuna: " + error.message });
        }
    }
};

module.exports = vacunaController;
