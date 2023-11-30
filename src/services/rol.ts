import { Response, Request } from "express";
import Street from "../models/calle";
import Calle from "../models/calle";
import { listTable } from "../utils/getByPk";
import Rol from "../models/rol";

const createRol = async (req: Request, res: Response) => {
    try {
        const rol = await Rol.create(req.body);

        res.status(200).json({ data: rol, msg: "Rol guardado." });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};

export { createRol };
