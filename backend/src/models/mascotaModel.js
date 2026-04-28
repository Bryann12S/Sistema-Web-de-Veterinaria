const db = require('../config/db');

const Mascota = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM mascotas');
        return rows;
    },
    getByUser: async (userId) => {
        const [rows] = await db.query('SELECT * FROM mascotas WHERE user_id = ?', [userId]);
        return rows;
    }
};
module.exports = Mascota;