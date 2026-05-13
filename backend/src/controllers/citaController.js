const Cita = require('../models/citaModel');

const citaController = {
    //obtener todas las citas
    listar: async (req, res) => {
        try {
            const {id, rol} = req.user;
            let citas;
            if (rol === "admin" || rol === "veterinario"){
                citas = await Cita.getAll();
            } else{
                citas = await Cita.getByUser(id);
            }
            res.json(citas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //obtener cita por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const cita = await Cita.getById(id);
            if (!cita) {
                return res.status(404).json({ error: "Cita no encontrada" });
            }
            res.json(cita);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //obtener citas por veterinario
    getPorVeterinario: async (req, res) => {
        try {
            const { veterinarioId } = req.params;
            const citas = await Cita.getByVeterinario(veterinarioId);
            res.json(citas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //obtener citas por fecha
    getPorFecha: async (req, res) => {
        try {
            const { fecha } = req.query;
            if (!fecha) {
                return res.status(400).json({ error: "Fecha requerida" });
            }
            const citas = await Cita.getByfecha(fecha);
            res.json(citas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //obtener horas ocupadas por fecha
    getHorasOcupadas: async (req, res) => {
        try {
            const { fecha } = req.params;
            const citas = await Cita.getByfecha(fecha);
            const horasOcupadas = citas
                .filter(c => c.estado !== 'cancelada')
                .map(c => c.hora.substring(0, 5));
            res.json(horasOcupadas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //agendar cita
    crear: async (req, res) => {
        try {
            const { fecha, hora, mascota_id, motivo, tipo_consulta, veterinario_id } = req.body;
            
            if (!fecha || !hora || !mascota_id) {
                return res.status(400).json({ error: "Fecha, hora y mascota_id son obligatorios" });
            }

            const tiposPermitidos = [
                'General', 'Vacunación', 'Desparasitación', 
                'Cirugía', 'Urgencia', 'Estética', 'Control'
            ];

            if (tipo_consulta && !tiposPermitidos.includes(tipo_consulta)) {
                return res.status(400).json({
                    error: "Tipo de consulta no válido",
                    opciones: tiposPermitidos
                });
            }

            const id = await Cita.crear({
                fecha,
                hora,
                mascota_id,
                motivo: motivo || null,
                tipo_consulta: tipo_consulta || 'General',
                veterinario_id: veterinario_id || null
            });
            res.status(201).json({ message: "Cita creada exitosamente", id });
        } catch (error) {
            res.status(500).json({ error: "Error al crear la cita: " + error.message });
        }
    },
    //actualizar cita
    actualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { fecha, hora, mascota_id, motivo, tipo_consulta, veterinario_id } = req.body;

            const cita = await Cita.getById(id);
            if (!cita) {
                return res.status(404).json({ error: "Cita no encontrada" });
            }

            await Cita.actualizar(id, {
                fecha: fecha || cita.fecha,
                hora: hora || cita.hora,
                mascota_id: mascota_id || cita.mascota_id,
                motivo: motivo || cita.motivo,
                tipo_consulta: tipo_consulta || cita.tipo_consulta,
                veterinario_id: veterinario_id !== undefined ? veterinario_id : cita.veterinario_id
            });

            res.json({ message: "Cita actualizada exitosamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar la cita: " + error.message });
        }
    },
    //actualizar estado de la cita
    actualizarEstado: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado } = req.body;

            const opcionesValidadas = ['pendiente','confirmada','completada', 'cancelada'];
            if (!estado || !opcionesValidadas.includes(estado.toLowerCase().trim())) {
                return res.status(400).json({
                    error: "Estado no válido",
                    opciones: opcionesValidadas
                });
            }
            
            await Cita.actualizarEstado(id, estado.toLowerCase().trim());
            res.json({ message: "Estado de la cita actualizado exitosamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el estado: " + error.message });
        }
    },
    //asignar veterinario a cita
    asignarVeterinario: async (req, res) => {
        try {
            const { id } = req.params;
            const { veterinario_id } = req.body;

            if (!veterinario_id) {
                return res.status(400).json({ error: "Veterinario ID requerido" });
            }

            const cita = await Cita.getById(id);
            if (!cita) {
                return res.status(404).json({ error: "Cita no encontrada" });
            }

            await Cita.asignarVeterinario(id, veterinario_id);
            res.json({ message: "Veterinario asignado exitosamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al asignar veterinario: " + error.message });
        }
    },
    //eliminar cita
    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const cita = await Cita.getById(id);

            if (!cita) {
                return res.status(404).json({ error: "Cita no encontrada" });
            }

            await Cita.eliminar(id);
            res.json({ message: "Cita eliminada exitosamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar la cita: " + error.message });
        }
    }
};

module.exports = citaController;