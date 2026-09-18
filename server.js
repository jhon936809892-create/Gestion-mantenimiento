// =====================================================
// SERVER.JS
// SISTEMA DE GESTIÓN DE CUADRILLAS
// =====================================================

const express = require("express");
const { Pool } = require("pg");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const app = express();

const PORT = Number(process.env.PORT) || 3000;


// =====================================================
// CONFIGURACIÓN
// =====================================================

app.use(express.json());


// =====================================================
// CONEXIÓN POSTGRESQL
// =====================================================

const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false
    })
    : new Pool({
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "gestion_cuadrillas"
    });


// =====================================================
// SESIONES
// =====================================================

app.set("trust proxy", 1);

app.use(session({
    secret: process.env.SESSION_SECRET || "dev-only-change-this-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 8
    }
}));


// =====================================================
// FUNCIONES DE SEGURIDAD
// =====================================================


// -----------------------------------------------------
// COMPROBAR SESIÓN
// -----------------------------------------------------

function requiereSesion(req, res, next) {

    if (!req.session.usuario) {

        return res.status(401).json({

            error:
                "Debe iniciar sesión."

        });

    }

    next();

}


// -----------------------------------------------------
// COMPROBAR COORDINADOR
// -----------------------------------------------------

function esCoordinador(req) {

    return (

        req.session.usuario &&

        req.session.usuario.cargo ===
        "Coordinador de Proyectos"

    );

}


// -----------------------------------------------------
// REQUERIR COORDINADOR
// -----------------------------------------------------

function requiereCoordinador(req, res, next) {

    if (!req.session.usuario) {

        return res.status(401).json({

            error:
                "Debe iniciar sesión."

        });

    }


    if (!esCoordinador(req)) {

        return res.status(403).json({

            error:
                "No tiene permisos para realizar esta acción."

        });

    }


    next();

}


// =====================================================
// RUTAS PÚBLICAS
// =====================================================

app.use((req, res, next) => {

    // Login
    if (req.path === "/login.html") {
        return next();
    }

    // Login API
    if (req.path === "/api/login") {
        return next();
    }

    // Imágenes
    if (req.path.startsWith("/img/")) {
        return next();
    }

    // CSS
    if (req.path.endsWith(".css")) {
        return next();
    }

    // JavaScript del login
    if (
        req.path === "/login.js" ||
        req.path === "/script-login.js"
    ) {
        return next();
    }

    // Si ya tiene sesión
    if (req.session.usuario) {
        return next();
    }

    // Si no tiene sesión
    return res.redirect("/login.html");

});


// =====================================================
// ARCHIVOS ESTÁTICOS
// =====================================================

app.use(express.static(__dirname, {
    index: false
}));


// =====================================================
// CONEXIÓN POSTGRESQL
// =====================================================

pool.connect()

    .then(client => {

        console.log("----------------------------------------");
        console.log("PostgreSQL conectado correctamente");
        console.log("Base de datos: gestion_cuadrillas");
        console.log("----------------------------------------");

        client.release();

    })

    .catch(error => {

        console.error("----------------------------------------");
        console.error("ERROR AL CONECTAR CON POSTGRESQL");
        console.error(error.message);
        console.error("----------------------------------------");

    });


// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", async (req, res) => {

    try {

        const {
            usuario,
            password
        } = req.body;


        if (!usuario || !password) {

            return res.status(400).json({

                error:
                    "Ingrese usuario y contraseña."

            });

        }


        const resultado = await pool.query(`

            SELECT
                id,
                nombre,
                usuario,
                password_hash,
                cargo,
                activo

            FROM usuarios

            WHERE usuario = $1

        `, [usuario]);


        if (resultado.rows.length === 0) {

            return res.status(401).json({

                error:
                    "Usuario o contraseña incorrectos."

            });

        }


        const user =
            resultado.rows[0];


        if (!user.activo) {

            return res.status(403).json({

                error:
                    "Este usuario está desactivado."

            });

        }


        const passwordCorrecta =
            await bcrypt.compare(
                password,
                user.password_hash
            );


        if (!passwordCorrecta) {

            return res.status(401).json({

                error:
                    "Usuario o contraseña incorrectos."

            });

        }


        req.session.usuario = {

            id: user.id,

            nombre: user.nombre,

            usuario: user.usuario,

            cargo: user.cargo

        };


        res.json({

            mensaje:
                "Inicio de sesión correcto",

            usuario: {

                id: user.id,

                nombre: user.nombre,

                usuario: user.usuario,

                cargo: user.cargo

            }

        });

    }

    catch (error) {

        console.error(
            "Error en login:",
            error
        );

        res.status(500).json({

            error:
                "Error interno del servidor."

        });

    }

});


// =====================================================
// USUARIO ACTUAL
// =====================================================

app.get(
    "/api/usuario",
    requiereSesion,
    (req, res) => {

        res.json(
            req.session.usuario
        );

    }
);


// =====================================================
// CERRAR SESIÓN
// =====================================================

app.post(
    "/api/logout",
    requiereSesion,
    (req, res) => {

        req.session.destroy(error => {

            if (error) {

                console.error(
                    "Error cerrando sesión:",
                    error
                );

                return res.status(500).json({

                    error:
                        "No se pudo cerrar la sesión."

                });

            }


            res.clearCookie("connect.sid");


            res.json({

                mensaje:
                    "Sesión cerrada correctamente."

            });

        });

    }
);


// =====================================================
// PÁGINA PRINCIPAL
// =====================================================

app.get(
    "/",
    requiereSesion,
    (req, res) => {

        res.sendFile(
            __dirname + "/index.html"
        );

    }
);


// =====================================================
// CREAR USUARIO INICIAL
// =====================================================




// =====================================================
// PRUEBA DEL SERVIDOR
// =====================================================

app.get(
    "/api/prueba",
    requiereSesion,
    (req, res) => {

        res.json({

            mensaje:
                "Backend funcionando correctamente",

            baseDatos:
                "gestion_cuadrillas"

        });

    }
);


// =====================================================
// =====================================================
// CUADRILLAS
// =====================================================
// =====================================================


// -----------------------------------------------------
// OBTENER CUADRILLAS
// -----------------------------------------------------

app.get(
    "/api/cuadrillas",
    requiereSesion,
    async (req, res) => {

        try {

            const resultado =
                await pool.query(`

                    SELECT
                        id,
                        nombre

                    FROM cuadrillas

                    ORDER BY id

                `);


            res.json(
                resultado.rows
            );

        }

        catch (error) {

            console.error(
                "Error al obtener cuadrillas:",
                error
            );

            res.status(500).json({

                error:
                    "No se pudieron obtener las cuadrillas"

            });

        }

    }
);


// -----------------------------------------------------
// PERSONAL DE UNA CUADRILLA
// -----------------------------------------------------

app.get(
    "/api/cuadrillas/:id/personal",
    requiereSesion,
    async (req, res) => {

        try {

            const { id } =
                req.params;


            const resultado =
                await pool.query(`

                    SELECT

                        p.id,
                        p.nombres,
                        p.apellidos,
                        p.documento,
                        p.celular,
                        p.cargo,
                        p.cuadrilla_id

                    FROM personal p

                    WHERE p.cuadrilla_id = $1

                    ORDER BY
                        p.apellidos,
                        p.nombres

                `, [id]);


            res.json(
                resultado.rows
            );

        }

        catch (error) {

            console.error(
                "Error al obtener personal:",
                error
            );

            res.status(500).json({

                error:
                    "No se pudo obtener el personal"

            });

        }

    }
);


// =====================================================
// =====================================================
// PERSONAL
// =====================================================
// =====================================================


// -----------------------------------------------------
// OBTENER TODO EL PERSONAL
// COORDINADOR Y SUPERVISOR PUEDEN VER
// -----------------------------------------------------

app.get(
    "/api/personal",
    requiereSesion,
    async (req, res) => {

        try {

            const resultado =
                await pool.query(`

                    SELECT

                        p.id,
                        p.nombres,
                        p.apellidos,
                        p.tipo_documento,
                        p.documento,
                        p.celular,
                        p.cargo,
                        p.cuadrilla_id,

                        c.nombre AS cuadrilla

                    FROM personal p

                    LEFT JOIN cuadrillas c
                        ON p.cuadrilla_id = c.id

                    ORDER BY
                        p.id DESC

                `);


            res.json(
                resultado.rows
            );

        }

        catch (error) {

            console.error(
                "Error al obtener personal:",
                error
            );

            res.status(500).json({

                error:
                    "No se pudo obtener el personal"

            });

        }

    }
);


// -----------------------------------------------------
// OBTENER UN PERSONAL
// -----------------------------------------------------

app.get(
    "/api/personal/:id",
    requiereSesion,
    async (req, res) => {

        try {

            const { id } =
                req.params;


            const resultado =
                await pool.query(`

                    SELECT

                        p.*,

                        c.nombre AS cuadrilla

                    FROM personal p

                    LEFT JOIN cuadrillas c
                        ON p.cuadrilla_id = c.id

                    WHERE p.id = $1

                `, [id]);


            if (
                resultado.rows.length === 0
            ) {

                return res.status(404).json({

                    error:
                        "Personal no encontrado"

                });

            }


            res.json(
                resultado.rows[0]
            );

        }

        catch (error) {

            console.error(
                "Error al obtener personal:",
                error
            );

            res.status(500).json({

                error:
                    "No se pudo obtener el personal"

            });

        }

    }
);


// -----------------------------------------------------
// REGISTRAR PERSONAL
// SOLO COORDINADOR
// -----------------------------------------------------

app.post(
    "/api/personal",
    requiereCoordinador,
    async (req, res) => {

        try {

            const {

                nombres,
                apellidos,
                documento,
                celular,
                cargo,
                cuadrilla

            } = req.body;


            // -----------------------------------------
            // VALIDAR CAMPOS
            // -----------------------------------------

            if (
                !nombres ||
                !apellidos ||
                !documento
            ) {

                return res.status(400).json({

                    error:
                        "Nombres, apellidos y DNI son obligatorios"

                });

            }


            // -----------------------------------------
            // VALIDAR DNI
            // -----------------------------------------

            if (
                !/^[0-9]{8}$/.test(documento)
            ) {

                return res.status(400).json({

                    error:
                        "El DNI debe tener exactamente 8 dígitos"

                });

            }


            // -----------------------------------------
            // VALIDAR CELULAR
            // -----------------------------------------

            if (
                celular &&
                !/^[0-9]{9}$/.test(celular)
            ) {

                return res.status(400).json({

                    error:
                        "El celular debe tener 9 dígitos"

                });

            }


            // -----------------------------------------
            // DNI DUPLICADO
            // -----------------------------------------

            const dniExistente =
                await pool.query(`

                    SELECT id

                    FROM personal

                    WHERE documento = $1

                `, [documento]);


            if (
                dniExistente.rows.length > 0
            ) {

                return res.status(409).json({

                    error:
                        "El DNI ya está registrado"

                });

            }


            // -----------------------------------------
            // INSERTAR
            // -----------------------------------------

            const resultado =
                await pool.query(`

                    INSERT INTO personal

                    (
                        nombres,
                        apellidos,
                        documento,
                        celular,
                        cargo,
                        cuadrilla_id
                    )

                    VALUES

                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6
                    )

                    RETURNING *

                `, [

                    nombres.trim(),

                    apellidos.trim(),

                    documento,

                    celular || null,

                    cargo
                        ? cargo.trim()
                        : null,

                    cuadrilla || null

                ]);


            res.status(201).json({

                mensaje:
                    "Personal registrado correctamente",

                personal:
                    resultado.rows[0]

            });

        }

        catch (error) {

            console.error(
                "Error al registrar personal:",
                error
            );

            res.status(500).json({

                error:
                    "No se pudo registrar el personal"

            });

        }

    }
);


// =====================================================
// =====================================================
// PROYECTOS
// =====================================================
// =====================================================


// -----------------------------------------------------
// OBTENER PROYECTOS
// -----------------------------------------------------

app.get(
    "/api/proyectos",
    requiereSesion,
    async (req, res) => {

        try {

            const resultado =
                await pool.query(`

                    SELECT
                        p.id,
                        p.codigo,
                        p.nombre,
                        p.tipo,
                        p.sede,
                        p.tipo_cable

                    FROM proyectos p

                    ORDER BY p.id DESC

                `);

            res.json(
                resultado.rows
            );

        }

        catch (error) {

            console.error(
                "Error al obtener proyectos:",
                error
            );

            res.status(500).json({
                error:
                    "No se pudieron obtener los proyectos"
            });

        }

    }
);

// -----------------------------------------------------
// OBTENER UN PROYECTO
// -----------------------------------------------------

app.get(
    "/api/proyectos/:id",
    requiereSesion,
    async (req, res) => {

        try {

            const { id } =
                req.params;


            const resultado =
                await pool.query(`

                    SELECT

                        p.id,
                        p.nombre,
                        p.cuadrilla_id,

                        c.nombre AS cuadrilla,

                        p.responsable,
                        p.fecha,
                        p.estado

                    FROM proyectos p

                    LEFT JOIN cuadrillas c
                        ON p.cuadrilla_id = c.id

                    WHERE p.id = $1

                `, [id]);


            if (
                resultado.rows.length === 0
            ) {

                return res.status(404).json({

                    error:
                        "Proyecto no encontrado"

                });

            }


            res.json(
                resultado.rows[0]
            );

        }

        catch (error) {

            console.error(
                "Error al obtener proyecto:",
                error
            );

            res.status(500).json({

                error:
                    "No se pudo obtener el proyecto"

            });

        }

    }
);


// -----------------------------------------------------
// REGISTRAR PROYECTO
// -----------------------------------------------------

app.post(
    "/api/proyectos",
    requiereSesion,
    async (req, res) => {

        try {

            const {

                nombre,
                cuadrilla,
                responsable,
                fecha,
                estado

            } = req.body;


            if (!nombre) {

                return res.status(400).json({

                    error:
                        "El nombre del proyecto es obligatorio"

                });

            }


            const resultado =
                await pool.query(`

                    INSERT INTO proyectos

                    (
                        nombre,
                        cuadrilla_id,
                        responsable,
                        fecha,
                        estado
                    )

                    VALUES

                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5
                    )

                    RETURNING *

                `, [

                    nombre.trim(),

                    cuadrilla || null,

                    responsable
                        ? responsable.trim()
                        : null,

                    fecha || null,

                    estado || "Pendiente"

                ]);


            res.status(201).json({

                mensaje:
                    "Proyecto registrado correctamente",

                proyecto:
                    resultado.rows[0]

            });

        }

        catch (error) {

            console.error(
                "Error al registrar proyecto:",
                error
            );

            res.status(500).json({

                error:
                    "No se pudo registrar el proyecto"

            });

        }

    }
);


// =====================================================
// =====================================================
// MANTENIMIENTOS
// =====================================================
// =====================================================


// -----------------------------------------------------
// OBTENER MANTENIMIENTOS
// -----------------------------------------------------

app.get(
    "/api/mantenimientos",
    requiereSesion,
    async (req, res) => {

        try {

            const resultado =
                await pool.query(`

                    SELECT

                        m.id,
                        m.fecha,
                        m.proyecto_id,

                        p.nombre AS proyecto,

                        m.cuadrilla_id,

                        c.nombre AS cuadrilla,

                        m.trabajo,
                        m.estado

                    FROM mantenimientos m

                    LEFT JOIN proyectos p
                        ON m.proyecto_id = p.id

                    LEFT JOIN cuadrillas c
                        ON m.cuadrilla_id = c.id

                    ORDER BY
                        m.id DESC

                `);


            res.json(
                resultado.rows
            );

        }

        catch (error) {

            console.error(
                "Error al obtener mantenimientos:",
                error
            );

            res.status(500).json({

                error:
                    "No se pudieron obtener los mantenimientos"

            });

        }

    }
);


// -----------------------------------------------------
// REGISTRAR MANTENIMIENTO
// -----------------------------------------------------

app.post(
    "/api/mantenimientos",
    requiereSesion,
    async (req, res) => {

        try {

            const {

                fecha,
                proyecto,
                proyecto_id,
                cuadrilla,
                trabajo,
                estado

            } = req.body;


            if (
                !fecha ||
                !trabajo
            ) {

                return res.status(400).json({

                    error:
                        "Fecha y descripción del trabajo son obligatorios"

                });

            }


            let proyectoIdFinal =
                proyecto_id || null;


            if (
                !proyectoIdFinal &&
                proyecto
            ) {

                const proyectoEncontrado =
                    await pool.query(`

                        SELECT id

                        FROM proyectos

                        WHERE nombre = $1

                        LIMIT 1

                    `, [proyecto]);


                if (
                    proyectoEncontrado.rows.length > 0
                ) {

                    proyectoIdFinal =
                        proyectoEncontrado.rows[0].id;

                }

            }


            const resultado =
                await pool.query(`

                    INSERT INTO mantenimientos

                    (
                        fecha,
                        proyecto_id,
                        cuadrilla_id,
                        trabajo,
                        estado
                    )

                    VALUES

                    (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5
                    )

                    RETURNING *

                `, [

                    fecha,

                    proyectoIdFinal,

                    cuadrilla || null,

                    trabajo.trim(),

                    estado || "Pendiente"

                ]);


            res.status(201).json({

                mensaje:
                    "Mantenimiento registrado correctamente",

                mantenimiento:
                    resultado.rows[0]

            });

        }

        catch (error) {

            console.error(
                "Error al registrar mantenimiento:",
                error
            );

            res.status(500).json({

                error:
                    "No se pudo registrar el mantenimiento"

            });

        }

    }
);


// =====================================================
// =====================================================
// MATERIALES
// =====================================================
// =====================================================


// -----------------------------------------------------
// OBTENER MATERIALES
// -----------------------------------------------------

app.get(
    "/api/materiales",
    requiereSesion,
    async (req, res) => {

        try {

            const resultado =
                await pool.query(`

                    SELECT

                        m.id,
                        m.material,
                        m.cantidad,
                        m.unidad,
                        m.proyecto_id,

                        p.nombre AS proyecto

                    FROM materiales m

                    LEFT JOIN proyectos p
                        ON m.proyecto_id = p.id

                    ORDER BY
                        m.id DESC

                `);


            res.json(
                resultado.rows
            );

        }

        catch (error) {

            console.error(
                "Error al obtener materiales:",
                error
            );

            res.status(500).json({

                error:
                    "No se pudieron obtener los materiales"

            });

        }

    }
);


// -----------------------------------------------------
// OBTENER MATERIALES DE UN PROYECTO
// -----------------------------------------------------

app.get(
    "/api/proyectos/:id/materiales",
    requiereSesion,
    async (req, res) => {

        try {

            const { id } =
                req.params;


            const resultado =
                await pool.query(`

                    SELECT

                        id,
                        material,
                        cantidad,
                        unidad,
                        proyecto_id

                    FROM materiales

                    WHERE proyecto_id = $1

                    ORDER BY
                        id DESC

                `, [id]);


            res.json(
                resultado.rows
            );

        }

        catch (error) {

            console.error(
                "Error al obtener materiales:",
                error
            );

            res.status(500).json({

                error:
                    "No se pudieron obtener los materiales"

            });

        }

    }
);


// -----------------------------------------------------
// REGISTRAR UN MATERIAL
// -----------------------------------------------------

app.post(
    "/api/materiales",
    requiereSesion,
    async (req, res) => {

        try {

            const {

                material,
                cantidad,
                unidad,
                proyecto_id

            } = req.body;


            if (!material) {

                return res.status(400).json({

                    error:
                        "El material es obligatorio"

                });

            }


            if (
                cantidad === undefined ||
                cantidad === null ||
                cantidad === ""
            ) {

                return res.status(400).json({

                    error:
                        "La cantidad es obligatoria"

                });

            }


            if (!unidad) {

                return res.status(400).json({

                    error:
                        "La unidad es obligatoria"

                });

            }


            if (!proyecto_id) {

                return res.status(400).json({

                    error:
                        "Debe seleccionar un proyecto"

                });

            }


            const proyecto =
                await pool.query(`

                    SELECT id

                    FROM proyectos

                    WHERE id = $1

                `, [proyecto_id]);


            if (
                proyecto.rows.length === 0
            ) {

                return res.status(404).json({

                    error:
                        "El proyecto seleccionado no existe"

                });

            }


            const cantidadNumero =
                Number(cantidad);


            if (
                Number.isNaN(cantidadNumero) ||
                cantidadNumero <= 0
            ) {

                return res.status(400).json({

                    error:
                        "La cantidad debe ser mayor que 0"

                });

            }


            const resultado =
                await pool.query(`

                    INSERT INTO materiales

                    (
                        material,
                        cantidad,
                        unidad,
                        proyecto_id
                    )

                    VALUES

                    (
                        $1,
                        $2,
                        $3,
                        $4
                    )

                    RETURNING *

                `, [

                    material.trim(),

                    cantidadNumero,

                    unidad.trim(),

                    proyecto_id

                ]);


            res.status(201).json({

                mensaje:
                    "Material registrado correctamente",

                material:
                    resultado.rows[0]

            });

        }

        catch (error) {

            console.error(
                "Error al registrar material:",
                error
            );

            res.status(500).json({

                error:
                    "No se pudo registrar el material"

            });

        }

    }
);


// -----------------------------------------------------
// REGISTRAR VARIOS MATERIALES
// -----------------------------------------------------

app.post(
    "/api/materiales/varios",
    requiereSesion,
    async (req, res) => {

        const client =
            await pool.connect();


        try {

            const {

                proyecto_id,
                materiales

            } = req.body;


            if (!proyecto_id) {

                client.release();

                return res.status(400).json({

                    error:
                        "Debe seleccionar un proyecto"

                });

            }


            if (
                !Array.isArray(materiales) ||
                materiales.length === 0
            ) {

                client.release();

                return res.status(400).json({

                    error:
                        "Debe ingresar al menos un material"

                });

            }


            const proyecto =
                await client.query(`

                    SELECT id

                    FROM proyectos

                    WHERE id = $1

                `, [proyecto_id]);


            if (
                proyecto.rows.length === 0
            ) {

                client.release();

                return res.status(404).json({

                    error:
                        "El proyecto seleccionado no existe"

                });

            }


            await client.query(
                "BEGIN"
            );


            const materialesRegistrados =
                [];


            for (
                const item of materiales
            ) {

                const nombreMaterial =
                    item.material
                        ? item.material.trim()
                        : "";


                const cantidadNumero =
                    Number(item.cantidad);


                const unidad =
                    item.unidad
                        ? item.unidad.trim()
                        : "";


                if (!nombreMaterial) {

                    throw new Error(
                        "Todos los materiales deben tener nombre"
                    );

                }


                if (
                    Number.isNaN(cantidadNumero) ||
                    cantidadNumero <= 0
                ) {

                    throw new Error(
                        "Todas las cantidades deben ser mayores que 0"
                    );

                }


                if (!unidad) {

                    throw new Error(
                        "Todos los materiales deben tener unidad"
                    );

                }


                const resultado =
                    await client.query(`

                        INSERT INTO materiales

                        (
                            material,
                            cantidad,
                            unidad,
                            proyecto_id
                        )

                        VALUES

                        (
                            $1,
                            $2,
                            $3,
                            $4
                        )

                        RETURNING *

                    `, [

                        nombreMaterial,

                        cantidadNumero,

                        unidad,

                        proyecto_id

                    ]);


                materialesRegistrados.push(
                    resultado.rows[0]
                );

            }


            await client.query(
                "COMMIT"
            );


            res.status(201).json({

                mensaje:
                    "Materiales registrados correctamente",

                materiales:
                    materialesRegistrados

            });

        }

        catch (error) {

            await client.query(
                "ROLLBACK"
            );


            console.error(
                "Error al registrar varios materiales:",
                error
            );


            res.status(500).json({

                error:
                    error.message ||
                    "No se pudieron registrar los materiales"

            });

        }

        finally {

            client.release();

        }

    }
);


// =====================================================
// =====================================================
// DASHBOARD
// =====================================================
// =====================================================

app.get(
    "/api/dashboard",
    requiereSesion,
    async (req, res) => {

        try {

            const personal =
                await pool.query(`

                    SELECT COUNT(*) AS total

                    FROM personal

                `);


            const cuadrillas =
                await pool.query(`

                    SELECT COUNT(*) AS total

                    FROM cuadrillas

                `);


            const proyectos =
                await pool.query(`

                    SELECT COUNT(*) AS total

                    FROM proyectos

                `);


            const mantenimientos =
                await pool.query(`

                    SELECT COUNT(*) AS total

                    FROM mantenimientos

                `);


            const personalCuadrillas =
                await pool.query(`

                    SELECT

                        c.id,
                        c.nombre,

                        COUNT(p.id) AS cantidad

                    FROM cuadrillas c

                    LEFT JOIN personal p

                        ON p.cuadrilla_id = c.id

                    GROUP BY

                        c.id,
                        c.nombre

                    ORDER BY
                        c.id

                `);


            res.json({

                personal:
                    Number(
                        personal.rows[0].total
                    ),

                cuadrillas:
                    Number(
                        cuadrillas.rows[0].total
                    ),

                proyectos:
                    Number(
                        proyectos.rows[0].total
                    ),

                mantenimientos:
                    Number(
                        mantenimientos.rows[0].total
                    ),

                personalPorCuadrilla:
                    personalCuadrillas.rows

            });

        }

        catch (error) {

            console.error(
                "Error al obtener dashboard:",
                error
            );

            res.status(500).json({

                error:
                    "No se pudo obtener el dashboard"

            });

        }

    }
);


// =====================================================
// RUTA NO ENCONTRADA
// =====================================================

app.use(
    (req, res) => {

        res.status(404).json({

            error:
                "Ruta no encontrada"

        });

    }
);


// =====================================================
// MANEJO GENERAL DE ERRORES
// =====================================================

app.use(
    (error, req, res, next) => {

        console.error(
            "Error general:",
            error
        );


        res.status(500).json({

            error:
                "Error interno del servidor"

        });

    }
);


// =====================================================
// INICIAR SERVIDOR
// =====================================================

app.listen(
    PORT, "0.0.0.0",
    () => {

        console.log("");

        console.log(
            "========================================"
        );

        console.log(
            " SISTEMA DE GESTIÓN DE CUADRILLAS"
        );

        console.log(
            "========================================"
        );

        console.log(
            `Servidor: http://localhost:${PORT}`
        );

        console.log(
            "PostgreSQL: conectado mediante Pool"
        );

        console.log(
            "Base de datos: gestion_cuadrillas"
        );

        console.log(
            "========================================"
        );

        console.log("");

    }
);


// =====================================================
// MANTENER PROCESO ACTIVO
// =====================================================

process.stdin.resume();
