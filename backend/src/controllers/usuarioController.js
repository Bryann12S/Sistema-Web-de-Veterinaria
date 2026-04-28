const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usuarioController = {
    //registro
    crear: async (req, res) => {
        try{
            const { nombre, email, password, rol } = req.body;

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const id = await Usuario.crear(nombre, email, hashedPassword, rol);
            res.status(201).json({ message: "Usuario creado exitosamente", id });
        } catch (error) {
            res.status(500).json({ error:"Error al crear el usuario" + error.message });
        }
    },
    //login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const usuario = await Usuario.buscarPorEmail(email);
            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            const passwordMatch = await bcrypt.compare(password, usuario.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: "Contraseña incorrecta" });
            }

            //usar jwt para generar un token de autenticación
            if(passwordMatch){
                const token = jwt.sign(
                    { id: usuario.id, rol: usuario.rol },  //payload del token
                      process.env.JWT_SECRET,  //clave secreta para firmar el token
                      { expiresIn: '1h' } //timepo de expiración del token
                    );

                res.json({ message: "Login exitoso", token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
            }
        } catch (error) {
            res.status(500).json({ error: "Error al iniciar sesión" + error.message });
        }       
    }
};

module.exports = usuarioController;