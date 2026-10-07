
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
    // TÍTULO DEL MÓDULO
    // --------------------------------------------------------

    const tituloModulo =
        document.getElementById("tituloModulo");

    const titulosModulos = {

        dashboard:
            "Gestión de mantenimiento general",

        personal:
            "Gestión de personal",

        cuadrillas:
            "Gestión de cuadrillas",

        proyectos:
            "Lista de Proyectos",

        mantenimiento:
            "Lista de mantenimiento",

        materiales:
            "Lista de materiales",

        usuarios:
            "Lista de Usuarios"

    };


    if (tituloModulo) {

        tituloModulo.textContent =
            titulosModulos[seccion] ||
            "Sistema de Gestión";

    }


    // --------------------------------------------------------
    // BOTÓN TOPBAR
    // --------------------------------------------------------

    const botonTopbar =
        document.getElementById("botonTopbar");

    if (botonTopbar) {

        botonTopbar.innerHTML = "";


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
    // MANTENIMIENTO
    // --------------------------------------------------------

    if (seccion === "mantenimiento") {

        // Cargar proyectos para el buscador
        if (typeof cargarProyectos === "function") {

            cargarProyectos();

        }

        // Cargar registros de mantenimiento
        if (
            typeof cargarMantenimientos ===
            "function"
        ) {

            cargarMantenimientos();

        }

        // Inicializar calendario cuando
        // la sección ya está visible
        setTimeout(function() {

            if (
                typeof inicializarCalendarioMantenimiento ===
                "function"
            ) {

                inicializarCalendarioMantenimiento();

            }

            if (calendarioMantenimiento) {

                calendarioMantenimiento.updateSize();

                calendarioMantenimiento.refetchEvents();

            }

        }, 300);

    }


    // --------------------------------------------------------
    // PROYECTOS
    // --------------------------------------------------------

    if (seccion === "proyectos") {

        if (
            typeof cargarProyectos ===
            "function"
        ) {

            cargarProyectos();

        }

    }


    // --------------------------------------------------------
    // PERSONAL
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
    // MATERIALES
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
