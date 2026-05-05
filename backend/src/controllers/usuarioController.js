const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usuarioController = {
    //registro
    registrarCliente: async (req, res) => {
        try{
            const { nombre, email, password} = req.body;
            
            if (!nombre || !email || !password) {
                return res.status(400).json({ error: "Todos los campos son obligatorios" });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            //Rol cliente por defecto
            const result = await Usuario.crear(nombre, email, hashedPassword, 'cliente');
            res.status(201).json({ message: "Registro exitoso", id: result.insertId });
        } catch (error) {
            res.status(500).json({ error:"Error al crear el usuario" + error.message });
        }
    },
    crearPersonal: async (req, res) => {
        try{
            const { nombre, email, password, rol } = req.body;

            if (!nombre || !email || !password || !rol) {
                return res.status(400).json({ error: "Todos los campos son obligatorios" });
            }
            
            const rolesPermitidos = ['admin', 'veterinario'];

            if (!rolesPermitidos.includes(rol)) {
                return res.status(400).json({ error: "Rol no permitido. Solo se permiten 'admin' o 'veterinario'" });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const result = await Usuario.crear(nombre, email, hashedPassword, rol);
            res.status(201).json({ message: "Personal " + rol + " creado exitosamente", id: result.insertId });
        } catch (error) {
            res.status(500).json({ error:"Error al crear el usuario" + error.message });
        }
    }        
    ,
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

            const passwordMatch = await bcrypt.compare(password, usuario.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: "Contraseña incorrecta" });
            }

            //usar jwt para generar un token de autenticación
            if(!passwordMatch){
                return res.status(401).json({ error: "Contraseña incorrecta" });
            }

            const token = jwt.sign(
                    { id: usuario.id, rol: usuario.rol },  //payload del token
                      process.env.JWT_SECRET,  //clave secreta para firmar el token
                      { expiresIn: '1h' } //timepo de expiración del token
            );

            res.json({ message: "Login exitoso", token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });

        } catch (error) {
            res.status(500).json({ error: "Error al iniciar sesión" + error.message });
        }       
    },
    obtenerPerfil: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: "Usuario no autenticado" });
            }

            const usuario = await Usuario.buscarPorId(req.user.id);

            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            //const { password, ...datosPublicos } = usuario;
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el perfil", detalle: process.env.NODE_ENV === 'development' ? error.message : undefined });
        }
    }   
};

module.exports = usuarioController;