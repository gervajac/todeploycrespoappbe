import jwt from "jsonwebtoken";
import Usuario from "../models/usuario";
import { Request, Response } from "express";
import { sendRestorePasswordToken } from "../utils/nodemailer";
import { generateEmailToken } from "../utils/generetTokenIdUsername";
import bcrypt from "bcrypt";

const verifyAndRestorePassword = async (token: any) => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
        if (!decodedToken || typeof decodedToken !== "object") {
            throw new Error("Token de restauración de contraseña inválido.");
        }
        const userId = decodedToken.id;
        const user = await Usuario.get({
            entidad: "usuario",
            id: userId,
        });
        if (!user) {
            throw new Error("Usuario no encontrado.");
        }
        if (user.url_token === token) {
            return user;
        } else {
            return undefined;
        }
    } catch (error) {
        console.error("Error al restaurar la contraseña", error);
        return false;
    }
};

const requestPasswordRestore = async (req, res) => {
    const username = req.body.username;
    try {
        const user = await Usuario.query("entidad")
            .eq("usuario")
            .where("username")
            .eq(username)
            .exec();
        console.log(username);
        if (user.count === 0) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        } else {
            const userFound = user[0];
            if (userFound.activo) {
                const token = generateEmailToken(userFound);
                userFound.url_token = token;
                sendRestorePasswordToken(username, token);
                await userFound.save();
                res.status(200).json({
                    msg: `Correo enviado correctamente a ${user}`,
                });
            } else {
                const activationToken = generateEmailToken(userFound);
                userFound.url_token = activationToken;
                await userFound.save();
                sendRestorePasswordToken(username, activationToken);
                res.status(200).json({
                    msg: `Correo enviado correctamente para activar la cuenta de ${userFound.username}`,
                });
            }
        }
    } catch (error) {
        console.error("Error al restablecer la contraseña:", error);
        res.status(500).json({ msg: "Error al restablecer la contraseña" });
    }
};

const retorePassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const user = await verifyAndRestorePassword(token);

    if (user) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            user.password = hashedPassword;
            user.url_token = "";
            await user.save();
            res.status(200).json({
                msg: "Contraseña actualizada.",
            });
        } catch (error) {
            return res.status(400).json({ msg: error });
        }
    } else {
        res.status(400).json({
            msg: "Error al actualizar la contraseña, token no valido",
        });
    }
};
export { verifyAndRestorePassword, requestPasswordRestore, retorePassword };
