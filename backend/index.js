const express = require('express');
const db = require('./src/config/db');
const app = express();
const PORT = process.env.PORT || 3000;

// Verificar la conexión a la base de datos antes de iniciar el servidor
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ message: "Conexión a la base de datos exitosa", data: rows});
    } catch (error){
        res.status(500).json({ message: "Error al conectar a la base de datos", error: error.message });
    }
});

app.listen(PORT, () =>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});