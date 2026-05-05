const db = require('../config/db');

const Historial = {
    // Obtener historial por mascota
    getByMascotaId: async (mascotaId) => {
        const [rows] = await db.query(`
            SELECT 
                h.id,
                h.fecha,
                h.motivo,
                h.descripcion,
                h.tratamiento,
                h.observaciones,
                h.veterinario_id,
                c.fecha AS cita_fecha,
                c.hora AS cita_hora
            FROM historial_medico h
            LEFT JOIN citas c ON h.cita_id = c.id
            WHERE h.mascota_id = ?
            ORDER BY h.fecha DESC
        `, [mascotaId]);

        return rows;
    },
    // Crear historial
    crear: async (data) => {
        const { 
            mascota_id, 
            veterinario_id, 
            cita_id, 
            motivo, 
            descripcion, 
            tratamiento, 
            observaciones 
        } = data;

        const [result] = await db.execute(`
            INSERT INTO historial_medico 
            (mascota_id, veterinario_id, cita_id, motivo, descripcion, tratamiento, observaciones)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            mascota_id,
            veterinario_id,
            cita_id || null,
            motivo,
            descripcion,
            tratamiento,
            observaciones
        ]);

        return result.insertId;
    },
    // Obtener hitorial por dueño
    getDuenio: async (mascotaId) => {
        const [rows] = await db.query(`
            SELECT user_id FROM mascotas WHERE id = ?`, [mascotaId]
        );
        return rows[0];
    }
};

module.exports = Historial;