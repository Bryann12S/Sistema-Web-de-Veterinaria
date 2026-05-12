const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usuarioController = {
    //registro de cliente
    registrarCliente: async (req, res) => {
        try{
            const { nombre, apellidos, email, password, cedula, telefono, provincia, canton, ciudad, comunidad, direccion } = req.body;
            
            if (!nombre || !email || !password || !apellidos) {
                return res.status(400).json({ error: "Nombre, apellidos, email y contraseña son obligatorios" });
            }

            // Verificar si el email ya existe
            const usuarioExistente = await Usuario.buscarPorEmail(email);
            if (usuarioExistente) {
                return res.status(400).json({ error: "El email ya está registrado" });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            //Rol cliente por defecto
            const result = await Usuario.crear({
                nombre,
                apellidos,
                email,
                password: hashedPassword,
                rol: 'cliente',
                cedula,
                telefono,
                provincia,
                canton,
                ciudad,
                comunidad,
                direccion
            });
            res.status(201).json({ message: "Registro exitoso", id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: "Error al crear el usuario: " + error.message });
        }
    },
    //crear personal (admin y veterinarios)
    crearPersonal: async (req, res) => {
        try{
            const { nombre, apellidos, email, password, rol, cedula, telefono, provincia, canton, ciudad, comunidad, direccion } = req.body;

            if (!nombre || !email || !password || !rol || !apellidos) {
                return res.status(400).json({ error: "Nombre, apellidos, email, contraseña y rol son obligatorios" });
            }
            
            const rolesPermitidos = ['admin', 'veterinario'];

            if (!rolesPermitidos.includes(rol)) {
                return res.status(400).json({ error: "Rol no permitido. Solo se permiten 'admin' o 'veterinario'" });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const result = await Usuario.crear({
                nombre,
                apellidos,
                email,
                password: hashedPassword,
                rol,
                cedula,
                telefono,
                provincia,
                canton,
                ciudad,
                comunidad,
                direccion
            });
            res.status(201).json({ message: "Personal " + rol + " creado exitosamente", id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: "Error al crear el usuario: " + error.message });
        }
    },
    //login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ error: "Email y contraseña requeridos" });
            }

            const usuario = await Usuario.buscarPorEmail(email);

            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            if (usuario.estado === 'inactivo' || usuario.estado === 'suspendido') {
                return res.status(403).json({ error: "Usuario inactivo o suspendido" });
            }

            const passwordMatch = await bcrypt.compare(password, usuario.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: "Contraseña incorrecta" });
            }

            const token = jwt.sign(
                    { id: usuario.id, rol: usuario.rol },
                      process.env.JWT_SECRET,
                      { expiresIn: '24h' }
            );

            res.json({ 
                message: "Login exitoso", 
                token, 
                usuario: { 
                    id: usuario.id, 
                    nombre: usuario.nombre, 
                    apellidos: usuario.apellidos,
                    email: usuario.email,
                    rol: usuario.rol 
                } 
            });

        } catch (error) {
            res.status(500).json({ error: "Error al iniciar sesión: " + error.message });
        }       
    },
    //obtener perfil del usuario autenticado
    obtenerPerfil: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: "Usuario no autenticado" });
            }

            const usuario = await Usuario.buscarPorId(req.user.id);

            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.json(usuario);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el perfil: " + error.message });
        }
    },
    //obtener todos los usuarios (solo admin)
    obtenerTodos: async (req, res) => {
        try {
            const usuarios = await Usuario.getAll();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener usuarios: " + error.message });
        }
    },
    //obtener lista de veterinarios
    obtenerVeterinarios: async (req, res) => {
        try {
            const veterinarios = await Usuario.getVeterinarios();
            res.json(veterinarios);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener veterinarios: " + error.message });
        }
    },
    //actualizar perfil del usuario
    actualizarPerfil: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: "Usuario no autenticado" });
            }

            const { nombre, apellidos, cedula, telefono, provincia, canton, ciudad, comunidad, direccion, foto } = req.body;

            const usuario = await Usuario.buscarPorId(req.user.id);
            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            // Solo permitir actualizar la cédula si aún no tiene una
            let cedulaAActualizar = usuario.cedula;
            if (!usuario.cedula && req.body.cedula) {
                cedulaAActualizar = req.body.cedula;
            }

            await Usuario.actualizar(req.user.id, {
                nombre: nombre || usuario.nombre,
                apellidos: apellidos || usuario.apellidos,
                cedula: cedulaAActualizar,
                telefono: telefono || usuario.telefono,
                provincia: provincia || usuario.provincia,
                canton: canton || usuario.canton,
                ciudad: ciudad || usuario.ciudad,
                comunidad: comunidad || usuario.comunidad,
                direccion: direccion || usuario.direccion,
                foto: foto !== undefined ? foto : usuario.foto
            });

            res.json({ message: "Perfil actualizado exitosamente" });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "La cédula o el email ya están en uso por otro usuario." });
            }
            res.status(500).json({ error: "Error al actualizar el perfil: " + error.message });
        }
    },
    //cambiar estado de usuario (solo admin)
    cambiarEstado: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado } = req.body;

            const estadosPermitidos = ['activo', 'inactivo', 'suspendido'];
            if (!estadosPermitidos.includes(estado)) {
                return res.status(400).json({ error: "El estado debe ser activo, inactivo o suspendido" });
            }

            const usuario = await Usuario.buscarPorId(id);
            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            await Usuario.cambiarEstado(id, estado);
            res.json({ message: "Estado del usuario actualizado exitosamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al cambiar el estado: " + error.message });
        }
    },
    //actualizar rol de usuario (solo admin)
    actualizarRol: async (req, res) => {
        try {
            const { id } = req.params;
            const { rol } = req.body;

            const rolesPermitidos = ['cliente', 'veterinario', 'admin'];
            if (!rolesPermitidos.includes(rol)) {
                return res.status(400).json({ error: "Rol no válido" });
            }

            const usuario = await Usuario.buscarPorId(id);
            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            await Usuario.actualizarRol(id, rol);
            res.json({ message: "Rol actualizado exitosamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar el rol: " + error.message });
        }
    }
};

module.exports = usuarioController;