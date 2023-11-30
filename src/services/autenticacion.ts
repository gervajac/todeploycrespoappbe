import { error } from "jquery";
import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Usuario from "../models/usuario";
import { sendActivateEmailToken } from "../utils/nodemailer";
import { generateEmailToken } from "../utils/generetTokenIdUsername";
import Admin from "../models/admin";

const bcrypt = require("bcrypt");
dotenv.config();
const router = express.Router();

const newUser = async (req: Request, res: Response) => {
    try {
        const repeatAdmin = await Usuario.query("entidad")
            .eq("admin")
            .where("username")
            .eq(req.body.username)
            .exec();
        if (repeatAdmin.count !== 0) {
            return res.status(409).json({ msg: "El usuario ya existe." });
        }
        const repeatUser = await Usuario.query("entidad")
            .eq("usuario")
            .where("username")
            .eq(req.body.username)
            .exec();
        if (repeatUser.count !== 0) {
            return res.status(409).json({ msg: "El usuario ya existe." });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const usuario = await Usuario.create({
            ...req.body,
            password: hashedPassword,
        });

        const activationToken = generateEmailToken(usuario);

        sendActivateEmailToken(usuario.username, activationToken);

        res.status(200).json({ data: usuario, msg: "Usuario creado." });
    } catch (error: any) {
        if (error instanceof Error) {
            res.status(400).json({ msg: error.message });
        } else {
            res.status(500).json({
                msg: "Ha ocurrido un error interno.",
            });
        }
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.query("entidad")
            .eq("admin")
            .where("username")
            .eq(username)
            .exec();

        if (admin.count !== 0) {
            const isAdminPasswordValid = await bcrypt.compare(
                password,
                admin[0].password
            );
            if (isAdminPasswordValid) {
                const token = jwt.sign(
                    {
                        id: admin[0].id,
                        username: admin[0].username,
                        rol: admin[0].rol,
                        areas: admin[0].areas,
                    },
                    process.env.JWT_SECRET!,
                    {
                        expiresIn: "4h",
                    }
                );

                res.status(200).json({
                    usuario: admin[0],
                    tokenAcceso: token,
                    timestamp: new Date(),
                });
            } else {
                res.status(401).json({ msg: "Contraseña incorrecta." });
            }
        } else {
            console.log("username", username);
            const user = await Usuario.query("entidad")
                .eq("usuario")
                .where("username")
                .eq(username)
                .exec();
            console.log("user", user);
            if (user.count !== 0) {
                const isUserPasswordValid = await bcrypt.compare(
                    password,
                    user[0].password
                );
                if (isUserPasswordValid) {
                    const token = jwt.sign(
                        {
                            id: user[0].id,
                            username: user[0].username,
                            rol: user[0].rol,
                        },
                        process.env.JWT_SECRET!,
                        {
                            expiresIn: "4h",
                        }
                    );

                    res.status(200).json({
                        usuario: user[0],
                        tokenAcceso: token,
                        timestamp: new Date(),
                    });
                } else {
                    res.status(401).json({ msg: "Contraseña incorrecta." });
                }
            } else {
                res.status(401).json({ msg: "El usuario no existe." });
            }
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ msg: error.message });
    }
};

export { newUser, login };
