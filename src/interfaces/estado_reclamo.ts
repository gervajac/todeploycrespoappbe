import { Item } from "dynamoose/dist/Item";

export interface IEstadoReclamo extends Item {
    id: string;
    nombre: string;
    descripcion: string;
    activo: boolean;
    id_usuario: { id: string; username: string };
    fecha_creado: string;
    fecha_editado: string;
}
