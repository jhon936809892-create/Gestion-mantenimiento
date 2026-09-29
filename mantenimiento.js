
// ============================================================
// MÓDULO MANTENIMIENTO
// ============================================================


// ============================================================
// VARIABLES
// ============================================================

let calendarioMantenimiento = null;


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


        // Guardamos para Dashboard

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
// SELECTOR DE PROYECTOS PARA MANTENIMIENTO
// ============================================================

function cargarSelectProyectos() {

    const inputProyecto =
        document.getElementById(
            "proyectoMantenimiento"
        );


    const resultados =
        document.getElementById(
            "resultadosProyectosMantenimiento"
        );


    if (
        !inputProyecto ||
        !resultados
    ) {

        return;

    }


    inputProyecto.oninput =
        function() {

            const texto =
                inputProyecto.value
                    .trim()
                    .toLowerCase();


            resultados.innerHTML = "";


            inputProyecto.dataset.proyectoId =
                "";


            if (!texto) {

                resultados.style.display =
                    "none";

                return;

            }


            const encontrados =
                proyectos.filter(function(proyecto) {

                    const codigo =
                        String(
                            proyecto.codigo || ""
                        )
                        .toLowerCase();


                    const nombre =
                        String(
                            proyecto.nombre || ""
                        )
                        .toLowerCase();


                    return (
                        codigo.includes(texto) ||
                        nombre.includes(texto)
                    );

                });


            if (
                encontrados.length === 0
            ) {

                resultados.innerHTML = `

                    <div class="sin-resultados-proyecto">
                        No se encontraron proyectos
                    </div>

                `;


                resultados.style.display =
                    "block";


                return;

            }


            encontrados.forEach(function(proyecto) {

                const opcion =
                    document.createElement("div");


                opcion.className =
                    "opcion-proyecto-mantenimiento";


                // Se mantiene mostrando el código

                opcion.textContent =
                    proyecto.codigo || "";


                opcion.addEventListener(
                    "click",
                    function() {

                        seleccionarProyectoMantenimiento(
                            proyecto
                        );

                    }
                );


                resultados.appendChild(opcion);

            });


            resultados.style.display =
                "block";

        };

}


// ============================================================
// SELECCIONAR PROYECTO
// ============================================================

function seleccionarProyectoMantenimiento(proyecto) {

    const input =
        document.getElementById(
            "proyectoMantenimiento"
        );


    const resultados =
        document.getElementById(
            "resultadosProyectosMantenimiento"
        );


    if (!input) {

        return;

    }


    input.value =
        proyecto.codigo || "";


    input.dataset.proyectoId =
        proyecto.id || "";


    if (resultados) {

        resultados.innerHTML =
            "";

        resultados.style.display =
            "none";

    }

}


// ============================================================
// ABRIR LISTA DE PROYECTOS
// ============================================================

function abrirListaProyectosMantenimiento() {

    const input =
        document.getElementById(
            "proyectoMantenimiento"
        );


    const resultados =
        document.getElementById(
            "resultadosProyectosMantenimiento"
        );


    if (
        !input ||
        !resultados
    ) {

        return;

    }


    if (
        resultados.style.display ===
        "block"
    ) {

        resultados.style.display =
            "none";

        return;

    }


    resultados.innerHTML = "";


    if (
        !proyectos ||
        proyectos.length === 0
    ) {

        resultados.innerHTML = `

            <div class="sin-resultados-proyecto">
                No hay proyectos disponibles
            </div>

        `;


        resultados.style.display =
            "block";


        return;

    }


    proyectos.forEach(function(proyecto) {

        const opcion =
            document.createElement("div");


        opcion.className =
            "opcion-proyecto-mantenimiento";


        opcion.textContent =
            proyecto.codigo || "";


        opcion.addEventListener(
            "click",
            function() {

                seleccionarProyectoMantenimiento(
                    proyecto
                );

            }
        );


        resultados.appendChild(opcion);

    });


    resultados.style.display =
        "block";

}


// ============================================================
// ABRIR MODAL MANTENIMIENTO
// ============================================================

async function abrirModalMantenimiento() {

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


        const modal =
            document.getElementById(
                "modalMantenimiento"
            );


        if (modal) {

            modal.classList.remove(
                "active"
            );

        }


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


        await cargarMantenimientos();


        if (calendarioMantenimiento) {

            calendarioMantenimiento.refetchEvents();

        }


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

