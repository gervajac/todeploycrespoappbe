import { IEstadoReclamo } from "./../interfaces/estado_reclamo";
import { Schema, model } from "dynamoose";
import { v4 as uuidv4 } from "uuid";

export const initialState = {
  nombre: "ENVIADO",
  descripcion: "Reclamo enviado",
  activo: true,
  id_usuario: { id: "", username: "" },
};

export const EstadoReclamoSchema = new Schema(
  {
    entidad: {
      type: String,
      default: "estado_reclamo",
      hashKey: true,
    },
    id: {
      type: String,
      default: () => uuidv4(),
      rangeKey: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    id_usuario: {
      type: Object,
      schema: { id: String, username: String },
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: {
        fecha_creado: {
          type: {
            value: Date,
            settings: {
              storage: "iso",
            },
          },
        },
      },
      updatedAt: {
        fecha_editado: {
          type: {
            value: Date,
            settings: {
              storage: "iso",
            },
          },
        },
      },
    },
  }
);

const EstadoReclamo = model<IEstadoReclamo>("CrespoApp-EstadoReclamo", EstadoReclamoSchema);

export default EstadoReclamo;
