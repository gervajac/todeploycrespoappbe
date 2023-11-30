import { Item } from "dynamoose/dist/Item";

export interface IReclamo extends Item {
    id: string;
    coordenadaX: string;
    coordenadaY: string;
    descripcion: string;
    altura: number;
    imagen?: string[];
    id_seguimiento?: string;
    barrio: { id: string; nombre: string };
    calle: { id: string; nombre: string };
    calle_interseccion?: { id: string; nombre: string };
    entre_calle1: { id: string; nombre: string };
    entre_calle2: { id: string; nombre: string };
    tipo_reclamo: { id: string; nombre: string };
    activo: boolean;
    estado: string;
    id_usuario: { id: string; username: string };
    fecha_creado: string;
    fecha_editado: string;
}
