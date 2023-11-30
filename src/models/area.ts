import { Schema, model } from "dynamoose";
import { v4 as uuidv4 } from "uuid";
import { IArea } from "../interfaces/area";

const AreaSchema = new Schema(
  {
    entidad: {
      type: String,
      default: "area",
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
    tipos_reclamos: {
      type: Array,
      schema: [String],
      default: [""],
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

const Area = model<IArea>("CrespoApp-Areas", AreaSchema);

export default Area;
