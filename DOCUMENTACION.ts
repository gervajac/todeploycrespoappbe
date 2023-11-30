export const area = [
    {
        id: 1,
        parameter: "Nombre del Area", //descripcion
        status: "Requerido",
        post_variable: "nombre",
        type: "Texto",
        observation: "Texto",
        example: "Infraestructura Urbana",
        route: "/area/detalle/:id",
    },

    {
        id: 2,
        parameter: "Tipos de reclamos",
        status: "Requerido",
        post_variable: "tipos_reclamos",
        type: "Lista de ids de reclamos",
        observation: "Texto",
        example: [
            "5f9899e9-e850-4980-81ec-e7b0a9910c29",
            "b085c1a2-0862-44cc-8ba5-71699d1821b1",
        ],
    },
    "route[post]: /area/{id};",

    "route[get]: /area/todas;",

    "route[get]: /area;",

    "route[get]: /area/detalle/:id;",

    {
        id: 6,
        parameter: "Cambia el nombre",
        status: "Requerido",
        post_variable: "nombre",
        type: "texto",
        observation: "Modifica el nombre ",
        example: {
            nombre: "Servicio de Salud Animal",
        },
    },
    "route[patch]: /area/:id;",

    {
        id: 7,
        parameter: "Deshabilita el area",
        status: "Requerido",
        post_variable: "id",
        type: "texto",
        observation: "Cambia el activo=true a false",
        example: {
            activo: false,
        },
    },
    "route[put]: /area/:id;",

    {
        id: 8,
        parameter: "Habilita el area",
        status: "Requerido",
        post_variable: "id",
        type: "texto",
        observation: "Cambia el activo=false a true",
        example: {
            activo: true,
        },
    },
    "route[post]: /area/:id;",

    {
        id: 9,
        parameter: "Elimina el area",
        status: "Requerido",
        post_variable: "id",
        type: "texto",
        observation: "Elimina el area si activo=false",
        example: {
            activo: false,
        },
    },
    "route[delete]: /area/:id;",
];

export const admin = [
    {
        id: 1,
        parameter: "Email del usuario",
        status: "Requerido",
        post_variable: "email",
        type: "Texto",
        observation: "Texto",
        example: "empleado-uno@municipalidad.gob",
        route: "/admin/{id}",
    },
    {
        id: 2,
        parameter: "Contraseña del usuario",
        status: "Requerido",
        post_variable: "password",
        type: "Texto",
        observation: "Texto",
        example: "Passwordempleadouno",
        route: "/admin/{id}",
    },
    {
        id: 3,
        parameter: "Roles",
        status: "Requerido",
        post_variable: "rol",
        type: "Texto",
        observation: "Texto",
        example: "EMPLEADO",
        route: "/admin/{id}",
    },
    {
        id: 4,
        parameter: "Area",
        status: "Requerido",
        post_variable: "area",
        type: "Lista de textos",
        observation: "Texto",
        example: ["Servicios de Limpieza", "Gestión de Agua"],
        route: "/admin/{id}",
    },

    "route[get]: /area/todas;",
];
