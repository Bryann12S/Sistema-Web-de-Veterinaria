const Cita = require('../models/citaModel');

const citaController = {
    //obtener todas las citas
    listar: async (req, res) => {
        try {
            const {id, rol} = req.user; // Obtener el ID y rol del usuario desde el token
            let citas;
            if (rol === "admin" || rol === "veterinario"){
                citas = await Cita.getAll(); // Si es admin o veterinario, obtiene todas las citas 
            } else{
                citas = await Cita.getByUser(id); // Si no es admin, obtiene solo las citas del usuario
            }
            res.json(citas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    //agendar cita
    crear: async (req, res) => {
        try {
            const {tipo_consulta} = req.body;
            
            const tiposPermitidos = [
                'General', 'Vacunación', 'Desparasitación', 
                'Cirugía', 'Urgencia', 'Estética', 'Control'
            ];

            if (tipo_consulta && !tiposPermitidos.includes(tipo_consulta)) {
                return res.status(400).json({
                    message: "Tipo de consulta no válido",
                    opciones: tiposPermitidos
                });
            }
            const id = await Cita.crear(req.body);
            res.status(201).json({ message: "Cita creada exitosamente", id });
        } catch (error) {
            res.status(500).json({ message: "Error al crear la cita", error: error.message });
        }
    },
    //actualizar estado de la cita (confirmar o cancelar)
    actualizarEstado: async (req, res) => {
        try {
            const id = req.params.id;
            const { estado } = req.body;

            //evitar esatdo que no existen en la BD
            const opcionesValidadas = ['pendiente','confirmada','completada', 'cancelada'];
            if (!estado || !opcionesValidadas.includes(estado.toLowerCase().trim())) {
                return res.status(400).json({
                    message:"Estado no válido",
                    opciones: opcionesValidadas
                })
            }
            
            await Cita.actualizarEstado(id, estado.toLowerCase().trim());

            res.json({ message: "Estado de la cita actualizado exitosamente" });
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el estado de la cita", error: error.message });
        }
    }
};

module.exports = citaController;