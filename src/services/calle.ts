import { Response, Request } from "express";
import Calle from "../models/calle";
import Reclamos from "../models/reclamo";
import Areas from "../models/area";
import TipoReclamos from "../models/tipo_reclamo";
import Admin from "../models/admin";

const createStreet = async (req: Request, res: Response) => {
  try {
    const repeatStreet = await Calle.query("entidad").eq("calle").where("nombre").eq(req.body.nombre).exec();
    if (repeatStreet.count !== 0) {
      return res.status(409).json({ msg: "La calle ya existe." });
    }
    const calle = await Calle.create(req.body);

    res.status(200).json({ data: calle, msg: "Calle guardada." });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const listStreets2 = async (req: Request, res: Response) => {
  try {
    const data = await Calle.query("entidad").eq("calle").where("activo").eq(true).exec();

    res.status(200).json({
      data: data,
      msg: "Calles obtenidas exitosamente.",
    });
  } catch (error) {
    res.status(404).json({ msg: "Error al obtener las calles", error });
  }
};

const listAllStreets = async (req: Request, res: Response) => {
  try {
    const data = await Calle.query("entidad").eq("calle").exec();
    res.status(200).json({
      data: data,
      msg: "Calles obtenidas exitosamente.",
    });
  } catch (error) {
    res.status(404).json({ msg: "Error al obtener las calles.", error });
  }
};

const listInputs = async (req: Request, res: Response) => {
  try {
    const data = await Calle.query("entidad").eq("calle").attributes(["id", "nombre"]).where("activo").eq(true).exec();
    res.status(200).json({
      data: data,
      msg: "Calles obtenidas exitosamente.",
    });
  } catch (error) {
    res.status(404).json({ msg: "Error al obtener las calles", error });
  }
};

const listStreetByID = async (req: Request, res: Response) => {
  try {
    const data = await Calle.get({
      entidad: "calle",
      id: req.params.id,
    });
    const newData = {
      ...data,
      id_usuario: data.id_usuario.username,
    };
    console.log(newData);
    if (newData.activo === true) {
      res.status(200).json({
        data: newData,
        msg: "Calle obtenida exitosamente.",
      });
    } else if (req.body.user_rol === "JEFE") {
      res.status(200).json({
        data: newData,
        msg: "Calle obtenida exitosamente.",
      });
    } else {
      res.status(401).json({ msg: "No autorizado." });
    }
  } catch (error) {
    res.status(404).json({ msg: "Error al obtener las calles", error });
  }
};

const updateStreet = async (req: Request, res: Response) => {
  try {
    const updatedStreet = await Calle.update(
      {
        entidad: "calle",
        id: req.params.id,
      },
      req.body,
      { returnValues: "UPDATED_NEW" }
    );
    res.status(200).json({ data: updatedStreet, msg: "Calle modificada." });
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
};

const listAllStreetsByID = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id);
    const decodedNombre = decodeURIComponent(req.params.id);
    console.log(decodedNombre);
    const data = await Calle.query("entidad")
      .eq("calle")
      .where("nombre")
      .eq(decodedNombre)
      .attributes(["id", "nombre", "fecha_editado", "id_usuario"])
      .exec();
    if (data.count !== 0) {
      console.log(data, "data1");
      res.status(200).json({
        data: data,
        msg: "Calles obtenidas exitosamente.",
      });
    } else {
      const dataId = await Calle.query("entidad")
        .eq("calle")
        .where("id")
        .eq(decodedNombre)
        .attributes(["id", "nombre", "fecha_editado", "id_usuario"])
        .exec();
      if (dataId.count !== 0) {
        console.log(dataId, "data2");
        res.status(200).json({
          data: dataId,
          msg: "Calles obtenidas exitosamente.",
        });
      } else {
        res.status(200).json({
          data: [],
          msg: "0 calles encontradas.",
        });
      }
    }
  } catch (error) {
    res.status(404).json({ msg: "Error al obtener las calles", error });
  }
};

const disableStreet = async (req: Request, res: Response) => {
  try {
    const disableStreet = await Calle.update(
      {
        entidad: "calle",
        id: req.params.id,
      },
      { activo: false },
      { returnValues: "UPDATED_NEW" }
    );
    res.status(200).json({
      data: disableStreet,
      msg: "Calle deshabilitada.",
    });
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
};

const activeStreet = async (req: Request, res: Response) => {
  try {
    const activeStreet = await Calle.update(
      {
        entidad: "calle",
        id: req.params.id,
      },
      { activo: true },
      { returnValues: "UPDATED_NEW" }
    );
    res.status(200).json({ data: activeStreet, msg: "Calle restaurada." });
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
};

const deleteStreet = async (req: Request, res: Response) => {
  try {
    const disableStreet = await Calle.delete({
      entidad: "calle",
      id: req.params.id,
    });
    res.status(200).json({ data: disableStreet, msg: "Calle eliminada." });
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
};

const listStreets = async (req: Request, res: Response) => {
  const desde: string | undefined = req.query.desde as string | undefined;
  const hasta: string | undefined = req.query.hasta as string | undefined;
  const find: string | undefined = req.query.find as string | undefined;

  try {
    let data;

    const baseQuery = Calle.query("entidad").eq("calle");

    if (!desde || !hasta || !find) {
      data = await baseQuery.exec();
    } else if (!desde && !hasta && find) {
      data = await baseQuery.where("calle.nombre").contains(find).exec();
    } else {
      data = await baseQuery.where("calle.nombre").contains(find).filter("fecha_creado").between(desde, hasta).exec();
    }

    res.status(200).json({
      data: data,
      msg: "Calles obtenidas exitosamente.",
    });
  } catch (error: any) {
    res.status(400).json({
      msg: error.msg || "Error al obtener calles.",
    });
  }
};

export {
  activeStreet,
  createStreet,
  disableStreet,
  deleteStreet,
  listInputs,
  listStreets,
  listStreetByID,
  updateStreet,
  listAllStreets,
  listAllStreetsByID,
};
