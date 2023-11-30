import { Response, Request } from "express";
import Reclamos from "../models/reclamo";
import Areas from "../models/area";
import TipoReclamos from "../models/tipo_reclamo";
import Admin from "../models/admin";
import Reclamo from "../models/reclamo";
import { IReclamo } from "../interfaces/reclamo";
import Seguimiento from "../models/seguimiento";
import EstadoReclamo from "../models/estado_reclamo";

const listComplaintsByAreas = async (req, res) => {
  try {
    if (req.body.user_rol === "JEFE") {
      const reclamos = await Reclamos.query("entidad").eq("reclamo").exec();

      res.status(200).json({
        data: reclamos,
        msg: "Reclamos según Administrador obtenidos.",
      });

      return;
    }

    const adminAreas = req.body.user_areas;

    const areasPromises = adminAreas.map(async (areaId) => {
      return await Areas.get({ entidad: "area", id: areaId });
    });

    const areas = await Promise.all(areasPromises);

    const tiposReclamosIds = areas.flatMap((area) => area.tipos_reclamos);

    const reclamosPromises = tiposReclamosIds.map(async (reclamoId) => {
      return await TipoReclamos.query("entidad").eq("tipo_reclamo").where("id").eq(reclamoId).exec();
    });

    const tipoDeReclamos = await Promise.all(reclamosPromises);

    const reclamosFlatted = tipoDeReclamos.flat();
    const idsDeReclamos = reclamosFlatted.map((reclamo) => reclamo.id);

    const reclamos = await Reclamos.query("entidad").eq("reclamo").exec();

    const reclamosFiltered = reclamos.filter((reclamo) => {
      return idsDeReclamos.includes(reclamo.tipo_reclamo.id);
    });

    res.status(200).json({
      data: reclamosFiltered,
      msg: "Reclamos según Administrador obtenidos.",
    });
  } catch (error) {
    res.status(404).json({ msg: "Error al obtener quejas", error });
  }
};

const changeTrackingStatus = async (req: Request, res: Response) => {
  try {
    const complaint = await Reclamo.get({
      entidad: "reclamo",
      id: req.params.id,
    });

    if (complaint.estado === "RESUELTO" || complaint.estado === "RECHAZADO") {
      res.status(403).json({
        msg: "El reclamo ha sido cerrado.",
      });
      return;
    }

    const newStatus = await EstadoReclamo.create(req.body);

    const tracking = await Seguimiento.get({
      entidad: "seguimiento",
      id: complaint.id_seguimiento!,
    });

    const StatusSchema = {
      id: newStatus.id,
      nombre: newStatus.nombre,
      activo: newStatus.activo,
      descripcion: newStatus.descripcion,
      id_usuario: newStatus.id_usuario,
      fecha_creado: newStatus.fecha_creado,
      fecha_editado: newStatus.fecha_editado,
    };

    const updatedTracking = await Seguimiento.update(
      {
        entidad: "seguimiento",
        id: complaint.id_seguimiento,
      },
      //@ts-ignore
      { estados: [...tracking.estados, StatusSchema] },
      { returnValues: "UPDATED_NEW" }
    );

    const updatedStatus2 = await Reclamos.update(
      {
        entidad: "reclamo",
        id: req.params.id,
      },
      { estado: newStatus.nombre },
      { returnValues: "UPDATED_NEW" }
    );
    res.status(200).json({
      data: updatedTracking,
      msg: "Estado modificado.",
    });
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
};

const listDetailComplaints = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const data = await Reclamo.query("entidad").eq("reclamo").where("id").eq(id).exec();

    const tracking = await Seguimiento.query("entidad").eq("seguimiento").where("id").eq(data[0].id_seguimiento).exec();

    const complaintObject = {
      "Tipo de reclamo": data[0].tipo_reclamo.nombre,
      Barrio: data[0].barrio.nombre,
      Dirección: `${data[0].calle.nombre} ${data[0].altura}`,
      "Entre calles": `${data[0].entre_calle1.nombre} y ${data[0].entre_calle2.nombre}`,
      Intersección: data[0].calle_interseccion?.nombre,
      Autor: data[0].id_usuario.username,
      Descripción: data[0].descripcion,
      img: data[0].imagen,
      Seguimiento: tracking[0].estados,
    };
    res.status(200).json({
      data: complaintObject,
      msg: "Detalles de reclamo obtenidos exitosamente.",
    });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

export { listComplaintsByAreas, changeTrackingStatus, listDetailComplaints };
