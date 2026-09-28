// ============================================================
// SISTEMA DE GESTIÓN DE CUADRILLAS
// SCRIPT.JS
// ============================================================


// ============================================================
// VARIABLES GENERALES
// ============================================================

let proyectos = [];

let calendarioMantenimiento = null;

let graficoCertificaciones = null;
let graficoAverias = null;
let graficoSplitters = null;
let graficoTrabajoCampo = null;


// ============================================================
// FUNCIONES GENERALES
// ============================================================

function cerrarModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {
        modal.classList.remove("active");
    }

}


// ============================================================
// MOSTRAR SECCIÓN
// ============================================================

function mostrarSeccion(seccion, boton) {

    document
        .querySelectorAll(".seccion")
        .forEach(function(elemento) {

            elemento.classList.remove("activa");

        });


    const seleccionada =
        document.getElementById(seccion);

    if (seleccionada) {

        seleccionada.classList.add("activa");

    }


    document
        .querySelectorAll(".menu")
        .forEach(function(menu) {

            menu.classList.remove("active");

        });


    if (boton) {

        boton.classList.add("active");

    }


    const titulo =
        document.getElementById("titulo");


    const titulos = {

        dashboard: "Dashboard",
        personal: "Personal",
        cuadrillas: "Cuadrillas",
        proyectos: "Lista de Proyectos",
        mantenimiento: "Mantenimiento",
        materiales: "Materiales"

    };


    if (titulo) {

        titulo.textContent =
            titulos[seccion] || seccion;

    }


    // ========================================================
    // CARGAR MÓDULO MANTENIMIENTO
    // ========================================================

    if (seccion === "mantenimiento") {

        cargarProyectos();

        cargarMantenimientos();


        setTimeout(function() {

            inicializarCalendarioMantenimiento();

            if (calendarioMantenimiento) {

                calendarioMantenimiento.updateSize();

                calendarioMantenimiento.refetchEvents();

            }

        }, 150);

    }


    // ========================================================
    // CARGAR PROYECTOS
    // ========================================================

    if (seccion === "proyectos") {

        cargarProyectos();

    }


    // ========================================================
    // CARGAR PERSONAL
    // ========================================================

    if (seccion === "personal") {

        if (typeof cargarPersonal === "function") {

            cargarPersonal();

        }

    }


    // ========================================================
    // CARGAR MATERIALES
    // ========================================================

    if (seccion === "materiales") {

        if (typeof cargarMateriales === "function") {

            cargarMateriales();

        }

    }

}


// ============================================================
// PROYECTOS
// ============================================================

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


        // ====================================================
        // TABLA PROYECTOS
        // ====================================================

        const tabla =
            document.getElementById(
                "tablaProyectos"
            );


        if (tabla) {

            tabla.innerHTML = "";


            proyectos.forEach(function(proyecto) {

                const fila =
                    document.createElement("tr");


                fila.innerHTML = `

                    <td>
                        ${proyecto.codigo || ""}
                    </td>

                    <td>
                        ${proyecto.nombre || ""}
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


                tabla.appendChild(fila);

            });

        }


        // ====================================================
        // TOTAL PROYECTOS
        // ====================================================

        const total =
            document.getElementById(
                "totalProyectos"
            );


        if (total) {

            total.textContent =
                proyectos.length;

        }


        // ====================================================
        // CONFIGURAR BUSCADOR DE MANTENIMIENTO
        // ====================================================

        cargarSelectProyectos();


    }
    catch (error) {

        console.error(
            "Error cargando proyectos:",
            error
        );

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
            String(proyecto.codigo || "")
                .toLowerCase();

        const nombre =
            String(proyecto.nombre || "")
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
// MANTENIMIENTOS
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
                            ${mantenimiento.proyecto || ""}
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


    // ====================================================
    // VALIDACIONES
    // ====================================================

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
// CALENDARIO
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
                                                    mantenimiento.proyecto ||
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
                                                    mantenimiento.proyecto ||
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


                            successCallback(eventos);

                        }
                        catch (error) {

                            console.error(
                                error
                            );

                            failureCallback(error);

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
// GRÁFICOS DEL DASHBOARD
// ============================================================

async function cargarGraficosDashboard() {

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


        const certificaciones = {};
        const averias = {};
        const splitters = {};
        const trabajoCampo = {};


        mantenimientos.forEach(
            function(mantenimiento) {

                const sede =
                    mantenimiento.sede ||
                    "Sin sede";


                const tipo =
                    mantenimiento.tipo_mantenimiento ||
                    "";


                if (
                    tipo ===
                    "Certificación"
                ) {

                    certificaciones[sede] =
                        (
                            certificaciones[sede] ||
                            0
                        ) + 1;

                }


                if (
                    tipo ===
                    "Avería"
                ) {

                    averias[sede] =
                        (
                            averias[sede] ||
                            0
                        ) + 1;

                }


                if (
                    tipo ===
                    "Cambio de splitter"
                ) {

                    splitters[sede] =
                        (
                            splitters[sede] ||
                            0
                        ) + 1;

                }


                if (
                    tipo ===
                    "Trabajo en campo"
                ) {

                    trabajoCampo[sede] =
                        (
                            trabajoCampo[sede] ||
                            0
                        ) + 1;

                }

            }
        );


        // ====================================================
        // DESTRUIR GRÁFICOS
        // ====================================================

        if (graficoCertificaciones) {

            graficoCertificaciones.destroy();

            graficoCertificaciones =
                null;

        }


        if (graficoAverias) {

            graficoAverias.destroy();

            graficoAverias =
                null;

        }


        if (graficoSplitters) {

            graficoSplitters.destroy();

            graficoSplitters =
                null;

        }


        if (graficoTrabajoCampo) {

            graficoTrabajoCampo.destroy();

            graficoTrabajoCampo =
                null;

        }


        // ====================================================
        // CERTIFICACIONES
        // ====================================================

        const canvasCertificaciones =
            document.getElementById(
                "graficoCertificaciones"
            );


        if (
            canvasCertificaciones &&
            typeof Chart !== "undefined"
        ) {

            graficoCertificaciones =
                new Chart(
                    canvasCertificaciones,
                    {

                        type: "pie",

                        data: {

                            labels:
                                Object.keys(
                                    certificaciones
                                ),

                            datasets: [{

                                data:
                                    Object.values(
                                        certificaciones
                                    )

                            }]

                        },

                        options: {

                            responsive:
                                true,

                            maintainAspectRatio:
                                false

                        }

                    }
                );

        }


        // ====================================================
        // AVERÍAS
        // ====================================================

        const canvasAverias =
            document.getElementById(
                "graficoAverias"
            );


        if (
            canvasAverias &&
            typeof Chart !== "undefined"
        ) {

            graficoAverias =
                new Chart(
                    canvasAverias,
                    {

                        type: "pie",

                        data: {

                            labels:
                                Object.keys(
                                    averias
                                ),

                            datasets: [{

                                data:
                                    Object.values(
                                        averias
                                    )

                            }]

                        },

                        options: {

                            responsive:
                                true,

                            maintainAspectRatio:
                                false

                        }

                    }
                );

        }


        // ====================================================
        // SPLITTER
        // ====================================================

        const canvasSplitter =
            document.getElementById(
                "graficoSplitter"
            );


        if (
            canvasSplitter &&
            typeof Chart !== "undefined"
        ) {

            graficoSplitters =
                new Chart(
                    canvasSplitter,
                    {

                        type: "pie",

                        data: {

                            labels:
                                Object.keys(
                                    splitters
                                ),

                            datasets: [{

                                data:
                                    Object.values(
                                        splitters
                                    )

                            }]

                        },

                        options: {

                            responsive:
                                true,

                            maintainAspectRatio:
                                false

                        }

                    }
                );

        }


        // ====================================================
        // TRABAJO EN CAMPO
        // ====================================================

        const canvasTrabajoCampo =
            document.getElementById(
                "graficoTrabajoCampo"
            );


        if (
            canvasTrabajoCampo &&
            typeof Chart !== "undefined"
        ) {

            graficoTrabajoCampo =
                new Chart(
                    canvasTrabajoCampo,
                    {

                        type: "pie",

                        data: {

                            labels:
                                Object.keys(
                                    trabajoCampo
                                ),

                            datasets: [{

                                data:
                                    Object.values(
                                        trabajoCampo
                                    )

                            }]

                        },

                        options: {

                            responsive:
                                true,

                            maintainAspectRatio:
                                false

                        }

                    }
                );

        }

    }
    catch (error) {

        console.error(
            "Error cargando gráficos:",
            error
        );

    }

}


// ============================================================
// PERSONAL
// ============================================================

// Estas funciones se mantienen separadas del módulo
// Mantenimiento para no mezclar su funcionamiento.


async function cargarPersonal() {

    try {

        const respuesta =
            await fetch("/api/personal");


        if (!respuesta.ok) {

            throw new Error(
                "Error al cargar personal"
            );

        }


        const personal =
            await respuesta.json();


        const tabla =
            document.getElementById(
                "tablaPersonal"
            );


        if (!tabla) {

            return;

        }


        tabla.innerHTML = "";


        personal.forEach(function(persona) {

            const fila =
                document.createElement("tr");


            fila.innerHTML = `

                <td>
                    ${persona.nombres || ""}
                </td>

                <td>
                    ${persona.apellidos || ""}
                </td>

                <td>
                    ${
                        persona.documento ||
                        persona.dni ||
                        ""
                    }
                </td>

                <td>
                    ${persona.celular || ""}
                </td>

                <td>
                    ${persona.cargo || ""}
                </td>

                <td>
                    ${
                        persona.cuadrilla ||
                        ""
                    }
                </td>

            `;


            tabla.appendChild(fila);

        });


        const total =
            document.getElementById(
                "totalPersonal"
            );


        if (total) {

            total.textContent =
                personal.length;

        }

    }
    catch (error) {

        console.error(
            "Error cargando personal:",
            error
        );

    }

}


// ============================================================
// ABRIR MODAL PERSONAL
// ============================================================

function abrirModalPersonal() {

    const modal =
        document.getElementById(
            "modalPersonal"
        );


    if (!modal) {

        return;

    }


    const formulario =
        document.getElementById(
            "formPersonal"
        );


    if (formulario) {

        formulario.reset();

    }


    const id =
        document.getElementById(
            "idPersonal"
        );


    if (id) {

        id.value = "";

    }


    const titulo =
        document.getElementById(
            "tituloModalPersonal"
        );


    if (titulo) {

        titulo.textContent =
            "Registrar personal";

    }


    modal.classList.add("active");

}


// ============================================================
// CANCELAR EDICIÓN PERSONAL
// ============================================================

function cancelarEdicionPersonal() {

    const modalConfirmacion =
        document.getElementById(
            "modalConfirmarCancelarPersonal"
        );


    if (modalConfirmacion) {

        modalConfirmacion.classList.add(
            "active"
        );

        return;

    }


    const modal =
        document.getElementById(
            "modalPersonal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


// ============================================================
// CERRAR CONFIRMACIÓN PERSONAL
// ============================================================

function cerrarConfirmacionCancelarPersonal() {

    const modal =
        document.getElementById(
            "modalConfirmarCancelarPersonal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


// ============================================================
// CONFIRMAR CANCELACIÓN PERSONAL
// ============================================================

function confirmarCancelarPersonal() {

    const formulario =
        document.getElementById(
            "formPersonal"
        );


    if (formulario) {

        formulario.reset();

    }


    const modalPersonal =
        document.getElementById(
            "modalPersonal"
        );


    const modalConfirmacion =
        document.getElementById(
            "modalConfirmarCancelarPersonal"
        );


    if (modalPersonal) {

        modalPersonal.classList.remove(
            "active"
        );

    }


    if (modalConfirmacion) {

        modalConfirmacion.classList.remove(
            "active"
        );

    }

}


// ============================================================
// REGISTRAR PERSONAL
// ============================================================

async function registrarPersonal(event) {

    event.preventDefault();


    const datos = {

        nombres:
            document.getElementById(
                "nombresPersonal"
            ).value.trim(),

        apellidos:
            document.getElementById(
                "apellidosPersonal"
            ).value.trim(),

        tipo_documento:
            document.getElementById(
                "tipoDocumentoPersonal"
            ).value,

        documento:
            document.getElementById(
                "documentoPersonal"
            ).value.trim(),

        celular:
            document.getElementById(
                "celularPersonal"
            ).value.trim(),

        cargo:
            document.getElementById(
                "cargoPersonal"
            ).value.trim(),

        cuadrilla:
            document.getElementById(
                "cuadrillaPersonal"
            ).value

    };


    try {

        const respuesta =
            await fetch(
                "/api/personal",
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
                "No se pudo registrar el personal."
            );

            return;

        }


        alert(
            "Personal registrado correctamente."
        );


        const modal =
            document.getElementById(
                "modalPersonal"
            );


        if (modal) {

            modal.classList.remove(
                "active"
            );

        }


        await cargarPersonal();

    }
    catch (error) {

        console.error(
            "Error registrando personal:",
            error
        );


        alert(
            "No se pudo conectar con el servidor."
        );

    }

}


// ============================================================
// MATERIALES
// ============================================================

async function cargarMateriales() {

    try {

        const respuesta =
            await fetch(
                "/api/materiales"
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error al cargar materiales"
            );

        }


        const materiales =
            await respuesta.json();


        const tabla =
            document.getElementById(
                "tablaMateriales"
            );


        if (!tabla) {

            return;

        }


        tabla.innerHTML = "";


        materiales.forEach(function(material) {

            const fila =
                document.createElement("tr");


            fila.innerHTML = `

                <td>
                    ${material.material || material.nombre || ""}
                </td>

                <td>
                    ${material.cantidad || ""}
                </td>

                <td>
                    ${material.unidad || ""}
                </td>

                <td>
                    ${material.proyecto || ""}
                </td>

            `;


            tabla.appendChild(fila);

        });

    }
    catch (error) {

        console.error(
            "Error cargando materiales:",
            error
        );

    }

}


// ============================================================
// REGISTRAR MATERIAL
// ============================================================

async function registrarMaterial(event) {

    event.preventDefault();


    const datos = {

        proyecto_id:
            document.getElementById(
                "proyectoMaterial"
            ).value,

        material:
            document.getElementById(
                "nombreMaterial"
            ).value.trim(),

        cantidad:
            Number(
                document.getElementById(
                    "cantidadMaterial"
                ).value
            ),

        unidad:
            document.getElementById(
                "unidadMaterial"
            ).value

    };


    try {

        const respuesta =
            await fetch(
                "/api/materiales",
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
                "No se pudo registrar el material."
            );

            return;

        }


        alert(
            "Material registrado correctamente."
        );


        cerrarModal(
            "modalMaterial"
        );


        await cargarMateriales();

    }
    catch (error) {

        console.error(
            "Error registrando material:",
            error
        );


        alert(
            "No se pudo conectar con el servidor."
        );

    }

}


// ============================================================
// CARGAR USUARIO ACTUAL
// ============================================================

async function cargarUsuarioActual() {

    try {

        const respuesta =
            await fetch(
                "/api/usuario-actual"
            );


        if (!respuesta.ok) {

            return;

        }


        const usuario =
            await respuesta.json();


        console.log(
            "Usuario actual:",
            usuario
        );

    }
    catch (error) {

        console.error(
            "Error obteniendo usuario actual:",
            error
        );

    }

}


// ============================================================
// CERRAR SESIÓN
// ============================================================

async function cerrarSesion() {

    try {

        const respuesta =
            await fetch(
                "/api/logout",
                {
                    method: "POST"
                }
            );


        if (respuesta.ok) {

            window.location.href =
                "/";

        }
        else {

            alert(
                "No se pudo cerrar la sesión."
            );

        }

    }
    catch (error) {

        console.error(
            "Error cerrando sesión:",
            error
        );

    }

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
// BOTÓN MENÚ MOBILE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const boton =
            document.getElementById(
                "btnMenuMobile"
            );


        const sidebar =
            document.querySelector(
                ".sidebar"
            );


        if (
            boton &&
            sidebar
        ) {

            boton.addEventListener(
                "click",
                function() {

                    sidebar.classList.toggle(
                        "mobile-open"
                    );

                }
            );

        }

    }
);


// ============================================================
// INICIALIZACIÓN
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "Sistema iniciado correctamente."
        );


        try {

            await cargarPersonal();

        }
        catch (error) {

            console.error(error);

        }


        try {

            await cargarProyectos();

        }
        catch (error) {

            console.error(error);

        }


        try {

            await cargarMantenimientos();

        }
        catch (error) {

            console.error(error);

        }


        try {

            await cargarMateriales();

        }
        catch (error) {

            console.error(error);

        }


        try {

            await cargarUsuarioActual();

        }
        catch (error) {

            console.error(error);

        }


        try {

            await cargarGraficosDashboard();

        }
        catch (error) {

            console.error(error);

        }


        inicializarCalendarioMantenimiento();


        mostrarSeccion(
            "dashboard",
            document.querySelector(
                ".menu.active"
            )
        );

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
