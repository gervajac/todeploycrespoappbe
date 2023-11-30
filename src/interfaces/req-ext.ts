import { Request } from "express";
import { IUsuario } from "./usuario";

export interface RequestExt extends Request {
  user: IUsuario;
}
