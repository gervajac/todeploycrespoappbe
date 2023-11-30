import { Schema, model } from "dynamoose";
import { IUsuario } from "../interfaces/usuario";
import { v4 as uuidv4 } from "uuid";

const UsuarioSchema = new Schema(
    {
        entidad: {
            type: String,
            default: "usuario",
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
        apellido: {
            type: String,
            required: true,
        },
        dni: {
            type: Number,
            required: true,
        },
        direccion: {
            type: String,
            required: true,
        },
        telefono: {
            type: String,
            required: true,
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
            default: "CONTRIBUYENTE",
        },
        url_token: {
            type: String,
            required: true,
            default: () => uuidv4(),
        },
        activo: {
            type: Boolean,
            default: false,
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

const Usuario = model<IUsuario>("CrespoApp-Usuarios", UsuarioSchema);

export default Usuario;
