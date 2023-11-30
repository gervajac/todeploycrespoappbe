import { Item } from "dynamoose/dist/Item";

export interface ITipoReclamo extends Item {
  id: string;
  nombre: string;
  activo: boolean;
  id_usuario: { id: string; username: string };
  fecha_creado: string;
  fecha_editado: string;
}
