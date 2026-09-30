
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
// CREAR GRÁFICO DE TIPO PIE
// ============================================================

function crearGraficoPie(
    canvas,
    etiquetas,
    valores
) {

    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {

        return null;

    }


    const grafico =
        new Chart(
            canvas,
            {

                type: "pie",

                data: {

                    labels:
                        etiquetas,

                    datasets: [{

                        data:
                            valores,

                        hoverOffset: 18,

                        borderWidth: 2

                    }]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    // ------------------------------------------------
                    // INTERACCIÓN
                    // ------------------------------------------------

                    interaction: {

                        mode: "nearest",

                        intersect: true

                    },


                    // ------------------------------------------------
                    // LEYENDA
                    // ------------------------------------------------

                    plugins: {

                        legend: {

                            position: "bottom",


                            onClick:
                                function(
                                    evento,
                                    legendItem,
                                    legend
                                ) {

                                    const chart =
                                        legend.chart;


                                    const indice =
                                        legendItem.index;


                                    const elementosActivos =
                                        chart.getActiveElements();


                                    const yaSeleccionado =
                                        elementosActivos.length > 0 &&
                                        elementosActivos[0].index === indice;


                                    // --------------------------------
                                    // SI YA ESTÁ SELECCIONADO
                                    // → QUITAR RESALTADO
                                    // --------------------------------

                                    if (
                                        yaSeleccionado
                                    ) {

                                        chart.setActiveElements([]);

                                        if (
                                            chart.tooltip
                                        ) {

                                            chart.tooltip.setActiveElements(
                                                [],
                                                {
                                                    x: 0,
                                                    y: 0
                                                }
                                            );

                                        }

                                        chart.update();

                                        return;

                                    }


                                    // --------------------------------
                                    // SELECCIONAR DISTRITO
                                    // --------------------------------

                                    chart.setActiveElements([
                                        {
                                            datasetIndex: 0,
                                            index: indice
                                        }
                                    ]);


                                    // --------------------------------
                                    // MOSTRAR INFORMACIÓN
                                    // DEL DISTRITO SELECCIONADO
                                    // --------------------------------

                                    if (
                                        chart.tooltip
                                    ) {

                                        const meta =
                                            chart.getDatasetMeta(0);

                                        const elemento =
                                            meta.data[indice];


                                        if (elemento) {

                                            chart.tooltip.setActiveElements(
                                                [
                                                    {
                                                        datasetIndex: 0,
                                                        index: indice
                                                    }
                                                ],
                                                {
                                                    x: elemento.x,
                                                    y: elemento.y
                                                }
                                            );

                                        }

                                    }


                                    chart.update();

                                }

                        },


                        // ------------------------------------------------
                        // TOOLTIP
                        // ------------------------------------------------

                        tooltip: {

                            enabled: true

                        }

                    }

                }

            }
        );


    return grafico;

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


        // ====================================================
        // DATOS
        // ====================================================

        const certificaciones = {};

        const averias = {};

        const splitters = {};

        const trabajoCampo = {};


        // ====================================================
        // RECORRER MANTENIMIENTOS
        // ====================================================

        mantenimientos.forEach(
            function(mantenimiento) {

                const sede =
                    mantenimiento.sede ||
                    "Sin sede";


                const tipo =
                    mantenimiento.tipo_mantenimiento ||
                    "";


                // --------------------------------------------
                // CERTIFICACIONES
                // --------------------------------------------

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


                // --------------------------------------------
                // AVERÍAS
                // --------------------------------------------

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


                // --------------------------------------------
                // CAMBIO DE SPLITTER
                // --------------------------------------------

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


                // --------------------------------------------
                // TRABAJO EN CAMPO
                // --------------------------------------------

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
        // GRÁFICO CERTIFICACIONES
        // ====================================================

        const canvasCertificaciones =
            document.getElementById(
                "graficoCertificaciones"
            );


        graficoCertificaciones =
            crearGraficoPie(
                canvasCertificaciones,

                Object.keys(
                    certificaciones
                ),

                Object.values(
                    certificaciones
                )
            );


        // ====================================================
        // GRÁFICO AVERÍAS
        // ====================================================

        const canvasAverias =
            document.getElementById(
                "graficoAverias"
            );


        graficoAverias =
            crearGraficoPie(
                canvasAverias,

                Object.keys(
                    averias
                ),

                Object.values(
                    averias
                )
            );


        // ====================================================
        // GRÁFICO CAMBIO DE SPLITTER
        // ====================================================

        const canvasSplitter =
            document.getElementById(
                "graficoSplitter"
            );


        graficoSplitters =
            crearGraficoPie(
                canvasSplitter,

                Object.keys(
                    splitters
                ),

                Object.values(
                    splitters
                )
            );


        // ====================================================
        // GRÁFICO TRABAJO EN CAMPO
        // ====================================================

        const canvasTrabajoCampo =
            document.getElementById(
                "graficoTrabajoCampo"
            );


        graficoTrabajoCampo =
            crearGraficoPie(
                canvasTrabajoCampo,

                Object.keys(
                    trabajoCampo
                ),

                Object.values(
                    trabajoCampo
                )
            );

    }
    catch (error) {

        console.error(
            "Error cargando gráficos:",
            error
        );

    }

}


