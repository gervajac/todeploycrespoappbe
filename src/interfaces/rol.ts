import { Item } from "dynamoose/dist/Item";

export interface IRol extends Item {
  id: string;
  nombre: string;
  id_usuario: string;
  activo: boolean;
  fecha_creado: string;
  fecha_editado: string;
}
