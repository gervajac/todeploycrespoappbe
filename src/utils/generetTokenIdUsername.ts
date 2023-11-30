import jwt from "jsonwebtoken";
import { IUsuario } from "../interfaces/usuario";
import Usuario from "../models/usuario";
import { Request, Response } from "express";

const generateEmailToken = (user: IUsuario) => {
    const { id, username } = user;
    const token = jwt.sign(
        {
            id: id,
            username,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
    );
    return token;
};

const verifyAndActivateUser = async (token: any) => {
    console.log(token);
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
        console.log(decodedToken);
        if (!decodedToken || typeof decodedToken !== "object") {
            throw new Error("Token de activación inválido.");
        }

        const userId = decodedToken.id;
        const username = decodedToken.username;
        console.log("UserID antes de activación:", userId);
        const user = await Usuario.get({ entidad: "usuario", id: userId });
        console.log(user);

        if (!user || user.username !== username || user.activo) {
            throw new Error("No se pudo activar al usuario.");
        }

        user.activo = true;
        //@ts-ignore
        user.url_token = "";
        await user.save();

        return true;
    } catch (error) {
        console.error("Error al activar el usuario:", error);
        return false;
    }
};

const activateAccount = async (req: Request, res: Response) => {
    const { token } = req.params;
    console.log(req.query);

    const activationResult = await verifyAndActivateUser(token);

    if (activationResult) {
        res.status(200).json({ data: true, msg: "Cuenta activada con éxito" });
    } else {
        res.status(200).json({
            data: false,
            msg: "Error al activar la cuenta.",
        });
    }
};

export { generateEmailToken, verifyAndActivateUser, activateAccount };
