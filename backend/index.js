const express = require('express');
const cors = require('cors');
const db = require('./src/config/db');
const app = express();
const PORT = process.env.PORT || 3000;

//rutas

const Mascota = require('./src/models/mascotaModel');
const Usuario = require('./src/models/usuarioModel');
const cita = require('./src/models/citasModel');

app.use(cors());
app.use(express.json());
// Verificar la conexión a la base de datos antes de iniciar el servidor
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ message: "Conexión a la base de datos exitosa", data: rows});
    } catch (error){
        res.status(500).json({ message: "Error al conectar a la base de datos", error: error.message });
    }
});

app.post('/usuarios', async (req, res) => {
    const { nombre, email, password, rol } = req.body;
    try {
        const id = await Usuario.crear(nombre, email, password, rol);
        res.status(201).json({ message: "Usuario creado exitosamente", id });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el usuario", error: error.message });
    }
});

app.get('/mascotas', async (req, res)=>{
    try {
        const mascotas = await mascota.getAll();
        res.json(mascotas);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

//obtener todas las citas
app.get('/citas', async (req, res) => {
    try {
        const citas = await cita.getAll();
        res.json(citas);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

//Agendar Cita
app.post('/citas', async (req, res) => {
    try {
        const id = await cita.crear(req.body);
        res.status(201).json({ message: "Cita creada exitosamente", id });
    } catch (error) {
        res.status(500).json({ message: "Error al crear la cita", error: error.message });
    }
});

app.listen(PORT, () =>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});