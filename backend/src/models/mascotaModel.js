const db = require('../config/db');

const Mascota = {
    getAll: async () => {
        //const [rows] = await db.query('SELECT * FROM mascotas');
        const [rows] = await db.query('SELECT m.*, u.nombre AS duenio_nombre FROM mascotas m JOIN usuarios u ON m.user_id = u.id');
        return rows;
    },
    getByUser: async (userId) => {
        const [rows] = await db.query('SELECT * FROM mascotas WHERE user_id = ?', [userId]);
        return rows;
    },
    crear: async (data) => {
        const { nombre, especie, raza, user_id } = data;
        const [result] = await db.query('INSERT INTO mascotas (nombre, especie, raza, user_id) VALUES (?, ?, ?, ?)', 
            [nombre, especie, raza, user_id]);
        return result.insertId;
    },
    actualizar: async (id, data) => {
        const { nombre, especie, raza, user_id } = data;
        await db.query('UPDATE mascotas SET nombre = ?, especie = ?, raza = ?, user_id = ? WHERE id = ?', 
            [nombre, especie, raza, user_id, id]);
    },
    eliminar: async (id) => {
        await db.query('DELETE FROM mascotas WHERE id = ?', [id]);
    }
};
module.exports = Mascota;