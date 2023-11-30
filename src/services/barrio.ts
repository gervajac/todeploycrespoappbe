import { Response, Request } from "express";
import Barrio from "../models/barrio";

const createNeighborhood = async (req: Request, res: Response) => {
    try {
        const repeatNeighborhood = await Barrio.query("entidad")
            .eq("barrio")
            .where("nombre")
            .eq(req.body.nombre)
            .exec();
        if (repeatNeighborhood.count !== 0) {
            return res.status(409).json({ msg: "El barrio ya existe." });
        }
        const barrio = await Barrio.create(req.body);

        res.status(200).json({ data: barrio, msg: "Barrio creado." });
    } catch (error) {
        res.status(400).json({ msg: error });
        console.log(error);
    }
};

const listNeighborhoods = async (req: Request, res: Response) => {
    try {
        const data = await Barrio.query("entidad")
            .eq("barrio")
            .where("activo")
            .eq(true)
            .exec();

        res.status(200).json({
            data: data,
            msg: "Barrios obtenidos exitosamente.",
        });
    } catch (error) {
        res.status(404).json({ msg: "Error al obtener las barrios", error });
    }
};

const inputs = async (req: Request, res: Response) => {
    try {
        const data = await Barrio.query("entidad")
            .eq("barrio")
            .attributes(["id", "nombre"])
            .where("activo")
            .eq(true)
            .exec();

        res.status(200).json({
            data: data,
            msg: "Barrios obtenidos exitosamente.",
        });
    } catch (error) {
        res.status(404).json({ msg: "Error al obtener las barrios", error });
    }
};

const listNeighborhood = async (req: Request, res: Response) => {
    try {
        const data = await Barrio.get({
            entidad: "barrio",
            id: req.params.id,
        });
        const newData = {
            ...data,
            id_usuario: data.id_usuario.username,
        };
        if (data.activo === true) {
            res.status(200).json({
                data: newData,
                msg: "Barrio obtenido exitosamente.",
            });
        } else if (req.body.user_rol === "JEFE") {
            res.status(200).json({
                data: newData,
                msg: "Barrio obtenido exitosamente.",
            });
        } else {
            res.status(401).json({ msg: "No autorizado." });
        }
    } catch (error) {
        res.status(404).json({ msg: "Error al obtener el barrio", error });
    }
};

const updateNeighborhood = async (req: Request, res: Response) => {
    try {
        const updatedNeighborhood = await Barrio.update(
            {
                entidad: "barrio",
                id: req.params.id,
            },
            req.body,
            { returnValues: "UPDATED_NEW" }
        );
        res.status(200).json({
            data: updatedNeighborhood,
            msg: "Barrio modificado.",
        });
    } catch (error) {
        return res.status(400).json({ msg: error });
    }
};

const listdisableNeighborhoods = async (req: Request, res: Response) => {
    try {
        const data = await Barrio.query("entidad")
            .eq("barrio")
            .attributes(["id", "nombre", "fecha_editado", "id_usuario"])
            .where("activo")
            .eq(false)
            .exec();
        res.status(200).json({
            data: data,
            msg: "Barrios obtenidas exitosamente.",
        });
    } catch (error) {
        res.status(404).json({ msg: "Error al obtener las barrios", error });
    }
};

const listAllNeighborhoods = async (req: Request, res: Response) => {
    try {
        const data = await Barrio.query("entidad").eq("barrio").exec();
        res.status(200).json({
            data: data,
            msg: "Barrio obtenidas exitosamente.",
        });
    } catch (error) {
        res.status(404).json({ msg: "Error al obtener las Barrio.", error });
    }
};

const listAllNeighborhoodsByIdName = async (req: Request, res: Response) => {
    try {
        console.log(req.params.id);
        const decodedNombre = decodeURIComponent(req.params.id);
        console.log(decodedNombre);
        const data = await Barrio.query("entidad")
            .eq("barrio")
            .where("nombre")
            .eq(decodedNombre)
            .attributes(["id", "nombre", "fecha_editado", "id_usuario"])
            .exec();
        if (data.count !== 0) {
            console.log(data, "data1");
            res.status(200).json({
                data: data,
                msg: "Barrios obtenidos exitosamente.",
            });
        } else {
            const dataId = await Barrio.query("entidad")
                .eq("barrio")
                .where("id")
                .eq(decodedNombre)
                .attributes(["id", "nombre", "fecha_editado", "id_usuario"])
                .exec();
            if (dataId.count !== 0) {
                console.log(dataId, "data2");
                res.status(200).json({
                    data: dataId,
                    msg: "Barrios obtenidos exitosamente.",
                });
            } else {
                res.status(200).json({
                    data: [],
                    msg: "0 barrios encontradas.",
                });
            }
        }
    } catch (error) {
        res.status(404).json({ msg: "Error al obtener las calles", error });
    }
};

const disableNeighborhood = async (req: Request, res: Response) => {
    try {
        const disableNeighborhood = await Barrio.update(
            {
                entidad: "barrio",
                id: req.params.id,
            },
            { activo: false },
            { returnValues: "UPDATED_NEW" }
        );
        res.status(200).json({
            data: disableNeighborhood,
            msg: "Barrio deshabilitado.",
        });
    } catch (error) {
        return res.status(400).json({ msg: error });
    }
};

const deleteNeighborhood = async (req: Request, res: Response) => {
    try {
        console.log(req.params.id);
        const disableNeighborhood = (
            await Barrio.get({ entidad: "barrio", id: req.params.id })
        ).delete();
        res.status(200).json({
            data: disableNeighborhood,
            msg: "Barrio eliminado.",
        });
    } catch (error) {
        return res.status(400).json({ msg: error });
    }
};

const activeNeighborhood = async (req: Request, res: Response) => {
    try {
        const activeNeighborhood = await Barrio.update(
            {
                entidad: "barrio",
                id: req.params.id,
            },
            { activo: true },
            { returnValues: "UPDATED_NEW" }
        );
        res.status(200).json({
            data: activeNeighborhood,
            msg: "Barrio restaurado.",
        });
    } catch (error) {
        return res.status(400).json({ msg: error });
    }
};

const listNeighborhoodsFilter = async (req: Request, res: Response) => {
    const desde: string | undefined = req.query.desde as string | undefined;
    const hasta: string | undefined = req.query.hasta as string | undefined;
    const find: string | undefined = req.query.find as string | undefined;

    try {
        let data;

        const baseQuery = Barrio.query("entidad").eq("barrio");

        if (!desde || !hasta || !find) {
            data = await baseQuery.exec();
        } else if (!desde && !hasta && find) {
            data = await baseQuery.where("barrio.nombre").contains(find).exec();
        } else {
            data = await baseQuery
                .where("barrio.nombre")
                .contains(find)
                .filter("fecha_creado")
                .between(desde, hasta)
                .exec();
        }

        res.status(200).json({
            data: data,
            msg: "Barrios obtenidos exitosamente.",
        });
    } catch (error: any) {
        res.status(400).json({
            msg: error.msg || "Error al obtener barrios.",
        });
    }
};
export {
    activeNeighborhood,
    createNeighborhood,
    disableNeighborhood,
    deleteNeighborhood,
    inputs,
    listNeighborhoods,
    listNeighborhood,
    updateNeighborhood,
    listdisableNeighborhoods,
    listAllNeighborhoodsByIdName,
    listAllNeighborhoods,
};
