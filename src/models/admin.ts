import { Schema, model } from "dynamoose";
import { IAdmin } from "../interfaces/admin";
import { v4 as uuidv4 } from "uuid";

const AdminSchema = new Schema(
    {
        entidad: {
            type: String,
            default: "admin",
            hashKey: true,
        },
        id: {
            type: String,
            default: () => uuidv4(),
            rangeKey: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        rol: {
            type: String,
            required: true,
            default: "EMPLEADO",
        },
        areas: {
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

const Admin = model<IAdmin>("CrespoApp-Usuarios", AdminSchema);

export default Admin;
