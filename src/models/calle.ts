import { Schema, model } from "dynamoose";
import { ICalle } from "../interfaces/calle";
import { v4 as uuidv4 } from "uuid";

const CalleSchema = new Schema(
  {
    entidad: {
      type: String,
      default: "calle",
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

const Calle = model<ICalle>("CrespoApp-Calles", CalleSchema);

export default Calle;
