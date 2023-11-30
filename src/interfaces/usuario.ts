import { Item } from "dynamoose/dist/Item";

export interface IUsuario extends Item {
  id: string;
  nombre: string;
  apellido: string;
  dni: number;
  direccion: string;
  telefono: string;
  username: string;
  password: string;
  rol: string;
  url_token: string | null;
  activo: boolean;
  fecha_creado: string;
  fecha_editado: string;
}
