const db = require('../config/db');

const Vacuna = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT v.*, m.nombre AS nombre_mascota, ve.nombre AS veterinario_nombre
            FROM vacunas v
            LEFT JOIN mascotas m ON v.mascota_id = m.id
            LEFT JOIN usuarios ve ON v.veterinario_id = ve.id
            ORDER BY v.fecha_aplicacion DESC
        `);
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT v.*, m.nombre AS nombre_mascota, ve.nombre AS veterinario_nombre
            FROM vacunas v
            LEFT JOIN mascotas m ON v.mascota_id = m.id
            LEFT JOIN usuarios ve ON v.veterinario_id = ve.id
            WHERE v.id = ?
        `, [id]);
        return rows[0];
    },
    getByMascotaId: async (mascotaId) => {
        const [rows] = await db.query(`
            SELECT v.*, ve.nombre AS veterinario_nombre
            FROM vacunas v
            LEFT JOIN usuarios ve ON v.veterinario_id = ve.id
            WHERE v.mascota_id = ?
            ORDER BY v.fecha_aplicacion DESC
        `, [mascotaId]);
        return rows;
    },
    getProximasDosis: async () => {
        const [rows] = await db.query(`
            SELECT v.*, m.nombre AS nombre_mascota, m.user_id, u.email, u.telefono
            FROM vacunas v
            LEFT JOIN mascotas m ON v.mascota_id = m.id
            LEFT JOIN usuarios u ON m.user_id = u.id
            WHERE v.proxima_dosis IS NOT NULL 
            AND v.proxima_dosis <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
            AND v.proxima_dosis >= CURDATE()
            ORDER BY v.proxima_dosis ASC
        `);
        return rows;
    },
    crear: async (data) => {
        const { mascota_id, nombre, fecha_aplicacion, proxima_dosis, veterinario_id, observaciones } = data;
        const [result] = await db.execute(`
            INSERT INTO vacunas (mascota_id, nombre, fecha_aplicacion, proxima_dosis, veterinario_id, observaciones)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [mascota_id, nombre, fecha_aplicacion, proxima_dosis || null, veterinario_id, observaciones]);
        return result.insertId;
    },
    actualizar: async (id, data) => {
        const { nombre, fecha_aplicacion, proxima_dosis, veterinario_id, observaciones } = data;
        await db.execute(`
            UPDATE vacunas
            SET nombre = ?, fecha_aplicacion = ?, proxima_dosis = ?, veterinario_id = ?, observaciones = ?
            WHERE id = ?
        `, [nombre, fecha_aplicacion, proxima_dosis, veterinario_id, observaciones, id]);
    },
    eliminar: async (id) => {
        await db.query('DELETE FROM vacunas WHERE id = ?', [id]);
    }
};

module.exports = Vacuna;
