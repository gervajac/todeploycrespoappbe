import { nodemailer } from "nodemailer";
import express from "express";
import { Request, Response } from "express";
import UserSchema from "../models/usuario";

import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import transporter from "../utils/nodemailer";
import Usuario from "../models/usuario";
import Admin from "../models/admin";

dotenv.config();
const bcrypt = require("bcrypt");

const router = express.Router();

const updatedUser = async (req: Request, res: Response) => {
    try {
        const updatedUser = await Usuario.update(
            {
                entidad: "usuario",
                id: req.body.id_usuario.id,
            },
            req.body,
            { returnValues: "UPDATED_NEW" }
        );
        if (!updatedUser) {
            return res.status(400).json({ msg: "Usuario no encontrado" });
        }
        res.status(200).json({
            data: updatedUser,
            msg: "Usuario actualizado.",
        });
    } catch (error) {
        return res.status(400).json({ msg: Error });
    }
};
const getUser = async (req: Request, res: Response) => {
    try {
        const user = await Usuario.get({
            entidad: "usuario",
            id: req.body.id_usuario.id,
        });

        res.status(200).json({
            data: user,
            msg: "Usuario obtenido.",
        });
    } catch (error) {
        return res.status(400).json({ msg: Error });
    }
};

const changePassword = async (req: Request, res: Response) => {
    try {
        const password_actual = req.body.password_actual;
        const password_nueva = req.body.password_nueva;
        console.log("CONTRASEÑAS", password_actual, password_nueva);
        if (req.body.user_rol !== "CONTRIBUYENTE") {
            const admin = await Admin.get({
                entidad: "admin",
                id: req.body.id_usuario.id,
            });

            const isUserPasswordValid = await bcrypt.compare(
                password_actual,
                admin.password
            );
            if (!isUserPasswordValid) {
                res.status(404).json({ msg: "Contraseña incorrecta" });
            } else {
                const passwordHash = await bcrypt.hash(password_nueva, 10);
                admin.password = passwordHash;
                admin.save();
                res.status(200).json({ msg: "Contraseña actualizada" });
            }
        } else {
            const user = await Usuario.get({
                entidad: "usuario",
                id: req.body.id_usuario.id,
            });
            console.log("CONTRASEÑAS", user);

            const isUserPasswordValid = await bcrypt.compare(
                password_actual,
                user.password
            );
            console.log("HASSSSh", isUserPasswordValid);
            if (!isUserPasswordValid) {
                res.status(404).json({ msg: "Contraseña incorrecta" });
            } else {
                const passwordHash = await bcrypt.hash(password_nueva, 10);
                user.password = passwordHash;
                user.save();
                res.status(200).json({ msg: "Contraseña actualizada" });
            }
        }
    } catch (error: any) {
        res.status(500).json({ msg: error.msg });
    }
};

export { updatedUser, changePassword, getUser };
