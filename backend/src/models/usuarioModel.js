const db = require('../config/db');

const Usuario = {
    crear: async (nombre, email, password, rol) => {
        const query = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
        const [result] = await db.execute(query, [nombre, email, password, rol]);
        return result;
    },
    buscarPorEmail: async (email) => {
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    },
    buscarPorId: async (id) => {
        const query = 'SELECT id, nombre, email, rol FROM usuarios WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }
};

module.exports = Usuario;