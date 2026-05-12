const db = require('../config/db');

const Cita = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT c.*, m.nombre AS nombre_mascota, u.nombre AS duenio_nombre, v.nombre AS veterinario_nombre
            FROM citas c 
            JOIN mascotas m ON c.mascota_id = m.id
            LEFT JOIN usuarios u ON m.user_id = u.id
            LEFT JOIN usuarios v ON c.veterinario_id = v.id
            ORDER BY c.fecha DESC
        `);
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT c.*, m.nombre AS nombre_mascota, u.nombre AS duenio_nombre, v.nombre AS veterinario_nombre
            FROM citas c 
            JOIN mascotas m ON c.mascota_id = m.id
            LEFT JOIN usuarios u ON m.user_id = u.id
            LEFT JOIN usuarios v ON c.veterinario_id = v.id
            WHERE c.id = ?
        `, [id]);
        return rows[0];
    },
    getByUser: async (userId) => {
        const [rows] = await db.query(`
            SELECT c.*, m.nombre AS nombre_mascota, u.nombre AS duenio_nombre, v.nombre AS veterinario_nombre
            FROM citas c
            JOIN mascotas m ON c.mascota_id = m.id
            LEFT JOIN usuarios u ON m.user_id = u.id
            LEFT JOIN usuarios v ON c.veterinario_id = v.id
            WHERE m.user_id = ?
            ORDER BY c.fecha DESC
        `, [userId]);
        return rows;
    },
    getByVeterinario: async (veterinarioId) => {
        const [rows] = await db.query(`
            SELECT c.*, m.nombre AS nombre_mascota, u.nombre AS duenio_nombre
            FROM citas c
            JOIN mascotas m ON c.mascota_id = m.id
            LEFT JOIN usuarios u ON m.user_id = u.id
            WHERE c.veterinario_id = ?
            ORDER BY c.fecha DESC
        `, [veterinarioId]);
        return rows;
    },
    getByfecha: async (fecha) => {
        const [rows] = await db.query(`
            SELECT c.*, m.nombre AS nombre_mascota, u.nombre AS duenio_nombre, v.nombre AS veterinario_nombre
            FROM citas c
            JOIN mascotas m ON c.mascota_id = m.id
            LEFT JOIN usuarios u ON m.user_id = u.id
            LEFT JOIN usuarios v ON c.veterinario_id = v.id
            WHERE DATE(c.fecha) = ?
            ORDER BY c.hora
        `, [fecha]);
        return rows;
    },
    crear: async (data) => {
        const { fecha, hora, mascota_id, motivo, tipo_consulta, veterinario_id } = data;
        const [result] = await db.execute(`
            INSERT INTO citas (fecha, hora, mascota_id, motivo, tipo_consulta, veterinario_id) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [fecha, hora, mascota_id, motivo, tipo_consulta, veterinario_id || null]);
        return result.insertId;
    },
    actualizar: async (id, data) => {
        const { fecha, hora, mascota_id, motivo, tipo_consulta, veterinario_id } = data;
        await db.execute(`
            UPDATE citas 
            SET fecha = ?, hora = ?, mascota_id = ?, motivo = ?, tipo_consulta = ?, veterinario_id = ? 
            WHERE id = ?
        `, [fecha, hora, mascota_id, motivo, tipo_consulta, veterinario_id, id]);
    },
    actualizarEstado: async (id, estado) => {
        await db.query(`UPDATE citas SET estado = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [estado, id]);
    },
    asignarVeterinario: async (id, veterinario_id) => {
        await db.execute(`UPDATE citas SET veterinario_id = ? WHERE id = ?`, [veterinario_id, id]);
    },
    eliminar: async (id) => {
        await db.query('DELETE FROM citas WHERE id = ?', [id]);
    }
};

module.exports = Cita;