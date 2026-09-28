// =====================================================
// MÓDULO MANTENIMIENTO
// =====================================================

// =====================================================
// VARIABLES
// =====================================================

let proyectos = [];

let calendarioMantenimiento = null;

let graficoCertificaciones = null;
let graficoAverias = null;
let graficoSplitters = null;
let graficoTrabajoCampo = null;


// =====================================================
// CARGAR PROYECTOS
// =====================================================

async function cargarProyectos() {

    try {

        const respuesta =
            await fetch("/api/proyectos");

        if (!respuesta.ok) {

            throw new Error(
                "Error al obtener proyectos"
            );

        }

        proyectos =
            await respuesta.json();

        console.log(
            "Proyectos cargados:",
            proyectos
        );


        // =========================================
        // TABLA DE PROYECTOS
        // =========================================

        const tabla =
            document.getElementById(
                "tablaProyectos"
            );

        if (tabla) {

            tabla.innerHTML = "";

            proyectos.forEach(
                function(proyecto) {

                    const fila =
                        document.createElement(
                            "tr"
                        );

                    fila.innerHTML = `

                        <td>
                            ${proyecto.nombre || ""}
                        </td>

                        <td>
                            ${proyecto.codigo || ""}
                        </td>

                        <td>
                            ${proyecto.tipo || ""}
                        </td>

                        <td>
                            ${proyecto.sede || ""}
                        </td>

                        <td>
                            ${proyecto.tipo_cable || ""}
                        </td>

                    `;

                    tabla.appendChild(
                        fila
                    );

                }
            );

        }


        // =========================================
        // CONTADOR DE PROYECTOS
        // =========================================

        const total =
            document.getElementById(
                "totalProyectos"
            );

        if (total) {

            total.textContent =
                proyectos.length;

        }


        // =========================================
        // SELECTOR DE PROYECTO
        // =========================================

        cargarSelectProyectos();


    }
    catch (error) {

        console.error(
            "Error cargando proyectos:",
            error
        );

    }

}


// =====================================================
// CONFIGURAR SELECTOR DE PROYECTOS
// =====================================================

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


    inputProyecto.value = "";

    inputProyecto.dataset.proyectoId = "";

    resultados.innerHTML = "";

    resultados.style.display = "none";


    // =========================================
    // BUSCAR MIENTRAS ESCRIBE
    // =========================================

    inputProyecto.oninput =
        function() {

            const texto =
                inputProyecto.value
                    .trim()
                    .toLowerCase();

            resultados.innerHTML = "";

            inputProyecto.dataset.proyectoId = "";


            if (!texto) {

                resultados.style.display =
                    "none";

                return;

            }


            const proyectosFiltrados =
                proyectos.filter(
                    function(proyecto) {

                        return (
                            proyecto.codigo &&
                            proyecto.codigo
                                .toLowerCase()
                                .includes(texto)
                        );

                    }
                );


            if (
                proyectosFiltrados.length === 0
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


            proyectosFiltrados.forEach(
                function(proyecto) {

                    const opcion =
                        document.createElement(
                            "div"
                        );

                    opcion.className =
                        "opcion-proyecto-mantenimiento";

                    opcion.textContent =
                        proyecto.codigo;


                    opcion.addEventListener(
                        "click",
                        function() {

                            seleccionarProyectoMantenimiento(
                                proyecto
                            );

                        }
                    );


                    resultados.appendChild(
                        opcion
                    );

                }
            );


            resultados.style.display =
                "block";

        };

}


// =====================================================
// SELECCIONAR PROYECTO
// =====================================================

function seleccionarProyectoMantenimiento(
    proyecto
) {

    const inputProyecto =
        document.getElementById(
            "proyectoMantenimiento"
        );

    const resultados =
        document.getElementById(
            "resultadosProyectosMantenimiento"
        );

    if (!inputProyecto) {

        return;

    }


    inputProyecto.value =
        proyecto.codigo || "";

    inputProyecto.dataset.proyectoId =
        proyecto.id || "";


    if (resultados) {

        resultados.innerHTML = "";

        resultados.style.display =
            "none";

    }

}


// =====================================================
// MOSTRAR TODOS LOS PROYECTOS
// =====================================================

function abrirListaProyectosMantenimiento() {

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


    // =========================================
    // SI ESTÁ ABIERTA, CERRARLA
    // =========================================

    if (
        resultados.style.display === "block"
    ) {

        resultados.style.display =
            "none";

        return;

    }


    resultados.innerHTML = "";


    // =========================================
    // NO HAY PROYECTOS
    // =========================================

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


    // =========================================
    // MOSTRAR TODOS
    // =========================================

    proyectos.forEach(
        function(proyecto) {

            const opcion =
                document.createElement(
                    "div"
                );

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


            resultados.appendChild(
                opcion
            );

        }
    );


    resultados.style.display =
        "block";

}


// =====================================================
// CARGAR MANTENIMIENTOS
// =====================================================

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


        console.log(
            "Mantenimientos cargados:",
            mantenimientos
        );


        // =========================================
        // TABLA
        // =========================================

        const tabla =
            document.getElementById(
                "tablaMantenimiento"
            );


        if (tabla) {

            tabla.innerHTML = "";


            mantenimientos.forEach(
                function(mantenimiento) {

                    const fila =
                        document.createElement(
                            "tr"
                        );


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

                            console.error(
                                error
                            );

                        }

                    }


                    fila.innerHTML = `

                        <td>
                            ${fecha}
                        </td>

                        <td>
                            ${mantenimiento.proyecto || ""}
                        </td>

                        <td>
                            ${mantenimiento.sede || ""}
                        </td>

                        <td>
                            ${mantenimiento.trabajo || mantenimiento.descripcion || ""}
                        </td>

                        <td>
                            ${mantenimiento.estado || ""}
                        </td>

                    `;


                    tabla.appendChild(
                        fila
                    );

                }
            );

        }


        // =========================================
        // CONTADOR DASHBOARD
        // =========================================

        const total =
            document.getElementById(
                "totalMantenimientos"
            );


        if (total) {

            total.textContent =
                mantenimientos.length;

        }


        // =========================================
        // ACTUALIZAR CALENDARIO
        // =========================================

        if (calendarioMantenimiento) {

            calendarioMantenimiento.refetchEvents();

        }


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


// =====================================================
// INICIALIZAR CALENDARIO
// =====================================================

function inicializarCalendarioMantenimiento() {

    const calendario =
        document.getElementById(
            "calendarioMantenimiento"
        );


    if (!calendario) {

        return;

    }


    // Ya existe
    if (calendarioMantenimiento) {

        return;

    }


    // FullCalendar no cargó
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
            calendario,
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
                                    "No se pudieron cargar los mantenimientos"
                                );

                            }


                            const mantenimientos =
                                await respuesta.json();


                            const eventos =
                                mantenimientos.map(
                                    function(
                                        mantenimiento
                                    ) {

                                        return {

                                            id:
                                                String(
                                                    mantenimiento.id
                                                ),

                                            title:
                                                `${mantenimiento.proyecto || "Sin proyecto"} - Cuadrilla ${mantenimiento.cuadrilla || ""}`,

                                            start:
                                                mantenimiento.fecha,

                                            allDay:
                                                true,

                                            extendedProps: {

                                                proyecto:
                                                    mantenimiento.proyecto || "",

                                                sede:
                                                    mantenimiento.sede || "",

                                                cuadrilla:
                                                    mantenimiento.cuadrilla || "",

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
                                "Error cargando eventos:",
                                error
                            );

                            failureCallback(
                                error
                            );

                        }

                    },


                // =================================
                // CLICK EN EVENTO
                // =================================

                eventClick:
                    function(info) {

                        const evento =
                            info.event;


                        const datos =
                            evento.extendedProps;


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


// =====================================================
// ABRIR MODAL MANTENIMIENTO
// =====================================================

async function abrirModalMantenimiento() {

    await cargarProyectos();


    const modal =
        document.getElementById(
            "modalMantenimiento"
        );


    if (!modal) {

        console.error(
            "No se encontró el modal de mantenimiento."
        );

        return;

    }


    // Limpiar datos anteriores
    const formulario =
        modal.querySelector(
            "form"
        );


    if (formulario) {

        formulario.reset();

    }


    const inputProyecto =
        document.getElementById(
            "proyectoMantenimiento"
        );


    if (inputProyecto) {

        inputProyecto.value = "";

        inputProyecto.dataset.proyectoId =
            "";

    }


    const resultados =
        document.getElementById(
            "resultadosProyectosMantenimiento"
        );


    if (resultados) {

        resultados.innerHTML = "";

        resultados.style.display =
            "none";

    }


    modal.classList.add(
        "active"
    );

}


// =====================================================
// CANCELAR MANTENIMIENTO
// =====================================================

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


    const inputProyecto =
        document.getElementById(
            "proyectoMantenimiento"
        );


    if (inputProyecto) {

        inputProyecto.value = "";

        inputProyecto.dataset.proyectoId =
            "";

    }


    const resultados =
        document.getElementById(
            "resultadosProyectosMantenimiento"
        );


    if (resultados) {

        resultados.innerHTML = "";

        resultados.style.display =
            "none";

    }


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


// =====================================================
// REGISTRAR MANTENIMIENTO
// =====================================================

async function registrarMantenimiento(
    event
) {

    event.preventDefault();


    // =========================================
    // OBTENER DATOS
    // =========================================

    const inputFecha =
        document.getElementById(
            "inicioMantenimiento"
        );


    const inputProyecto =
        document.getElementById(
            "proyectoMantenimiento"
        );


    const inputCuadrilla =
        document.getElementById(
            "cuadrillaMantenimiento"
        );


    const inputTrabajo =
        document.getElementById(
            "trabajoMantenimiento"
        );


    const inputEstado =
        document.getElementById(
            "estadoMantenimiento"
        );


    const inputTipo =
        document.getElementById(
            "tipoMantenimiento"
        );


    if (
        !inputFecha ||
        !inputProyecto ||
        !inputCuadrilla ||
        !inputTrabajo ||
        !inputEstado ||
        !inputTipo
    ) {

        console.error(
            "Faltan elementos del formulario de mantenimiento."
        );

        return;

    }


    const fecha =
        inputFecha.value;


    const proyectoId =
        Number(
            inputProyecto.dataset.proyectoId
        );


    const cuadrilla =
        inputCuadrilla.value;


    const trabajo =
        inputTrabajo.value.trim();


    const estado =
        inputEstado.value;


    const tipoMantenimiento =
        inputTipo.value;


    // =========================================
    // VALIDACIONES
    // =========================================

    if (!fecha) {

        alert(
            "Debe seleccionar la fecha y hora del mantenimiento."
        );

        return;

    }


    if (!proyectoId) {

        alert(
            "Debe seleccionar un proyecto."
        );

        return;

    }


    if (!cuadrilla) {

        alert(
            "Debe seleccionar una cuadrilla."
        );

        return;

    }


    if (!tipoMantenimiento) {

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


    // =========================================
    // DATOS PARA SERVER.JS
    // =========================================

    const datos = {

        fecha:
            fecha,

        proyecto_id:
            proyectoId,

        cuadrilla:
            cuadrilla,

        trabajo:
            trabajo,

        estado:
            estado,

        tipo_mantenimiento:
            tipoMantenimiento

    };


    console.log(
        "Registrando mantenimiento:",
        datos
    );


    try {

        const respuesta =
            await fetch(
                "/api/mantenimientos",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            datos
                        )

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


        // =========================================
        // ÉXITO
        // =========================================

        alert(
            "Mantenimiento registrado correctamente."
        );


        // =========================================
        // CERRAR MODAL
        // =========================================

        const modal =
            document.getElementById(
                "modalMantenimiento"
            );


        if (modal) {

            modal.classList.remove(
                "active"
            );

        }


        // =========================================
        // LIMPIAR FORMULARIO
        // =========================================

        const formulario =
            document.querySelector(
                "#modalMantenimiento form"
            );


        if (formulario) {

            formulario.reset();

        }


        inputProyecto.value = "";

        inputProyecto.dataset.proyectoId =
            "";


        const resultadosProyectos =
            document.getElementById(
                "resultadosProyectosMantenimiento"
            );


        if (resultadosProyectos) {

            resultadosProyectos.innerHTML =
                "";

            resultadosProyectos.style.display =
                "none";

        }


        // =========================================
        // RECARGAR TABLA
        // =========================================

        await cargarMantenimientos();


        // =========================================
        // ACTUALIZAR CALENDARIO
        // =========================================

        if (calendarioMantenimiento) {

            calendarioMantenimiento.refetchEvents();

        }

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


// =====================================================
// CERRAR LISTA DE PROYECTOS AL HACER CLICK AFUERA
// =====================================================

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


// =====================================================
// MOSTRAR SECCIÓN
// =====================================================

function mostrarSeccion(
    seccion,
    boton
) {

    // =========================================
    // OCULTAR TODAS
    // =========================================

    document
        .querySelectorAll(
            ".seccion"
        )
        .forEach(
            function(elemento) {

                elemento.classList.remove(
                    "activa"
                );

            }
        );


    // =========================================
    // MOSTRAR SECCIÓN SELECCIONADA
    // =========================================

    const seleccionada =
        document.getElementById(
            seccion
        );


    if (seleccionada) {

        seleccionada.classList.add(
            "activa"
        );

    }


    // =========================================
    // MENÚ ACTIVO
    // =========================================

    document
        .querySelectorAll(
            ".menu"
        )
        .forEach(
            function(menu) {

                menu.classList.remove(
                    "active"
                );

            }
        );


    if (boton) {

        boton.classList.add(
            "active"
        );

    }


    // =========================================
    // TÍTULO
    // =========================================

    const titulo =
        document.getElementById(
            "titulo"
        );


    if (titulo) {

        const titulos = {

            dashboard:
                "Dashboard",

            personal:
                "Personal",

            cuadrillas:
                "Cuadrillas",

            proyectos:
                "Proyectos",

            mantenimiento:
                "Mantenimiento",

            materiales:
                "Materiales"

        };


        titulo.textContent =
            titulos[seccion] ||
            seccion;

    }


    // =========================================
    // MANTENIMIENTO
    // =========================================

    if (
        seccion ===
        "mantenimiento"
    ) {

        cargarProyectos();

        cargarMantenimientos();


        setTimeout(
            function() {

                inicializarCalendarioMantenimiento();


                if (
                    calendarioMantenimiento
                ) {

                    calendarioMantenimiento.updateSize();

                    calendarioMantenimiento.refetchEvents();

                }

            },
            150
        );

    }

}


// =====================================================
// INICIALIZACIÓN
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "Sistema cargado."
        );


        // =========================================
        // CARGAR PROYECTOS
        // =========================================

        await cargarProyectos();


        // =========================================
        // CARGAR MANTENIMIENTOS
        // =========================================

        await cargarMantenimientos();


        // =========================================
        // CALENDARIO
        // =========================================

        inicializarCalendarioMantenimiento();

    }
);


// =====================================================
// ACTUALIZAR CALENDARIO AL CAMBIAR TAMAÑO
// =====================================================

window.addEventListener(
    "resize",
    function() {

        if (
            calendarioMantenimiento
        ) {

            calendarioMantenimiento.updateSize();

        }

    }
);
