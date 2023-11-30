import { Schema, model } from "dynamoose";
import { ITipoReclamo } from "../interfaces/tipo_reclamo";
import { v4 as uuidv4 } from "uuid";

const TipoReclamoSchema = new Schema(
  {
    entidad: {
      type: String,
      default: "tipo_reclamo",
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

const TipoReclamo = model<ITipoReclamo>("CrespoApp-Tipo_reclamo", TipoReclamoSchema);

export default TipoReclamo;
