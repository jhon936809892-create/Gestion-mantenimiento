// ========================================
// VARIABLES
// ========================================

let proyectos = [];
let calendarioMantenimiento = null;
let resizeCalendarioPendiente = false;
let graficoCertificaciones = null;
let graficoAverias = null;
let graficoSplitters = null;
let graficoTrabajoCampo = null;


// ========================================
// ESTILOS AUTOMÁTICOS PARA MODAL PERSONAL
// ========================================

function aplicarEstilosModalPersonal() {

    if (document.getElementById("estilosModalPersonal")) {
        return;
    }

    const estilos = document.createElement("style");

    estilos.id = "estilosModalPersonal";

    estilos.textContent = `

        #modalPersonal .botones-modal-personal,
        #modalPersonal .modal-footer,
        #modalPersonal .botones-formulario,
        #modalPersonal .form-buttons,
        #modalPersonal .modal-botones,
        #modalPersonal .botones-modal {

            display: flex !important;
            justify-content: flex-end !important;
            align-items: center !important;
            gap: 10px !important;
            width: 100% !important;
            margin-top: 20px !important;

        }

        #modalPersonal #btnGuardarPersonal,
        #modalPersonal .btn-guardar-personal {

            background-color: #2563eb !important;
            background: #2563eb !important;
            color: white !important;
            border: 1px solid #2563eb !important;
            border-radius: 6px !important;
            padding: 10px 18px !important;
            cursor: pointer !important;
            font-weight: 600 !important;

            transition:
                background-color 0.2s ease,
                transform 0.1s ease !important;

        }

        #modalPersonal #btnGuardarPersonal:hover,
        #modalPersonal .btn-guardar-personal:hover {

            background-color: #1d4ed8 !important;

        }

        #modalPersonal #btnGuardarPersonal:active,
        #modalPersonal .btn-guardar-personal:active {

            transform: scale(0.98);

        }

        #modalPersonal #btnCancelarPersonal,
        #modalPersonal .btn-cancelar-personal {

            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #333333 !important;
            border: 1px solid #cccccc !important;
            border-radius: 6px !important;
            padding: 10px 18px !important;
            cursor: pointer !important;
            font-weight: 600 !important;

            transition:
                background-color 0.2s ease,
                border-color 0.2s ease !important;

        }

        #modalPersonal #btnCancelarPersonal:hover,
        #modalPersonal .btn-cancelar-personal:hover {

            background-color: #f3f4f6 !important;
            border-color: #999999 !important;

        }

        #modalConfirmarCancelar {

            position: fixed !important;
            inset: 0 !important;
            background: rgba(0, 0, 0, 0.45) !important;

            display: flex !important;
            justify-content: center !important;
            align-items: center !important;

            z-index: 99999 !important;

            opacity: 0;
            visibility: hidden;

            transition:
                opacity 0.2s ease,
                visibility 0.2s ease;

        }

        #modalConfirmarCancelar.active {

            opacity: 1 !important;
            visibility: visible !important;

        }

        #modalConfirmarCancelar .modal-confirmacion-contenido {

            background: white !important;
            width: min(420px, 90%) !important;
            padding: 25px !important;
            border-radius: 10px !important;

            box-shadow:
                0 15px 40px rgba(0,0,0,0.25) !important;

        }

        #modalConfirmarCancelar h2 {

            margin-top: 0 !important;
            margin-bottom: 10px !important;

        }

        #modalConfirmarCancelar p {

            margin-bottom: 10px !important;

        }

        #modalConfirmarCancelar .texto-advertencia {

            color: #dc2626 !important;
            font-weight: 600 !important;

        }

        #modalConfirmarCancelar .botones-confirmacion {

            display: flex !important;
            justify-content: flex-end !important;
            gap: 10px !important;
            margin-top: 20px !important;

        }

        #modalConfirmarCancelar button {

            padding: 9px 16px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-weight: 600 !important;

        }

        #modalConfirmarCancelar .btn-no-cancelar {

            background: white !important;
            color: #333 !important;
            border: 1px solid #ccc !important;

        }

        #modalConfirmarCancelar .btn-si-cancelar {

            background: #dc2626 !important;
            color: white !important;
            border: 1px solid #dc2626 !important;

        }

        .botones-edicion-personal {

            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-left: 8px;

        }

        .botones-edicion-personal button {

            border: none;
            background: transparent;
            cursor: pointer;
            font-size: 16px;
            padding: 4px 6px;
            border-radius: 5px;

        }

        .btn-editar-personal:hover {

            background: #dbeafe;

        }

        .btn-eliminar-personal:hover {

            background: #fee2e2;

        }

    `;

    document.head.appendChild(estilos);
}


// ========================================
// CONFIGURAR BOTONES DEL MODAL PERSONAL
// ========================================

function configurarBotonesModalPersonal() {

    aplicarEstilosModalPersonal();

    const modal =
        document.getElementById("modalPersonal");

    if (!modal) {
        return;
    }

    const botonGuardar =
        document.getElementById("btnGuardarPersonal");

    if (botonGuardar) {

        botonGuardar.classList.add(
            "btn-guardar-personal"
        );

        botonGuardar.type = "submit";

    }

    let botonCancelar =
        document.getElementById("btnCancelarPersonal");

    if (!botonCancelar) {

        botonCancelar =
            modal.querySelector(
                ".btn-cancelar-personal"
            );

    }

    if (!botonCancelar) {

        const botones =
            modal.querySelectorAll("button");

        botones.forEach(function(boton) {

            const texto =
                (
                    boton.textContent ||
                    ""
                )
                .trim()
                .toLowerCase();

            if (texto.includes("cancelar")) {

                botonCancelar = boton;

            }

        });

    }

    if (botonCancelar) {

        botonCancelar.id =
            botonCancelar.id ||
            "btnCancelarPersonal";

        botonCancelar.type = "button";

        botonCancelar.classList.add(
            "btn-cancelar-personal"
        );

        botonCancelar.onclick = null;

        botonCancelar.onclick =
            function(event) {

                event.preventDefault();
                event.stopPropagation();

                cancelarEdicionPersonal();

            };

    }

    if (
        botonGuardar &&
        botonCancelar
    ) {

        let contenedor =
            botonGuardar.parentElement;

        if (
            contenedor &&
            contenedor !==
            botonCancelar.parentElement
        ) {

            contenedor =
                botonCancelar.parentElement;

        }

        if (contenedor) {

            contenedor.classList.add(
                "botones-modal-personal"
            );

        }

    }

}


// ========================================
// INICIALIZAR CALENDARIO
// ========================================

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

    if (typeof FullCalendar === "undefined") {

        console.error(
            "FullCalendar no está cargado."
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

                allDaySlot:
                    true,

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
                                    "No se pudieron obtener los mantenimientos."
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

                                                cuadrilla:
                                                    mantenimiento.cuadrilla || "",

                                                trabajo:
                                                    mantenimiento.trabajo || "",

                                                estado:
                                                    mantenimiento.estado || ""

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

                eventClick:
                    function(info) {

                        const evento =
                            info.event;

                        const datos =
                            evento.extendedProps;

                        alert(

                            "DETALLE DEL MANTENIMIENTO\n\n" +

                            "Proyecto: " +
                            (
                                datos.proyecto ||
                                "Sin proyecto"
                            ) +

                            "\n\nCuadrilla: " +
                            (
                                datos.cuadrilla ||
                                "Sin cuadrilla"
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


// ========================================
// ACTIVAR / DESACTIVAR EDICIÓN DE PERSONAL
// ========================================

function activarEdicionPersonal() {

    const filas =
        document.querySelectorAll(
            "#tablaPersonal tr"
        );

    const modoEdicion =
        document.querySelector(
            ".botones-edicion-personal"
        ) !== null;

    filas.forEach(
        function(fila) {

            const botonesExistentes =
                fila.querySelector(
                    ".botones-edicion-personal"
                );

            if (modoEdicion) {

                if (botonesExistentes) {

                    botonesExistentes.remove();

                }

                return;

            }

            const botones =
                document.createElement(
                    "span"
                );

            botones.className =
                "botones-edicion-personal";

            botones.innerHTML = `

                <button
                    type="button"
                    title="Editar"
                    class="btn-editar-personal"
                >
                    ✏️
                </button>

                <button
                    type="button"
                    title="Borrar"
                    class="btn-eliminar-personal"
                >
                    🗑️
                </button>

            `;

            const botonEditar =
                botones.querySelector(
                    ".btn-editar-personal"
                );

            const botonEliminar =
                botones.querySelector(
                    ".btn-eliminar-personal"
                );

            if (botonEditar) {

                botonEditar.addEventListener(
                    "click",
                    function() {

                        editarPersonal(
                            fila.dataset.id
                        );

                    }
                );

            }

            if (botonEliminar) {

                botonEliminar.addEventListener(
                    "click",
                    function() {

                        eliminarPersonal(
                            fila.dataset.id
                        );

                    }
                );

            }

            if (fila.lastElementChild) {

                fila.lastElementChild.appendChild(
                    botones
                );

            }

        }
    );

}


// ========================================
// CAMBIAR SECCIÓN
// ========================================

function mostrarSeccion(
    seccion,
    boton
) {

    const secciones =
        document.querySelectorAll(
            ".seccion"
        );

    secciones.forEach(
        function(item) {

            item.classList.remove(
                "activa"
            );

        }
    );

    const seleccionada =
        document.getElementById(
            seccion
        );

    if (seleccionada) {

        seleccionada.classList.add(
            "activa"
        );

    }

    const botones =
        document.querySelectorAll(
            ".menu"
        );

    botones.forEach(
        function(item) {

            item.classList.remove(
                "active"
            );

        }
    );

    if (boton) {

        boton.classList.add(
            "active"
        );

    }

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

    const titulo =
        document.getElementById(
            "titulo"
        );

    if (titulo) {

        titulo.textContent =
            titulos[seccion] ||
            "Dashboard";

    }

    const botonTopbar =
        document.getElementById(
            "botonTopbar"
        );

    if (botonTopbar) {

        botonTopbar.innerHTML = "";

        if (seccion === "personal") {

            botonTopbar.innerHTML = `

                <button
                    type="button"
                    class="btn-primary"
                    onclick="abrirModalPersonal()"
                >
                    + Registrar personal
                </button>

                <button
                    type="button"
                    class="btn-primary"
                    onclick="activarEdicionPersonal()"
                >
                    ✏️ Editar
                </button>

            `;

        }

        else if (seccion === "proyectos") {

            botonTopbar.innerHTML = `

                <button
                    type="button"
                    class="btn-primary"
                    onclick="abrirModalProyecto()"
                >
                    + Nuevo proyecto
                </button>

            `;

        }

        else if (seccion === "mantenimiento") {

            botonTopbar.innerHTML = `

                <button
                    type="button"
                    class="btn-primary"
                    onclick="abrirModalMantenimiento()"
                >
                    + Nuevo mantenimiento
                </button>

            `;

        }

        else if (seccion === "materiales") {

            botonTopbar.innerHTML = `

                <button
                    type="button"
                    class="btn-primary"
                    onclick="abrirModalMaterial()"
                >
                    + Registrar material
                </button>

            `;

        }

    }

    if (seccion === "personal") {

        cargarPersonal();

    }

    if (seccion === "cuadrillas") {

        cargarPersonal();

    }

    if (seccion === "proyectos") {

        cargarProyectos();

    }

    if (seccion === "mantenimiento") {

        cargarProyectos();
        cargarMantenimientos();

        setTimeout(
            function() {

                inicializarCalendarioMantenimiento();

                if (calendarioMantenimiento) {

                    calendarioMantenimiento.updateSize();
                    calendarioMantenimiento.refetchEvents();

                }

            },
            150
        );

    }

    if (seccion === "materiales") {

        cargarProyectos();
        cargarMateriales();

    }

}


// ========================================
// MODAL PERSONAL
// ========================================

function abrirModalPersonal() {

    const modal =
        document.getElementById(
            "modalPersonal"
        );

    const titulo =
        document.getElementById(
            "tituloModalPersonal"
        );

    const boton =
        document.getElementById(
            "btnGuardarPersonal"
        );

    const id =
        document.getElementById(
            "idPersonal"
        );

    const formulario =
        document.getElementById(
            "formPersonal"
        );

    if (formulario) {

        formulario.reset();

    }

    if (id) {

        id.value = "";

    }

    if (titulo) {

        titulo.textContent =
            "Registrar personal";

    }

    if (boton) {

        boton.textContent =
            "Guardar personal";

        boton.classList.add(
            "btn-guardar-personal"
        );

    }

    limpiarErroresPersonal();

    if (modal) {

        modal.classList.add(
            "active"
        );

    }

    setTimeout(
        function() {

            configurarBotonesModalPersonal();

        },
        0
    );

}


// ========================================
// LIMPIAR ERRORES PERSONAL
// ========================================

function limpiarErroresPersonal() {

    const errorDNI =
        document.getElementById(
            "errorDNI"
        );

    const errorCelular =
        document.getElementById(
            "errorCelular"
        );

    if (errorDNI) {

        errorDNI.textContent = "";

    }

    if (errorCelular) {

        errorCelular.textContent = "";

    }

    const documento =
        document.getElementById(
            "documentoPersonal"
        );

    const celular =
        document.getElementById(
            "celularPersonal"
        );

    if (documento) {

        documento.classList.remove(
            "input-error",
            "input-correcto"
        );

    }

    if (celular) {

        celular.classList.remove(
            "input-error",
            "input-correcto"
        );

    }

}


// ========================================
// MODAL PROYECTO
// ========================================

async function abrirModalProyecto() {

    const modal =
        document.getElementById(
            "modalProyecto"
        );

    if (modal) {

        modal.classList.add(
            "active"
        );

    }

}


// ========================================
// MODAL MANTENIMIENTO
// ========================================

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

    modal.classList.add(
        "active"
    );

}




// ========================================
// GRÁFICOS DEL DASHBOARD
// ========================================

async function cargarGraficosDashboard() {

    try {

        const respuesta =
            await fetch(
                "/api/mantenimientos"
            );

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los mantenimientos."
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
                    (
                        mantenimiento.tipo_mantenimiento ||
                        ""
                    )
                    .trim()
                    .toLowerCase();

                if (
                    tipo === "certificación" ||
                    tipo === "certificacion"
                ) {

                    if (!certificaciones[sede]) {

                        certificaciones[sede] = 0;

                    }

                    certificaciones[sede]++;

                }

                if (
                    tipo === "avería" ||
                    tipo === "averia"
                ) {

                    if (!averias[sede]) {

                        averias[sede] = 0;

                    }

                    averias[sede]++;

                }

                if (
                    tipo === "cambio de splitter"
                ) {

                    if (!splitters[sede]) {

                        splitters[sede] = 0;

                    }

                    splitters[sede]++;

                }

                if (
                    tipo === "trabajo en campo"
                ) {

                    if (!trabajoCampo[sede]) {

                        trabajoCampo[sede] = 0;

                    }

                    trabajoCampo[sede]++;

                }

            }
        );

        const canvasCertificaciones =
            document.getElementById(
                "graficoCertificaciones"
            );

        if (canvasCertificaciones) {

            if (graficoCertificaciones) {

                graficoCertificaciones.destroy();

            }

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

                            datasets: [

                                {

                                    data:
                                        Object.values(
                                            certificaciones
                                        ),

                                    borderWidth: 1

                                }

                            ]

                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio: false,

                            plugins: {

                                legend: {

                                    position: "bottom"

                                }

                            }

                        }

                    }
                );

        }

        const canvasAverias =
            document.getElementById(
                "graficoAverias"
            );

        if (canvasAverias) {

            if (graficoAverias) {

                graficoAverias.destroy();

            }

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

                            datasets: [

                                {

                                    data:
                                        Object.values(
                                            averias
                                        ),

                                    borderWidth: 1

                                }

                            ]

                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio: false,

                            plugins: {

                                legend: {

                                    position: "bottom"

                                }

                            }

                        }

                    }
                );

        }

        const canvasSplitter =
            document.getElementById(
                "graficoSplitter"
            );

        if (canvasSplitter) {

            if (graficoSplitters) {

                graficoSplitters.destroy();

            }

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

                            datasets: [

                                {

                                    data:
                                        Object.values(
                                            splitters
                                        ),

                                    borderWidth: 1

                                }

                            ]

                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio: false,

                            plugins: {

                                legend: {

                                    position: "bottom"

                                }

                            }

                        }

                    }
                );

        }

        const canvasCampo =
            document.getElementById(
                "graficoCampo"
            );

        if (canvasCampo) {

            if (graficoTrabajoCampo) {

                graficoTrabajoCampo.destroy();

            }

            graficoTrabajoCampo =
                new Chart(
                    canvasCampo,
                    {

                        type: "pie",

                        data: {

                            labels:
                                Object.keys(
                                    trabajoCampo
                                ),

                            datasets: [

                                {

                                    data:
                                        Object.values(
                                            trabajoCampo
                                        ),

                                    borderWidth: 1

                                }

                            ]

                        },

                        options: {

                            responsive: true,

                            maintainAspectRatio: false,

                            plugins: {

                                legend: {

                                    position: "bottom"

                                }

                            }

                        }

                    }
                );

        }

    }
    catch (error) {

        console.error(
            "Error cargando gráficos del Dashboard:",
            error
        );

    }

}


// ========================================
// USUARIO ACTUAL Y PERMISOS
// ========================================

async function cargarUsuarioActual() {

    try {

        const respuesta =
            await fetch(
                "/api/usuario"
            );

        if (!respuesta.ok) {

            return;

        }

        const usuario =
            await respuesta.json();

        console.log(
            "Usuario conectado:",
            usuario
        );

        const nombreUsuario =
            document.getElementById(
                "nombreUsuario"
            );

        const cargoUsuario =
            document.getElementById(
                "cargoUsuario"
            );

        if (nombreUsuario) {

            nombreUsuario.textContent =
                usuario.nombre || "";

        }

        if (cargoUsuario) {

            cargoUsuario.textContent =
                usuario.cargo || "";

        }

        const botonPersonal =
            document.getElementById(
                "btnRegistrarPersonal"
            );

        if (botonPersonal) {

            if (
                usuario.cargo ===
                "Coordinador de Proyectos"
            ) {

                botonPersonal.style.display =
                    "";

            }

            else {

                botonPersonal.style.display =
                    "none";

            }

        }

    }
    catch (error) {

        console.error(
            "Error obteniendo usuario:",
            error
        );

    }

}


// ========================================
// CERRAR SESIÓN
// ========================================

async function cerrarSesion() {

    try {

        const respuesta =
            await fetch(
                "/api/logout",
                {

                    method:
                        "POST"

                }
            );

        if (respuesta.ok) {

            window.location.href =
                "/login.html";

        }

        else {

            alert(
                "No se pudo cerrar la sesión."
            );

        }

    }
    catch (error) {

        console.error(
            error
        );

        alert(
            "Error al cerrar la sesión."
        );

    }

}


// ========================================
// ACTUALIZAR CALENDARIO AL CAMBIAR TAMAÑO
// ========================================

window.addEventListener(
    "resize",
    function() {

        if (
            !calendarioMantenimiento
        ) {

            return;

        }

        if (
            resizeCalendarioPendiente
        ) {

            return;

        }

        resizeCalendarioPendiente =
            true;

        requestAnimationFrame(
            function() {

                resizeCalendarioPendiente =
                    false;

                if (
                    calendarioMantenimiento
                ) {

                    calendarioMantenimiento.updateSize();

                }

            }
        );

    }
);


// ========================================
// INICIO
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        aplicarEstilosModalPersonal();

        configurarBotonesModalPersonal();

        await cargarPersonal();

        await cargarProyectos();

        await cargarMantenimientos();

        await cargarMateriales();

        await cargarUsuarioActual();

        await cargarGraficosDashboard();

        mostrarSeccion(
            "dashboard",
            document.querySelector(
                ".menu.active"
            )
        );

    }
);


// ========================================
// OBSERVAR CAMBIOS DE TAMAÑO DEL CALENDARIO
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const elementoCalendario =
            document.getElementById(
                "calendarioMantenimiento"
            );

        if (!elementoCalendario) {

            return;

        }

        if (
            typeof ResizeObserver ===
            "undefined"
        ) {

            return;

        }

        const observadorCalendario =
            new ResizeObserver(
                function() {

                    if (
                        calendarioMantenimiento
                    ) {

                        calendarioMantenimiento.updateSize();

                    }

                }
            );

        observadorCalendario.observe(
            elementoCalendario
        );

    }
);

function abrirListaProyectosMantenimiento() {

    const inputProyecto =
        document.getElementById("proyectoMantenimiento");

    const resultados =
        document.getElementById(
            "resultadosProyectosMantenimiento"
        );

    if (!inputProyecto || !resultados) {
        return;
    }

    // Si la lista está abierta, la cerramos
    if (resultados.style.display === "block") {

        resultados.style.display = "none";
        return;

    }

    resultados.innerHTML = "";

    if (!proyectos || proyectos.length === 0) {

        resultados.innerHTML = `
            <div class="sin-resultados-proyecto">
                No hay proyectos disponibles
            </div>
        `;

        resultados.style.display = "block";

        return;
    }

    // Mostrar todos los proyectos
    proyectos.forEach(function(proyecto) {

        const opcion =
            document.createElement("div");

        opcion.className =
            "opcion-proyecto-mantenimiento";

        opcion.textContent =
            proyecto.codigo;

        opcion.addEventListener(
            "click",
            function() {

                inputProyecto.value =
                    proyecto.codigo;

                inputProyecto.dataset.proyectoId =
                    proyecto.id;

                resultados.innerHTML = "";

                resultados.style.display =
                    "none";

            }
        );

        resultados.appendChild(opcion);

    });

    resultados.style.display = "block";
}
