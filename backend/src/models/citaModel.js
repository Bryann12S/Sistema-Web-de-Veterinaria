const db = require('../config/db');

const Cita = {
    //obtener todas la citas con el nombre de la mascota 
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT c.*, m.nombre AS nombre_mascota
            FROM citas c 
            JOIN mascotas m ON c.mascota_id = m.id`);
        return rows;
    },

    //crear nueva cita
    crear: async (data) => {
        const { fecha, hora, mascota_id, motivo } = data;
        const [result] = await db.execute(
            `INSERT INTO citas (fecha, hora, mascota_id, motivo) VALUES (?, ?, ?, ?)`,
            [fecha, hora, mascota_id, motivo]
        );
        return result.insertId;
    },
    // Cambiar estado (confirmar o cancelar)
    actualizarEstado: async (id, estado) => {
        await db.query(`UPDATE citas SET estado = ? WHERE id = ?`, [estado, id]);
    }
};

module.exports = Cita;