const db = require('../config/db');

const Mascota = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT m.*, u.nombre AS duenio_nombre, u.apellidos AS duenio_apellidos, u.email AS duenio_email, u.telefono 
            FROM mascotas m 
            JOIN usuarios u ON m.user_id = u.id
            WHERE m.user_id IS NOT NULL
        `);
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query(`
            SELECT m.*, u.nombre AS duenio_nombre, u.apellidos AS duenio_apellidos, u.email AS duenio_email 
            FROM mascotas m 
            LEFT JOIN usuarios u ON m.user_id = u.id 
            WHERE m.id = ?
        `, [id]);
        return rows[0];
    },
    getByUser: async (userId) => {
        const [rows] = await db.query('SELECT * FROM mascotas WHERE user_id = ?', [userId]);
        return rows;
    },
    crear: async (data) => {
        const { nombre, especie, raza, sexo, color, peso, fecha_nacimiento, esterilizado, foto, user_id } = data;
        const [result] = await db.query(`
            INSERT INTO mascotas 
            (nombre, especie, raza, sexo, color, peso, fecha_nacimiento, esterilizado, foto, user_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [nombre, especie, raza, sexo, color, peso, fecha_nacimiento, esterilizado, foto, user_id]);
        return result.insertId;
    },
    actualizar: async (id, data) => {
        const { nombre, especie, raza, sexo, color, peso, fecha_nacimiento, esterilizado, foto, user_id, estado } = data;
        await db.query(`
            UPDATE mascotas 
            SET nombre = ?, especie = ?, raza = ?, sexo = ?, color = ?, peso = ?, fecha_nacimiento = ?, esterilizado = ?, foto = ?, user_id = ?, estado = ? 
            WHERE id = ?
        `, [nombre, especie, raza, sexo, color, peso, fecha_nacimiento, esterilizado, foto, user_id, estado, id]);
    },
    eliminar: async (id) => {
        await db.query('UPDATE mascotas SET estado = "inactiva" WHERE id = ?', [id]);
    }
};
module.exports = Mascota;