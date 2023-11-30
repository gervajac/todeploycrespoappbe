import { Item } from "dynamoose/dist/Item";

export interface IArea extends Item {
  id: string;
  nombre: string;
  tipos_reclamos: string[];
  id_usuario: { id: string; username: string };
  activo: boolean;
  fecha_creado: string;
  fecha_editado: string;
}
