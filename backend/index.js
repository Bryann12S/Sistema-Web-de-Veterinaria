const express = require('express');
const cors = require('cors');
const db = require('./src/config/db');

//importar rutas 
const mascotaRoutes = require('./src/routes/mascotasRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const citaRoutes = require('./src/routes/citaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;


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

//middleware para rutas (predijo api para orden)
app.use('/api/mascotas', mascotaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/citas', citaRoutes);

app.listen(PORT, () =>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});