import { area } from "./../../DOCUMENTACION";
import express from "express";
import { Response, Request } from "express";
import dotenv from "dotenv";
import Admin from "../models/admin";
import Area from "../models/area";
dotenv.config();
const bcrypt = require("bcrypt");

const router = express.Router();

const createAdmin = async (req: Request, res: Response) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const admin = await Admin.create({
            ...req.body,
            password: hashedPassword,
        });

        res.status(200).json({ data: admin, msg: "Administrador creado." });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ msg: error.msg });
    }
};

const getActiveAdmins = async (req: Request, res: Response) => {
    try {
        const findedAdmins = await Admin.query("entidad")
            .eq("admin")
            .where("activo")
            .eq(true)
            .exec();

        const obtenerNombresDeAreas = async (areasIds: string[]) => {
            const nombresDeAreas: string[] = [];

            for (const id of areasIds) {
                const area = await Area.get({
                    entidad: "area",
                    id: id,
                });

                if (area && area.nombre) {
                    nombresDeAreas.push(area.nombre);
                }
            }

            return nombresDeAreas;
        };

        const nombresDeAreasPromises = findedAdmins.map((admin) =>
            obtenerNombresDeAreas(admin.areas)
        );
        const nombresDeAreasResult = await Promise.all(nombresDeAreasPromises);

        const respuesta = findedAdmins.map((admin, index) => ({
            ...admin,
            areas: nombresDeAreasResult[index],
        }));

        res.status(200).json({
            data: respuesta,
            msg: "Administradores obtenidos correctamente.",
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.msg });
    }
};

const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const findedAdmins = await Admin.query("entidad").eq("admin").exec();

        const obtenerNombresDeAreas = async (areasIds: string[]) => {
            const nombresDeAreas: string[] = [];

            for (const id of areasIds) {
                const area = await Area.get({
                    entidad: "area",
                    id: id,
                });

                if (area && area.nombre) {
                    nombresDeAreas.push(area.nombre);
                }
            }

            return nombresDeAreas;
        };

        const nombresDeAreasPromises = findedAdmins.map((admin) =>
            obtenerNombresDeAreas(admin.areas)
        );
        const nombresDeAreasResult = await Promise.all(nombresDeAreasPromises);

        const respuesta = findedAdmins.map((admin, index) => ({
            ...admin,
            areas: nombresDeAreasResult[index],
        }));

        res.status(200).json({
            data: respuesta,
            msg: "Administradores obtenidos correctamente.",
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.msg });
    }
};

const getAdmin = async (req: Request, res: Response) => {
    try {
        const admin = await Admin.get({
            entidad: "admin",
            id: req.params.id,
        });

        if (!admin) {
            return res
                .status(404)
                .json({ msg: "Administrador no encontrado." });
        }
        const areasPromises = admin.areas.map(async (areaId) => {
            const area = await Area.get({ entidad: "area", id: areaId });
            return area ? area.nombre : null;
        });
        const areaNames = await Promise.all(areasPromises);

        const adminWithoutPassword = {
            ...admin,
            password: undefined,
            areas: areaNames.filter(Boolean),
        };

        res.status(200).json({ data: adminWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

const updatedadmin = async (req: Request, res: Response) => {
    try {
        const updatedadmin = await Admin.update(
            {
                entidad: "admin",
                id: req.params.id,
            },
            req.body,
            { returnValues: "UPDATED_NEW" }
        );
        if (!updatedadmin) {
            return res.status(400).json({ msg: "Administrador no encontrado" });
        }
        res.status(200).json({
            data: updatedadmin,
            msg: "Administrador actualizado.",
        });
    } catch (error) {
        return res.status(400).json({ msg: Error });
    }
};

const disableAdmin = async (req: Request, res: Response) => {
    try {
        const disabledAdmin = await Admin.update(
            {
                entidad: "admin",
                id: req.params.id,
            },
            { activo: false },
            { returnValues: "UPDATED_NEW" }
        );
        if (!disabledAdmin) {
            return res.status(404).json({ msg: "Administrador no encontrado" });
        }
        res.status(200).json({
            data: disabledAdmin,
            msg: "Administrador deshabilitado.",
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Error al deshabilitar el administrador",
            error: error,
        });
    }
};

const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const deledAdmin = await Admin.get({
            entidad: "admin",
            id: req.params.id,
        });
        if (!deledAdmin) {
            return res.status(404).json({ msg: "Administrador no encontrado" });
        }
        if (deledAdmin.activo != false) {
            return res.status(404).json({
                msg: "Administrador no puede ser eliminado, primero debe ser deshabilitado.",
            });
        }

        await Admin.delete({ entidad: "admin", id: req.params.id });
        return res
            .status(200)
            .json({ msg: "Administrador eliminado exitosamente." });
    } catch (error) {
        return res
            .status(500)
            .json({ msg: "Error al eliminar el administrador", error: error });
    }
};

const activeAdmin = async (req: Request, res: Response) => {
    try {
        const activeAdmin = await Admin.update(
            {
                entidad: "admin",
                id: req.params.id,
            },
            { activo: true },
            { returnValues: "UPDATED_NEW" }
        );
        res.status(200).json({
            data: activeAdmin,
            msg: "Administrador restaurado.",
        });
    } catch (error) {
        return res.status(400).json({ msg: error });
    }
};

export {
    activeAdmin,
    createAdmin,
    deleteAdmin,
    disableAdmin,
    getAdmin,
    getActiveAdmins,
    getAllAdmins,
    updatedadmin,
};
