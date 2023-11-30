import dotenv from "dotenv";
import Area from "../models/area";
import { Response, Request } from "express";
import TipoReclamo from "../models/tipo_reclamo";

dotenv.config();

const createArea = async (req: Request, res: Response) => {
    try {
        const area = await Area.create(req.body);

        res.status(200).json({ data: area, msg: "Area creado." });
    } catch (error) {
        res.status(400).json({ msg: error });
        console.log(error);
    }
};

const listAllAreas = async (req: Request, res: Response) => {
    try {
        const data = await Area.query("entidad").eq("area").exec();

        const areasWithUsername = data.map((area) => {
            return {
                ...area,
                id_usuario: area.id_usuario,
            };
        });

        res.status(200).json({
            data: areasWithUsername,
            msg: "Áreas obtenidas exitosamente.",
        });
    } catch (error) {
        res.status(404).json({ msg: "Error al obtener las áreas.", error });
    }
};

const listActiveAreas = async (req: Request, res: Response) => {
    try {
        const data = await Area.query("entidad")
            .eq("area")
            .where("activo")
            .eq(true)
            .exec();

        const areasWithUsername = data.map((area) => {
            return {
                ...area,
                id_usuario: area.id_usuario,
            };
        });

        res.status(200).json({
            data: areasWithUsername,
            msg: "Áreas obtenidas exitosamente.",
        });
    } catch (error) {
        res.status(404).json({ msg: "Error al obtener las áreas.", error });
    }
};

const listAllAreasByIDorName = async (req: Request, res: Response) => {
    try {
        console.log(req.params.id);
        const decodedNombre = decodeURIComponent(req.params.id);
        console.log(decodedNombre);
        const data = await Area.query("entidad")
            .eq("area")
            .where("nombre")
            .eq(decodedNombre)
            .attributes(["id", "nombre", "fecha_editado", "id_usuario"])
            .exec();
        if (data.count !== 0) {
            console.log(data, "data1");
            res.status(200).json({
                data: data,
                msg: "Areas obtenidas exitosamente.",
            });
        } else {
            const dataId = await Area.query("entidad")
                .eq("area")
                .where("id")
                .eq(decodedNombre)
                .attributes(["id", "nombre", "fecha_editado", "id_usuario"])
                .exec();
            if (dataId.count !== 0) {
                console.log(dataId, "data2");
                res.status(200).json({
                    data: dataId,
                    msg: "Areas obtenidas exitosamente.",
                });
            } else {
                res.status(200).json({
                    data: [],
                    msg: "0 areas encontradas.",
                });
            }
        }
    } catch (error) {
        res.status(404).json({ msg: "Error al obtener las areas", error });
    }
};

const listAreaByID = async (req: Request, res: Response) => {
    try {
        const data = await Area.get({
            entidad: "area",
            id: req.params.id,
        });
        console.log("DATAAAAAAAA", data);

        const reclamosIds = data.tipos_reclamos;

        const keysToGet = reclamosIds.map((reclamoId) => ({
            entidad: "tipo_reclamo",
            id: reclamoId,
        }));

        const tiposReclamos = await TipoReclamo.batchGet(keysToGet);

        const nombresReclamos = tiposReclamos.map(
            (tipoReclamo) => tipoReclamo.nombre
        );

        const newData = {
            ...data,
            id_usuario: data.id_usuario.username,
            tipos_reclamos: nombresReclamos,
        };
        if (data.activo === true) {
            res.status(200).json({
                data: newData,
                msg: "Area obtenida exitosamente.",
            });
        } else if (data.activo === false && req.body.user_rol === "JEFE") {
            res.status(200).json({
                data: newData,
                msg: "Area obtenida exitosamente.",
            });
        } else {
            res.status(401).json({ msg: "No autorizado." });
        }
    } catch (error) {
        res.status(404).json({ msg: "Error al obtener las areas", error });
    }
};

const updateArea = async (req: Request, res: Response) => {
    try {
        const updatedArea = await Area.update(
            {
                entidad: "area",
                id: req.params.id,
            },
            req.body,
            { returnValues: "UPDATED_NEW" }
        );
        res.status(200).json({ data: updatedArea, msg: "Area modificada." });
    } catch (error) {
        return res.status(400).json({ msg: error });
    }
};

const disableArea = async (req: Request, res: Response) => {
    try {
        const disableStreet = await Area.update(
            {
                entidad: "area",
                id: req.params.id,
            },
            { activo: false },
            { returnValues: "UPDATED_NEW" }
        );
        res.status(200).json({
            data: disableStreet,
            msg: "Area deshabilitada.",
        });
    } catch (error) {
        return res.status(400).json({ msg: error });
    }
};

const activeArea = async (req: Request, res: Response) => {
    try {
        const activeStreet = await Area.update(
            {
                entidad: "area",
                id: req.params.id,
            },
            { activo: true },
            { returnValues: "UPDATED_NEW" }
        );
        res.status(200).json({ data: activeStreet, msg: "Area restaurada." });
    } catch (error) {
        return res.status(400).json({ msg: error });
    }
};

const deleteArea = async (req: Request, res: Response) => {
    try {
        const disableStreet = (
            await Area.get({ entidad: "area", id: req.params.id })
        ).delete();
        res.status(200).json({ data: disableStreet, msg: "Area eliminada." });
    } catch (error) {
        return res.status(400).json({ msg: error });
    }
};

const listAreas = async (req: Request, res: Response) => {
    const desde: string | undefined = req.query.desde as string | undefined;
    const hasta: string | undefined = req.query.hasta as string | undefined;
    const find: string | undefined = req.query.find as string | undefined;

    try {
        let data;

        const baseQuery = Area.query("entidad")
            .eq("area")
            .where("activo")
            .eq(true);

        if (!desde || !hasta || !find) {
            data = await baseQuery.exec();
        } else if (!desde && !hasta && find) {
            data = await baseQuery.where("nombre").contains(find).exec();
        } else {
            data = await baseQuery
                .where("nombre")
                .contains(find)
                .filter("fecha_creado")
                .between(desde, hasta)
                .exec();
        }

        res.status(200).json({
            data: data,
            msg: "Areas obtenidas exitosamente.",
        });
    } catch (error: any) {
        res.status(400).json({
            msg: error.msg || "Error al obtener areas.",
        });
    }
};

export {
    activeArea,
    createArea,
    deleteArea,
    disableArea,
    listActiveAreas,
    listAllAreas,
    listAllAreasByIDorName,
    listAreaByID,
    updateArea,
    listAreas,
};
