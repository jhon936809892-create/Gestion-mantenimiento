
// ============================================================
// SISTEMA DE GESTIÓN DE CUADRILLAS
// SCRIPT.JS
// ARCHIVO PRINCIPAL / FUNCIONES GENERALES
// ============================================================


// ============================================================
// CERRAR MODAL
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

    // --------------------------------------------------------
    // OCULTAR TODAS LAS SECCIONES
    // --------------------------------------------------------

    document
        .querySelectorAll(".seccion")
        .forEach(function(elemento) {

            elemento.classList.remove("activa");

        });


    // --------------------------------------------------------
    // MOSTRAR SECCIÓN SELECCIONADA
    // --------------------------------------------------------

    const seleccionada =
        document.getElementById(seccion);

    if (seleccionada) {

        seleccionada.classList.add("activa");

    }


    // --------------------------------------------------------
    // CAMBIAR BOTÓN ACTIVO DEL MENÚ
    // --------------------------------------------------------

    document
        .querySelectorAll(".menu")
        .forEach(function(menu) {

            menu.classList.remove("active");

        });


    if (boton) {

        boton.classList.add("active");

    }


    // --------------------------------------------------------
    // TÍTULO
    // --------------------------------------------------------

    const titulo =
        document.getElementById("titulo");


    const titulos = {

        dashboard:
            "Dashboard",

        personal:
            "Personal",

        cuadrillas:
            "Cuadrillas",

        proyectos:
            "Lista de Proyectos",

        mantenimiento:
            "Lista de Mantenimiento",

        materiales:
            "Lista de Materiales"

    };


    if (titulo) {

        titulo.textContent =
            titulos[seccion] || seccion;

    }


    // --------------------------------------------------------
    // BOTÓN DE LA TOPBAR
    // --------------------------------------------------------

    const botonTopbar =
        document.getElementById("botonTopbar");


    if (botonTopbar) {

        botonTopbar.innerHTML = "";


        // ----------------------------------------------------
        // BOTÓN PROYECTO
        // ----------------------------------------------------

        if (seccion === "proyectos") {

            botonTopbar.innerHTML = `

                <button
                    type="button"
                    class="btn-primary"
                    onclick="abrirModalProyecto()"
                >
                    + Añadir proyecto
                </button>

            `;

        }


        // ----------------------------------------------------
        // BOTÓN MANTENIMIENTO
        // ----------------------------------------------------

        if (seccion === "mantenimiento") {

            botonTopbar.innerHTML = `

                <button
                    type="button"
                    class="btn-primary"
                    onclick="abrirModalMantenimiento()"
                >
                    + Añadir mantenimiento
                </button>

            `;

        }

    }


    // --------------------------------------------------------
    // DASHBOARD
    // --------------------------------------------------------

    if (seccion === "dashboard") {

        actualizarDashboard();

    }


    // --------------------------------------------------------
    // MÓDULO MANTENIMIENTO
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // MÓDULO PROYECTOS
    // --------------------------------------------------------

    if (seccion === "proyectos") {

        cargarProyectos();

    }


    // --------------------------------------------------------
    // MÓDULO PERSONAL
    // --------------------------------------------------------

    if (seccion === "personal") {

        if (
            typeof cargarPersonal ===
            "function"
        ) {

            cargarPersonal();

        }

    }


    // --------------------------------------------------------
    // MÓDULO MATERIALES
    // --------------------------------------------------------

    if (seccion === "materiales") {

        if (
            typeof cargarMateriales ===
            "function"
        ) {

            cargarMateriales();

        }

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
// INICIALIZACIÓN DEL SISTEMA
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "Sistema iniciado correctamente."
        );


        // ----------------------------------------------------
        // PERSONAL
        // ----------------------------------------------------

        try {

            await cargarPersonal();

        }
        catch (error) {

            console.error(error);

        }


        // ----------------------------------------------------
        // PROYECTOS
        // ----------------------------------------------------

        try {

            await cargarProyectos();

        }
        catch (error) {

            console.error(error);

        }


        // ----------------------------------------------------
        // MANTENIMIENTOS
        // ----------------------------------------------------

        try {

            await cargarMantenimientos();

        }
        catch (error) {

            console.error(error);

        }


        // ----------------------------------------------------
        // MATERIALES
        // ----------------------------------------------------

        try {

            await cargarMateriales();

        }
        catch (error) {

            console.error(error);

        }


        // ----------------------------------------------------
        // USUARIO ACTUAL
        // ----------------------------------------------------

        try {

            await cargarUsuarioActual();

        }
        catch (error) {

            console.error(error);

        }


        // ----------------------------------------------------
        // GRÁFICOS
        // ----------------------------------------------------

        try {

            await cargarGraficosDashboard();

        }
        catch (error) {

            console.error(error);

        }


        // ----------------------------------------------------
        // ACTUALIZAR DASHBOARD
        // ----------------------------------------------------

        actualizarDashboard();


        // ----------------------------------------------------
        // NO INICIALIZAR CALENDARIO AQUÍ
        // ----------------------------------------------------
        //
        // El calendario se inicializa cuando se entra
        // al módulo de Mantenimiento.
        // ----------------------------------------------------


        // ----------------------------------------------------
        // MOSTRAR DASHBOARD
        // ----------------------------------------------------

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
