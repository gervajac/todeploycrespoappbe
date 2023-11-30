import { Schema, model } from "dynamoose";
import { ISeguimiento } from "../interfaces/seguimiento";
import { v4 as uuidv4 } from "uuid";

export const initialTracking = {
  nombre: "ENVIADO",
  descripcion: "Reclamo enviado",
  id_usuario: { id: "", username: "" },
};

const EstadoReclamoSchema = new Schema({
  id: {
    type: String,
    required: true,
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
  fecha_creado: {
    type: String,
    required: true,
  },
  fecha_editado: {
    type: String,
    required: true,
  },
});

const SeguimientoSchema = new Schema(
  {
    entidad: {
      type: String,
      default: "seguimiento",
      hashKey: true,
    },
    id: {
      type: String,
      default: () => uuidv4(),
      rangeKey: true,
    },
    estados: {
      type: Array,
      schema: [EstadoReclamoSchema],
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

const Seguimiento = model<ISeguimiento>("CrespoApp-Seguimientos", SeguimientoSchema);

export default Seguimiento;
