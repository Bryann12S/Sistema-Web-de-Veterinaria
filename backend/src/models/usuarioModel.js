const db = require('../config/db');

const Usuario = {
    crear: async (data) => {
        const { nombre, apellidos, cedula, email, password, rol, telefono, provincia, canton, ciudad, comunidad, direccion } = data;
        const query = `INSERT INTO usuarios 
                      (nombre, apellidos, cedula, email, password, rol, telefono, provincia, canton, ciudad, comunidad, direccion) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(query, 
            [nombre, apellidos, cedula, email, password, rol, telefono, provincia, canton, ciudad, comunidad, direccion]);
        return result;
    },
    buscarPorEmail: async (email) => {
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    },
    buscarPorId: async (id) => {
        const query = 'SELECT id, nombre, apellidos, cedula, email, rol, telefono, provincia, canton, ciudad, comunidad, direccion, estado, created_at FROM usuarios WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    },
    getAll: async () => {
        const query = 'SELECT id, nombre, apellidos, cedula, email, rol, telefono, provincia, canton, ciudad, comunidad, direccion, estado, created_at FROM usuarios WHERE estado = "activo"';
        const [rows] = await db.execute(query);
        return rows;
    },
    getVeterinarios: async () => {
        const query = 'SELECT id, nombre, apellidos, email, rol, telefono FROM usuarios WHERE rol = "veterinario" AND estado = "activo"';
        const [rows] = await db.execute(query);
        return rows;
    },
    actualizar: async (id, data) => {
        const { nombre, apellidos, cedula, telefono, provincia, canton, ciudad, comunidad, direccion } = data;
        const query = `UPDATE usuarios 
                      SET nombre = ?, apellidos = ?, cedula = ?, telefono = ?, provincia = ?, canton = ?, ciudad = ?, comunidad = ?, direccion = ? 
                      WHERE id = ?`;
        await db.execute(query, 
            [nombre, apellidos, cedula, telefono, provincia, canton, ciudad, comunidad, direccion, id]);
    },
    actualizarRol: async (id, rol) => {
        const query = 'UPDATE usuarios SET rol = ? WHERE id = ?';
        await db.execute(query, [rol, id]);
    },
    cambiarEstado: async (id, estado) => {
        const query = 'UPDATE usuarios SET estado = ? WHERE id = ?';
        await db.execute(query, [estado, id]);
    },
    eliminar: async (id) => {
        const query = 'UPDATE usuarios SET estado = "inactivo" WHERE id = ?';
        await db.execute(query, [id]);
    }
};

module.exports = Usuario;