import { Response, Request } from "express";

import TipoReclamo from "../models/tipo_reclamo";

const createComplaint_type = async (req: Request, res: Response) => {
    try {
        const repeat = await TipoReclamo.query("entidad")
            .eq("tipo_reclamo")
            .where("nombre")
            .eq(req.body.nombre)
            .exec();
        if (repeat.count !== 0) {
            return res.status(409).json({ msg: "El nombre ya existe." });
        }

        const tipo_reclamo = await TipoReclamo.create(req.body);

        res.status(200).json({
            data: tipo_reclamo,
            msg: "Reclamo guardado.",
        });
    } catch (error) {
        res.status(400).json({ msg: error });
        console.log(error);
    }
};

const listActiveTypes = async (req: Request, res: Response) => {
    try {
        const data = await TipoReclamo.query("entidad")
            .eq("tipo_reclamo")
            .where("activo")
            .eq(true)
            .exec();
        res.status(200).json({
            data: data,
            msg: "Tipos de reclamos obtenidos exitosamente.",
        });
    } catch (error) {
        res.status(404).json({
            msg: "Error al obtener los tipos de reclamos",
            error,
        });
    }
};

const listAllTypes = async (req: Request, res: Response) => {
    try {
        const data = await TipoReclamo.query("entidad")
            .eq("tipo_reclamo")
            .exec();
        console.log(data);
        res.status(200).json({
            data: data,
            msg: "Tipos de reclamos obtenidos exitosamente.",
        });
    } catch (error) {
        res.status(404).json({
            msg: "Error al obtener los tipos de reclamos",
            error,
        });
    }
};
const listInputs = async (req: Request, res: Response) => {
    try {
        const data = await TipoReclamo.query("entidad")
            .eq("tipo_reclamo")
            .attributes(["id", "nombre"])
            .where("activo")
            .eq(true)
            .exec();

        res.status(200).json({
            data: data,
            msg: "Tipos de reclamos obtenidos exitosamente.",
        });
    } catch (error) {
        res.status(404).json({
            msg: "Error al obtener los tipos de reclamos",
            error,
        });
    }
};

const listAllClaimsTypeByNameAndId = async (req: Request, res: Response) => {
    try {
        console.log(req.params.id);
        const decodedNombre = decodeURIComponent(req.params.id);
        console.log(decodedNombre);
        const data = await TipoReclamo.query("entidad")
            .eq("tipo_reclamo")
            .where("nombre")
            .eq(decodedNombre)
            .attributes(["id", "nombre", "fecha_editado", "id_usuario"])
            .exec();
        if (data.count !== 0) {
            console.log(data, "data1");
            res.status(200).json({
                data: data,
                msg: "tipo de reclamos obtenidos exitosamente.",
            });
        } else {
            const dataId = await TipoReclamo.query("entidad")
                .eq("tipo_reclamo")
                .where("id")
                .eq(decodedNombre)
                .attributes(["id", "nombre", "fecha_editado", "id_usuario"])
                .exec();
            if (dataId.count !== 0) {
                console.log(dataId, "data2");
                res.status(200).json({
                    data: dataId,
                    msg: "tipo de reclamos obtenidos exitosamente.",
                });
            } else {
                res.status(200).json({
                    data: [],
                    msg: "No se encontraron tipos de reclamos.",
                });
            }
        }
    } catch (error) {
        res.status(404).json({
            msg: "Error al obtener los tipos de reclamos",
            error,
        });
    }
};

const listClaimTypeByID = async (req: Request, res: Response) => {
    try {
        const data = await TipoReclamo.get({
            entidad: "tipo_reclamo",
            id: req.params.id,
        });
        const newData = {
            ...data,
            id_usuario: data.id_usuario.username,
        };
        if (data.activo === true) {
            res.status(200).json({
                data: newData,
                msg: "Detalle de reclamo obtenido exitosamente.",
            });
        } else {
            res.status(401).json({ msg: "No autorizado." });
        }
    } catch (error) {
        res.status(404).json({ msg: "Error al obtener el reclamo", error });
    }
};

const updateType = async (req: Request, res: Response) => {
    try {
        const updatedType = await TipoReclamo.update(
            {
                entidad: "tipo_reclamo",
                id: req.params.id,
            },
            req.body,
            { returnValues: "UPDATED_NEW" }
        );
        res.status(200).json({
            data: updateType,
            msg: "Tipo de reclamo modificado.",
        });
    } catch (error) {
        return res.status(400).json({ msg: error });
    }
};

const disableType = async (req: Request, res: Response) => {
    try {
        const disableType = await TipoReclamo.update(
            {
                entidad: "tipo_reclamo",
                id: req.params.id,
            },
            { activo: false },
            { returnValues: "UPDATED_NEW" }
        );
        res.status(200).json({
            data: disableType,
            msg: "Tipo de reclamo deshabilitado.",
        });
    } catch (error) {
        return res.status(400).json({ msg: error });
    }
};

const activeType = async (req: Request, res: Response) => {
    try {
        const activeType = await TipoReclamo.update(
            {
                entidad: "tipo_reclamo",
                id: req.params.id,
            },
            { activo: true },
            { returnValues: "UPDATED_NEW" }
        );
        res.status(200).json({
            data: activeType,
            msg: "Tipo de reclamo restaurado.",
        });
    } catch (error) {
        return res.status(400).json({ msg: error });
    }
};

const listComplaintTypes = async (req: Request, res: Response) => {
    const desde: string | undefined = req.query.desde as string | undefined;
    const hasta: string | undefined = req.query.hasta as string | undefined;
    const find: string | undefined = req.query.find as string | undefined;

    try {
        let data;

        const baseQuery = TipoReclamo.query("entidad")
            .eq("tipo_reclamo")
            .where("id")
            .eq(req.body.id);

        if (!desde || !hasta || !find) {
            data = await baseQuery.exec();
        } else if (!desde && !hasta && find) {
            data = await baseQuery
                .where("tipo_reclamo.nombre")
                .contains(find)
                .exec();
        } else {
            data = await baseQuery
                .where("tipo_reclamo.nombre")
                .contains(find)
                .filter("fecha_creado")
                .between(desde, hasta)
                .exec();
        }

        res.status(200).json({
            data: data,
            msg: "Tipos de reclamo obtenidos exitosamente.",
        });
    } catch (error: any) {
        res.status(400).json({
            msg: error.msg || "Error al obtener tipos de reclamo.",
        });
    }
};

const deleteComplaintType = async (req: Request, res: Response) => {
    try {
        const deledComplaintType = await TipoReclamo.get({
            entidad: "tipo_reclamo",
            id: req.params.id,
        });
        if (!deledComplaintType) {
            return res
                .status(404)
                .json({ msg: "Tipo de reclamo no encontrado no encontrado" });
        }
        if (deledComplaintType.activo != false) {
            return res.status(404).json({
                msg: "Tipo de reclamo no puede ser eliminado, primero debe ser deshabilitado.",
            });
        }

        await TipoReclamo.delete({ entidad: "admin", id: req.params.id });
        return res
            .status(200)
            .json({ msg: "Tipo de reclamo eliminado exitosamente." });
    } catch (error) {
        return res.status(500).json({
            msg: "Error al eliminar el tipo de reclamo",
            error: error,
        });
    }
};

export {
    createComplaint_type,
    disableType,
    deleteComplaintType,
    activeType,
    listAllTypes,
    listInputs,
    listAllClaimsTypeByNameAndId,
    listClaimTypeByID,
    listActiveTypes,
    updateType,
};
