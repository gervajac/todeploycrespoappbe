import { error } from "jquery";
import { Response, Request } from "express";
import Seguimiento from "../models/seguimiento";
import Reclamo from "../models/reclamo";

const updateTrakingStatus = async (req, res) => {
    try {
        const complaint = await Reclamo.get({
            entidad: "reclamo",
            id: req.params.id,
        });

        const tracking = await Reclamo.get({
            entidad: "seguimiento",
            id: complaint.id_seguimiento!,
        });

        const newStatus = await Seguimiento.get({
            entidad: "estado_reclamo",
        });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};
