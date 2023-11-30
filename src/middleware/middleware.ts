import { error } from "jquery";
import jwt from "jsonwebtoken";

const checkAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = req.headers.authorization.split(" ").pop();
        const dataToken: any = await jwt.verify(token, process.env.JWT_SECRET!);

        if (dataToken.id) {
            req.body.user_rol = dataToken.rol;
            dataToken.areas
                ? (req.body.user_areas = dataToken.areas)
                : undefined;
            req.body.id_usuario = {
                id: dataToken.id,
                username: dataToken.username,
            };
            next();
        } else {
            res.status(401).json({ msg: "Token inválido." });
        }
    } else {
        res.status(403).json({ msg: "Sesión inválida." });
    }
};

const checkRol = (roles) => (req, res, next) => {
    try {
        const rolesByUser = req.body.user_rol;

        const checkValueRol = roles.some((rolSingle) =>
            rolesByUser.includes(rolSingle)
        );
        if (!checkValueRol) {
            res.status(403).json({ msg: "No autorizado." });
            return;
        }
        next();
    } catch (e) {
        res.status(404).json({ msg: "Error interno." });
    }
};

export { checkAuth, checkRol };
