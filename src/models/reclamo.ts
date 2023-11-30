import { Schema, model } from "dynamoose";
import { IReclamo } from "../interfaces/reclamo";
import { v4 as uuidv4 } from "uuid";

const ReclamoSchema = new Schema(
  {
    entidad: {
      type: String,
      default: "reclamo",
      hashKey: true,
    },
    id: {
      type: String,
      default: () => uuidv4(),
      rangeKey: true,
    },
    coordenadaX: {
      type: String,
      required: false,
    },
    coordenadaY: {
      type: String,
      required: false,
    },
    descripcion: {
      type: String,
      required: true,
    },
    imagen: {
      type: Array,
      schema: [String],
      default: [""],
    },
    altura: {
      type: Number,
      required: true,
    },
    id_seguimiento: {
      type: String,
      default: () => uuidv4(),
    },
    estado: {
      type: String,
      required: true,
      enum: ["ENVIADO", "INICIADO", "RESUELTO", "RECHAZADO"],
      default: "ENVIADO",
    },
    barrio: {
      type: Object,
      schema: { id: String, nombre: String },
      required: true,
    },
    calle: {
      type: Object,
      schema: { id: String, nombre: String },
      required: true,
    },

    calle_interseccion: {
      type: Object,
      schema: { id: String, nombre: String },
      required: true,
    },
    entre_calle1: {
      type: Object,
      schema: { id: String, nombre: String },
      required: true,
    },
    entre_calle2: {
      type: Object,
      schema: { id: String, nombre: String },
      required: true,
    },
    tipo_reclamo: {
      type: Object,
      schema: { id: String, nombre: String },
      required: true,
    },
    activo: {
      type: Boolean,
      default: true,
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
const Reclamo = model<IReclamo>("CrespoApp-Reclamos", ReclamoSchema);

export default Reclamo;
