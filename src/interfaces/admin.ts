import { Item } from "dynamoose/dist/Item";

export interface IAdmin extends Item {
  id: string;
  username: string;
  password: string;
  rol: string;
  areas: string[];
  id_usuario: { id: string; username: string };
  activo: boolean;
  fecha_creado: string;
  fecha_editado: string;
}
