import { Item } from "dynamoose/dist/Item";

export interface ICalle extends Item {
  entidad: string;
  id: string;
  nombre: string;
  id_usuario: { id: string; username: string };
  activo: boolean;
  fecha_creado: string;
  fecha_editado: string;
}
