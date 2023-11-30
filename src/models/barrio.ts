import { Schema, model } from "dynamoose";
import { IBarrio } from "../interfaces/barrio";
import { v4 as uuidv4 } from "uuid";

const BarrioSchema = new Schema(
  {
    entidad: {
      type: String,
      default: "barrio",
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
    id_usuario: {
      type: Object,
      schema: { id: String, username: String },
      required: true,
    },
    activo: {
      type: Boolean,
      default: true,
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

const Barrio = model<IBarrio>("CrespoApp-Barrios", BarrioSchema);

export default Barrio;
