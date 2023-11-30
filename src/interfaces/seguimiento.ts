import { Item } from "dynamoose/dist/Item";
import { IEstadoReclamo } from "./estado_reclamo";

export interface ISeguimiento extends Item {
    id: string;
    estados: IEstadoReclamo[];
    id_usuario: { id: string; username: string };
    activo: boolean;
    fecha_creado: string;
    fecha_editado: string;
}
