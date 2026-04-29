const authorize = (...rolesPermitidos) => {
    return (req, res, next)=> {
        // req.user existe gracias al middleware de autenticación que se ejecuta antes
     
        if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ error: "Acceso denegado: se requiere uno de estos roles: " + rolesPermitidos.join(", ") });
        }
        next(); // Si el rol es permitido, continuar con la siguiente función de middleware o ruta
    };
};

module.exports = { authorize };