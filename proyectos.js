// ============================================================
// MÓDULO PROYECTOS
// PROYECTOS.JS
// ============================================================


// ============================================================
// ABRIR MODAL PROYECTO
// ============================================================

function abrirModalProyecto() {

    const modal =
        document.getElementById(
            "modalProyecto"
        );


    if (!modal) {

        console.error(
            "No se encontró modalProyecto"
        );

        return;

    }


    const formulario =
        modal.querySelector("form");


    if (formulario) {

        formulario.reset();

    }


    modal.classList.add("active");

}


// ============================================================
// CARGAR PROYECTOS
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


        // ====================================================
        // GUARDAR PARA EL DASHBOARD
        // ====================================================

        datosProyectosDashboard =
            proyectos;


        console.log(
            "Proyectos cargados:",
            proyectos
        );


        // ====================================================
        // TABLA DE PROYECTOS
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
        // TOTAL DE PROYECTOS
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
        // ACTUALIZAR DASHBOARD
        // ====================================================

        actualizarDashboard();


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


    // ========================================================
    // BUSCAR PROYECTOS MIENTRAS SE ESCRIBE
    // ========================================================

    inputProyecto.oninput =
        function() {

            const texto =
                inputProyecto.value
                    .trim()
                    .toLowerCase();


            resultados.innerHTML = "";


            // Se borra el ID hasta que se seleccione
            // un proyecto real.

            inputProyecto.dataset.proyectoId =
                "";


            if (!texto) {

                resultados.style.display =
                    "none";

                return;

            }


            // =================================================
            // BUSCAR POR CÓDIGO O NOMBRE
            // =================================================

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


            // =================================================
            // SIN RESULTADOS
            // =================================================

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


            // =================================================
            // MOSTRAR RESULTADOS
            // =================================================

            encontrados.forEach(function(proyecto) {

                const opcion =
                    document.createElement("div");


                opcion.className =
                    "opcion-proyecto-mantenimiento";


                // =================================================
                // EN MANTENIMIENTO SE MUESTRA EL CÓDIGO
                // =================================================

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


    // ========================================================
    // MOSTRAR CÓDIGO DEL PROYECTO
    // ========================================================

    input.value =
        proyecto.codigo || "";


    // ========================================================
    // GUARDAR ID REAL DEL PROYECTO
    // ========================================================

    input.dataset.proyectoId =
        proyecto.id || "";


    // ========================================================
    // OCULTAR RESULTADOS
    // ========================================================

    if (resultados) {

        resultados.innerHTML =
            "";

        resultados.style.display =
            "none";

    }

}


// ============================================================
// ABRIR LISTA DE PROYECTOS EN MANTENIMIENTO
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


    // ========================================================
    // SI YA ESTÁ ABIERTA, CERRARLA
    // ========================================================

    if (
        resultados.style.display ===
        "block"
    ) {

        resultados.style.display =
            "none";

        return;

    }


    resultados.innerHTML = "";


    // ========================================================
    // NO HAY PROYECTOS
    // ========================================================

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


    // ========================================================
    // MOSTRAR TODOS LOS PROYECTOS
    // ========================================================

    proyectos.forEach(function(proyecto) {

        const opcion =
            document.createElement("div");


        opcion.className =
            "opcion-proyecto-mantenimiento";


        // ====================================================
        // MOSTRAR CÓDIGO
        // ====================================================

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

    });


    resultados.style.display =
        "block";

}
