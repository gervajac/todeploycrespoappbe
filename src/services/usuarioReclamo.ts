import dynamoose from "dynamoose";
import { error } from "jquery";
import { Response, Request } from "express";
import Reclamo from "../models/reclamo";
import Seguimiento, { initialTracking } from "../models/seguimiento";
import { IReclamo } from "../interfaces/reclamo";
import EstadoReclamo, { initialState } from "../models/estado_reclamo";
import { IEstadoReclamo } from "../interfaces/estado_reclamo";
import Usuario from "../models/usuario";

const createComplaint = async (req: Request, res: Response) => {
    try {
        const reclamo: IReclamo = await Reclamo.create(req.body);

        const status: IEstadoReclamo = await EstadoReclamo.create({
            ...initialState,
            id_usuario: reclamo.id_usuario,
        });

        const StatusSchema = {
            id: status.id,
            nombre: status.nombre,
            activo: status.activo,
            descripcion: status.descripcion,
            id_usuario: status.id_usuario,
            fecha_creado: status.fecha_creado,
            fecha_editado: status.fecha_editado,
        };

        const tracking = await Seguimiento.create({
            ...initialTracking,
            id: reclamo.id_seguimiento,
            //@ts-ignore
            estados: [StatusSchema],
            id_usuario: reclamo.id_usuario,
        });

        res.status(200).json({ data: reclamo, msg: "Reclamo guardado." });
    } catch (error) {
        res.status(400).json({ msg: error });
        console.log(error);
    }
};

const listComplaints = async (req: Request, res: Response) => {
    try {
        const data = await Reclamo.query("entidad")
            .eq("reclamo")
            .where("activo")
            .eq(true)
            .exec();

        res.status(200).json({
            data: data,
            msg: "Reclamos obtenidas exitosamente.",
        });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};

const listDetailComplaints = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const data = await Reclamo.query("entidad")
            .eq("reclamo")
            .where("id")
            .eq(id)
            .exec();

        res.status(200).json({
            data: data,
            msg: "Detalles de reclamo obtenidos exitosamente.",
        });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};

const listUserComplaints = async (req: Request, res: Response) => {
    const desde: string | undefined = req.query.desde as string | undefined;
    const hasta: string | undefined = req.query.hasta as string | undefined;
    const find: string | undefined = req.query.find as string | undefined;

    try {
        let data;

        const baseQuery = Reclamo.query("entidad")
            .eq("reclamo")
            .where("id_usuario")
            .eq(req.body.id_usuario);

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
            msg: "Reclamos obtenidos exitosamente.",
        });
    } catch (error: any) {
        res.status(400).json({
            msg: error.msg || "Error al obtener reclamos.",
        });
    }
};

const updateComplaint = async (req: Request, res: Response) => {
    try {
        const complaint = await Reclamo.update(
            {
                entidad: "reclamo",
                id: req.params.id,
                id_usuario: req.body.id,
            },
            req.body,
            { returnValues: "UPDATED_NEW" }
        );
        if (!complaint.activo) {
            return res.status(404).json({ msg: "Reclamo inactivo" });
        }
        if (complaint.estado !== "Enviado") {
            return res.status(404).json({
                msg: "No se puede actualizar el reclamo una vez iniciado.",
            });
        }

        res.status(200).json({
            data: complaint,
            msg: "Reclamo editado exitosamente.",
        });
    } catch (error) {
        return res.status(500).json({ msg: "Error al actualizar el reclamo" });
    }
};

const deleteComplaint = async (req: Request, res: Response) => {
    try {
        const data = await Reclamo.query("entidad")
            .eq("reclamo")
            .where("id")
            .eq(req.params.id)
            .where("estado")
            .eq("ENVIADO")
            .exec();

        if (data.length === 0) {
            return res.status(404).json({
                msg: "El reclamo no puede ser eliminado.",
            });
        }
        await data[0].delete();

        res.status(200).json({
            msg: "Reclamo eliminado exitosamente.",
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error al eliminar el reclamo.",
            error: error,
        });
    }
};
export {
    createComplaint,
    updateComplaint,
    listUserComplaints,
    listDetailComplaints,
    deleteComplaint,
    listComplaints,
};
