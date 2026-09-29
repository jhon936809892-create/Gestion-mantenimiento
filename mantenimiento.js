
// ============================================================
// SISTEMA DE GESTIÓN DE CUADRILLAS
// MANTENIMIENTO.JS
// ============================================================


// ============================================================
// CARGAR MANTENIMIENTOS
// ============================================================

async function cargarMantenimientos() {

    try {

        const respuesta =
            await fetch(
                "/api/mantenimientos"
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error al obtener mantenimientos"
            );

        }


        const mantenimientos =
            await respuesta.json();


        // ====================================================
        // GUARDAR PARA DASHBOARD
        // ====================================================

        datosMantenimientosDashboard =
            mantenimientos;


        console.log(
            "Mantenimientos:",
            mantenimientos
        );


        // ====================================================
        // TABLA
        // ====================================================

        const tabla =
            document.getElementById(
                "tablaMantenimiento"
            );


        if (tabla) {

            tabla.innerHTML = "";


            mantenimientos.forEach(
                function(mantenimiento) {

                    const fila =
                        document.createElement("tr");


                    let fecha =
                        mantenimiento.fecha || "";


                    if (fecha) {

                        try {

                            fecha =
                                new Date(
                                    fecha
                                ).toLocaleString(
                                    "es-PE"
                                );

                        }
                        catch (error) {

                            console.error(error);

                        }

                    }


                    fila.innerHTML = `

                        <td>
                            ${fecha}
                        </td>

                        <td>
                            ${mantenimiento.codigo || ""}
                        </td>

                        <td>
                            ${mantenimiento.sede || ""}
                        </td>

                        <td>
                            ${
                                mantenimiento.trabajo ||
                                mantenimiento.descripcion ||
                                ""
                            }
                        </td>

                        <td>
                            ${mantenimiento.estado || ""}
                        </td>

                    `;


                    tabla.appendChild(fila);

                }
            );

        }


        // ====================================================
        // TOTAL MANTENIMIENTOS
        // ====================================================

        const total =
            document.getElementById(
                "totalMantenimientos"
            );


        if (total) {

            total.textContent =
                mantenimientos.length;

        }


        // ====================================================
        // CONTADORES DE ESTADO
        // ====================================================

        actualizarContadoresMantenimiento(
            mantenimientos
        );


        // ====================================================
        // ACTUALIZAR DASHBOARD
        // ====================================================

        actualizarDashboard();


        return mantenimientos;

    }
    catch (error) {

        console.error(
            "Error cargando mantenimientos:",
            error
        );


        return [];

    }

}


// ============================================================
// CONTADORES DE MANTENIMIENTO
// ============================================================

function actualizarContadoresMantenimiento(
    mantenimientos
) {

    if (!Array.isArray(mantenimientos)) {

        return;

    }


    let pendientes = 0;
    let enProceso = 0;
    let terminados = 0;


    mantenimientos.forEach(
        function(mantenimiento) {

            const estado =
                String(
                    mantenimiento.estado || ""
                )
                .trim()
                .toLowerCase();


            if (
                estado === "pendiente"
            ) {

                pendientes++;

            }


            else if (
                estado === "en proceso"
            ) {

                enProceso++;

            }


            else if (
                estado === "terminado"
            ) {

                terminados++;

            }

        }
    );


    // ========================================================
    // IDs PRINCIPALES DEL DASHBOARD
    // ========================================================

    const elementosPendientes = [

        "mantenimientosPendientes",
        "totalMantenimientosPendientes",
        "mantenimientoPendientes"

    ];


    const elementosProceso = [

        "mantenimientosEnProceso",
        "totalMantenimientosEnProceso",
        "mantenimientoEnProceso"

    ];


    const elementosTerminados = [

        "mantenimientosTerminados",
        "totalMantenimientosTerminados",
        "mantenimientoTerminados"

    ];


    actualizarPrimerElemento(
        elementosPendientes,
        pendientes
    );


    actualizarPrimerElemento(
        elementosProceso,
        enProceso
    );


    actualizarPrimerElemento(
        elementosTerminados,
        terminados
    );

}


// ============================================================
// ACTUALIZAR PRIMER ELEMENTO ENCONTRADO
// ============================================================

function actualizarPrimerElemento(
    ids,
    valor
) {

    for (
        let i = 0;
        i < ids.length;
        i++
    ) {

        const elemento =
            document.getElementById(
                ids[i]
            );


        if (elemento) {

            elemento.textContent =
                valor;

            return;

        }

    }

}


// ============================================================
// ABRIR MODAL MANTENIMIENTO
// ============================================================

async function abrirModalMantenimiento() {

    // ========================================================
    // ACTUALIZAR PROYECTOS
    // ========================================================

    await cargarProyectos();


    const modal =
        document.getElementById(
            "modalMantenimiento"
        );


    if (!modal) {

        console.error(
            "No se encontró modalMantenimiento"
        );

        return;

    }


    const formulario =
        modal.querySelector("form");


    if (formulario) {

        formulario.reset();

    }


    const proyecto =
        document.getElementById(
            "proyectoMantenimiento"
        );


    if (proyecto) {

        proyecto.value = "";

        proyecto.dataset.proyectoId =
            "";

    }


    const resultados =
        document.getElementById(
            "resultadosProyectosMantenimiento"
        );


    if (resultados) {

        resultados.innerHTML =
            "";

        resultados.style.display =
            "none";

    }


    modal.classList.add("active");

}


// ============================================================
// CANCELAR MANTENIMIENTO
// ============================================================

function cancelarMantenimiento() {

    const modal =
        document.getElementById(
            "modalMantenimiento"
        );


    const formulario =
        document.querySelector(
            "#modalMantenimiento form"
        );


    if (formulario) {

        formulario.reset();

    }


    const proyecto =
        document.getElementById(
            "proyectoMantenimiento"
        );


    if (proyecto) {

        proyecto.value = "";

        proyecto.dataset.proyectoId =
            "";

    }


    const resultados =
        document.getElementById(
            "resultadosProyectosMantenimiento"
        );


    if (resultados) {

        resultados.innerHTML =
            "";

        resultados.style.display =
            "none";

    }


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


// ============================================================
// REGISTRAR MANTENIMIENTO
// ============================================================

async function registrarMantenimiento(event) {

    event.preventDefault();


    const fecha =
        document.getElementById(
            "inicioMantenimiento"
        ).value;


    const proyectoInput =
        document.getElementById(
            "proyectoMantenimiento"
        );


    const proyectoId =
        Number(
            proyectoInput.dataset.proyectoId
        );


    const cuadrilla =
        document.getElementById(
            "cuadrillaMantenimiento"
        ).value;


    const trabajo =
        document.getElementById(
            "trabajoMantenimiento"
        ).value.trim();


    const estado =
        document.getElementById(
            "estadoMantenimiento"
        ).value;


    const tipo =
        document.getElementById(
            "tipoMantenimiento"
        ).value;


    // ========================================================
    // VALIDACIONES
    // ========================================================

    if (!fecha) {

        alert(
            "Debe seleccionar la fecha y hora del mantenimiento."
        );

        return;

    }


    if (!proyectoId) {

        alert(
            "Debe seleccionar un proyecto de la lista."
        );

        return;

    }


    if (!cuadrilla) {

        alert(
            "Debe seleccionar una cuadrilla."
        );

        return;

    }


    if (!tipo) {

        alert(
            "Debe seleccionar un tipo de mantenimiento."
        );

        return;

    }


    if (!trabajo) {

        alert(
            "Debe ingresar la descripción del trabajo."
        );

        return;

    }


    // ========================================================
    // DATOS
    // ========================================================

    const datos = {

        fecha: fecha,

        proyecto_id: proyectoId,

        cuadrilla: cuadrilla,

        trabajo: trabajo,

        estado: estado,

        tipo_mantenimiento: tipo

    };


    console.log(
        "Datos enviados:",
        datos
    );


    // ========================================================
    // ENVIAR AL SERVIDOR
    // ========================================================

    try {

        const respuesta =
            await fetch(
                "/api/mantenimientos",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(datos)

                }
            );


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            alert(
                resultado.error ||
                "No se pudo registrar el mantenimiento."
            );

            return;

        }


        alert(
            "Mantenimiento registrado correctamente."
        );


        // ====================================================
        // CERRAR MODAL
        // ====================================================

        const modal =
            document.getElementById(
                "modalMantenimiento"
            );


        if (modal) {

            modal.classList.remove(
                "active"
            );

        }


        // ====================================================
        // LIMPIAR FORMULARIO
        // ====================================================

        const formulario =
            document.querySelector(
                "#modalMantenimiento form"
            );


        if (formulario) {

            formulario.reset();

        }


        proyectoInput.value = "";

        proyectoInput.dataset.proyectoId =
            "";


        const resultados =
            document.getElementById(
                "resultadosProyectosMantenimiento"
            );


        if (resultados) {

            resultados.innerHTML =
                "";

            resultados.style.display =
                "none";

        }


        // ====================================================
        // ACTUALIZAR TABLA Y DASHBOARD
        // ====================================================

        await cargarMantenimientos();


        // ====================================================
        // ACTUALIZAR CALENDARIO
        // ====================================================

        if (calendarioMantenimiento) {

            calendarioMantenimiento.refetchEvents();

        }


        // ====================================================
        // ACTUALIZAR GRÁFICOS
        // ====================================================

        await cargarGraficosDashboard();

    }
    catch (error) {

        console.error(
            "Error registrando mantenimiento:",
            error
        );


        alert(
            "No se pudo conectar con el servidor."
        );

    }

}


// ============================================================
// CALENDARIO DE MANTENIMIENTO
// ============================================================

function inicializarCalendarioMantenimiento() {

    const elemento =
        document.getElementById(
            "calendarioMantenimiento"
        );


    if (!elemento) {

        return;

    }


    // ========================================================
    // SI YA EXISTE, NO CREAR OTRO
    // ========================================================

    if (calendarioMantenimiento) {

        return;

    }


    if (
        typeof FullCalendar ===
        "undefined"
    ) {

        console.error(
            "FullCalendar no está disponible."
        );

        return;

    }


    calendarioMantenimiento =
        new FullCalendar.Calendar(
            elemento,
            {

                initialView:
                    "dayGridMonth",

                locale:
                    "es",

                height:
                    "auto",


                headerToolbar: {

                    left:
                        "prev,next today",

                    center:
                        "title",

                    right:
                        "dayGridMonth,timeGridWeek,timeGridDay"

                },


                buttonText: {

                    today:
                        "Hoy",

                    month:
                        "Mes",

                    week:
                        "Semana",

                    day:
                        "Día"

                },


                scrollTime:
                    "08:00:00",


                // =================================================
                // EVENTOS
                // =================================================

                events:
                    async function(
                        info,
                        successCallback,
                        failureCallback
                    ) {

                        try {

                            const respuesta =
                                await fetch(
                                    "/api/mantenimientos"
                                );


                            if (!respuesta.ok) {

                                throw new Error(
                                    "Error al cargar mantenimientos"
                                );

                            }


                            const mantenimientos =
                                await respuesta.json();


                            const eventos =
                                mantenimientos.map(
                                    function(mantenimiento) {

                                        return {

                                            id:
                                                String(
                                                    mantenimiento.id
                                                ),


                                            // --------------------------------
                                            // SE MUESTRA EL CÓDIGO
                                            // --------------------------------

                                            title:
                                                `${
                                                    mantenimiento.codigo ||
                                                    "Sin proyecto"
                                                } - Cuadrilla ${
                                                    mantenimiento.cuadrilla ||
                                                    ""
                                                }`,


                                            start:
                                                mantenimiento.fecha,


                                            allDay:
                                                true,


                                            extendedProps: {

                                                proyecto:
                                                    mantenimiento.codigo ||
                                                    "",

                                                sede:
                                                    mantenimiento.sede ||
                                                    "",

                                                cuadrilla:
                                                    mantenimiento.cuadrilla ||
                                                    "",

                                                trabajo:
                                                    mantenimiento.trabajo ||
                                                    mantenimiento.descripcion ||
                                                    "",

                                                estado:
                                                    mantenimiento.estado ||
                                                    "",

                                                tipo:
                                                    mantenimiento.tipo_mantenimiento ||
                                                    ""

                                            }

                                        };

                                    }
                                );


                            successCallback(
                                eventos
                            );

                        }
                        catch (error) {

                            console.error(
                                error
                            );


                            failureCallback(
                                error
                            );

                        }

                    },


                // =================================================
                // CLICK EN EVENTO
                // =================================================

                eventClick:
                    function(info) {

                        const datos =
                            info.event.extendedProps;


                        alert(

                            "Proyecto: " +
                            (
                                datos.proyecto ||
                                "Sin proyecto"
                            ) +

                            "\n\nSede: " +
                            (
                                datos.sede ||
                                "Sin sede"
                            ) +

                            "\n\nCuadrilla: " +
                            (
                                datos.cuadrilla ||
                                "Sin cuadrilla"
                            ) +

                            "\n\nTipo: " +
                            (
                                datos.tipo ||
                                "Sin tipo"
                            ) +

                            "\n\nTrabajo: " +
                            (
                                datos.trabajo ||
                                "Sin descripción"
                            ) +

                            "\n\nEstado: " +
                            (
                                datos.estado ||
                                "Sin estado"
                            )

                        );

                    }

            }
        );


    calendarioMantenimiento.render();

}


// ============================================================
// CERRAR LISTA DE PROYECTOS AL HACER CLICK AFUERA
// ============================================================

document.addEventListener(
    "click",
    function(event) {

        const contenedor =
            document.querySelector(
                ".buscador-proyecto-mantenimiento"
            );


        const resultados =
            document.getElementById(
                "resultadosProyectosMantenimiento"
            );


        if (
            !contenedor ||
            !resultados
        ) {

            return;

        }


        if (
            !contenedor.contains(
                event.target
            )
        ) {

            resultados.style.display =
                "none";

        }

    }
);


// ============================================================
// ACTUALIZAR CALENDARIO AL CAMBIAR TAMAÑO
// ============================================================

window.addEventListener(
    "resize",
    function() {

        if (calendarioMantenimiento) {

            calendarioMantenimiento.updateSize();

        }

    }
);
