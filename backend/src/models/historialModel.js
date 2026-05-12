const db = require('../config/db');

const Historial = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT h.*, m.nombre AS nombre_mascota, v.nombre AS veterinario_nombre, c.fecha AS cita_fecha
            FROM historial_medico h
            LEFT JOIN mascotas m ON h.mascota_id = m.id
            LEFT JOIN usuarios v ON h.veterinario_id = v.id
            LEFT JOIN citas c ON h.cita_id = c.id
            ORDER BY h.fecha DESC
        `);
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT h.*, m.nombre AS nombre_mascota, v.nombre AS veterinario_nombre, c.fecha AS cita_fecha
            FROM historial_medico h
            LEFT JOIN mascotas m ON h.mascota_id = m.id
            LEFT JOIN usuarios v ON h.veterinario_id = v.id
            LEFT JOIN citas c ON h.cita_id = c.id
            WHERE h.id = ?
        `, [id]);
        return rows[0];
    },
    getByMascotaId: async (mascotaId) => {
        const [rows] = await db.query(`
            SELECT h.*, v.nombre AS veterinario_nombre, c.fecha AS cita_fecha
            FROM historial_medico h
            LEFT JOIN usuarios v ON h.veterinario_id = v.id
            LEFT JOIN citas c ON h.cita_id = c.id
            WHERE h.mascota_id = ?
            ORDER BY h.fecha DESC
        `, [mascotaId]);
        return rows;
    },
    getByVeterinario: async (veterinarioId) => {
        const [rows] = await db.query(`
            SELECT h.*, m.nombre AS nombre_mascota, c.fecha AS cita_fecha
            FROM historial_medico h
            LEFT JOIN mascotas m ON h.mascota_id = m.id
            LEFT JOIN citas c ON h.cita_id = c.id
            WHERE h.veterinario_id = ?
            ORDER BY h.fecha DESC
        `, [veterinarioId]);
        return rows;
    },
    crear: async (data) => {
        const { mascota_id, veterinario_id, cita_id, diagnostico, peso, temperatura, tratamiento, notas, proxima_visita } = data;
        const [result] = await db.execute(`
            INSERT INTO historial_medico 
            (mascota_id, veterinario_id, cita_id, diagnostico, peso, temperatura, tratamiento, notas, proxima_visita)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [mascota_id, veterinario_id, cita_id || null, diagnostico, peso, temperatura, tratamiento, notas, proxima_visita]);
        return result.insertId;
    },
    actualizar: async (id, data) => {
        const { diagnostico, peso, temperatura, tratamiento, notas, proxima_visita } = data;
        await db.execute(`
            UPDATE historial_medico 
            SET diagnostico = ?, peso = ?, temperatura = ?, tratamiento = ?, notas = ?, proxima_visita = ?
            WHERE id = ?
        `, [diagnostico, peso, temperatura, tratamiento, notas, proxima_visita, id]);
    },
    eliminar: async (id) => {
        await db.query('DELETE FROM historial_medico WHERE id = ?', [id]);
    },
    getDuenio: async (mascotaId) => {
        const [rows] = await db.query(`
            SELECT user_id FROM mascotas WHERE id = ?
        `, [mascotaId]);
        return rows[0];
    }
};

module.exports = Historial;