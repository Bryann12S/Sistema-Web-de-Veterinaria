const jwt = require('jsonwebtoken');

const verificacionToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado Authorization

    if (!token) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
        req.user = decoded; // Agregar la información del usuario al objeto de solicitud
        next(); // Continuar con la siguiente función de middleware o ruta
    } catch (error) {
        return res.status(401).json({ error: "Token inválido" });
    }
};

module.exports = { verificacionToken };