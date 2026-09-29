// ============================================================
// MÓDULO DASHBOARD
// dashboard.js
// ============================================================


// ============================================================
// DASHBOARD GENERAL
// ============================================================

function actualizarDashboard() {

    // --------------------------------------------------------
    // PERSONAL
    // --------------------------------------------------------

    const totalPersonal =
        document.getElementById(
            "totalPersonal"
        );


    if (
        totalPersonal &&
        Array.isArray(
            datosPersonalDashboard
        )
    ) {

        totalPersonal.textContent =
            datosPersonalDashboard.length;

    }


    // --------------------------------------------------------
    // PROYECTOS
    // --------------------------------------------------------

    const totalProyectos =
        document.getElementById(
            "totalProyectos"
        );


    if (
        totalProyectos &&
        Array.isArray(
            datosProyectosDashboard
        )
    ) {

        totalProyectos.textContent =
            datosProyectosDashboard.length;

    }


    // --------------------------------------------------------
    // MANTENIMIENTOS
    // --------------------------------------------------------

    const totalMantenimientos =
        document.getElementById(
            "totalMantenimientos"
        );


    if (
        totalMantenimientos &&
        Array.isArray(
            datosMantenimientosDashboard
        )
    ) {

        totalMantenimientos.textContent =
            datosMantenimientosDashboard.length;

    }


   
   

    // --------------------------------------------------------
    // MATERIALES
    // --------------------------------------------------------

    const totalMateriales =
        document.getElementById(
            "totalMateriales"
        );


    if (
        totalMateriales &&
        Array.isArray(
            datosMaterialesDashboard
        )
    ) {

        totalMateriales.textContent =
            datosMaterialesDashboard.length;

    }

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
        // DESTRUIR GRÁFICOS ANTERIORES
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
        // CAMBIO DE SPLITTER
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
