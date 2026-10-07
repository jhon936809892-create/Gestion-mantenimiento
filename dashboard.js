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

        console.error(
            "No se puede crear el gráfico: canvas o Chart no disponible."
        );

        return null;

    }


    const grafico =
        new Chart(
            canvas,
            {

                // ====================================================
                // TIPO
                // ====================================================

                type: "pie",


                // ====================================================
                // DATOS
                // ====================================================

                data: {

                    labels:
                        etiquetas,


                    datasets: [

                        {

                            data:
                                valores,


                            // ----------------------------------------
                            // COLORES
                            // ----------------------------------------

                            backgroundColor: [

                                "#BFD7EA",

                                "#CDECCF",

                                "#F8E7A2",

                                "#F4C2C2",

                                "#D8C7F1",

                                "#BFE8E5",

                                "#F6D5B3",

                                "#C9D2F0",

                                "#D9E8B2",

                                "#F2C6DE"

                            ],


                            // ----------------------------------------
                            // BORDES
                            // ----------------------------------------

                            borderColor: [

                                "#FFFFFF",

                                "#FFFFFF",

                                "#FFFFFF",

                                "#FFFFFF",

                                "#FFFFFF",

                                "#FFFFFF",

                                "#FFFFFF",

                                "#FFFFFF",

                                "#FFFFFF",

                                "#FFFFFF"

                            ],


                            hoverOffset: 18,

                            borderWidth: 2

                        }

                    ]

                },


                // ====================================================
                // OPCIONES
                // ====================================================

                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    // ==================================================
                    // ANIMACIÓN
                    // ==================================================

                    animation: {

                        duration: 1500,

                        easing:
                            "easeInOutQuart",

                        animateRotate:
                            true,

                        animateScale:
                            true

                    },


                    // ==================================================
                    // INTERACCIÓN
                    // ==================================================

                    interaction: {

                        mode: "nearest",

                        intersect: true

                    },


                    // ==================================================
                    // PLUGINS
                    // ==================================================

                    plugins: {


                        // ==============================================
                        // LEYENDA
                        // ==============================================

                        legend: {

                            position:
                                "bottom",


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


                                    // ==================================
                                    // QUITAR RESALTADO
                                    // ==================================

                                    if (
                                        yaSeleccionado
                                    ) {

                                        chart.setActiveElements(
                                            []
                                        );


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


                                    // ==================================
                                    // SELECCIONAR SEDE
                                    // ==================================

                                    chart.setActiveElements(
                                        [

                                            {

                                                datasetIndex:
                                                    0,

                                                index:
                                                    indice

                                            }

                                        ]
                                    );


                                    // ==================================
                                    // MOSTRAR TOOLTIP
                                    // ==================================

                                    if (
                                        chart.tooltip
                                    ) {

                                        const meta =
                                            chart.getDatasetMeta(
                                                0
                                            );


                                        const elemento =
                                            meta.data[
                                                indice
                                            ];


                                        if (
                                            elemento
                                        ) {

                                            chart.tooltip.setActiveElements(
                                                [

                                                    {

                                                        datasetIndex:
                                                            0,

                                                        index:
                                                            indice

                                                    }

                                                ],

                                                {

                                                    x:
                                                        elemento.x,

                                                    y:
                                                        elemento.y

                                                }
                                            );

                                        }

                                    }


                                    chart.update();

                                }

                        },


                        // ==============================================
                        // TOOLTIP
                        // ==============================================

                        tooltip: {

                            enabled:
                                true

                        }

                    }

                }

            }
        );


    return grafico;

}


// ============================================================
// CARGAR SEDES EN CADA FILTRO
// ============================================================

function cargarSedesEnFiltros(
    datosPorTipo
) {

    const configuraciones = [

        {

            filtro:
                "filtroCertificaciones",

            datos:
                datosPorTipo.certificaciones

        },


        {

            filtro:
                "filtroAverias",

            datos:
                datosPorTipo.averias

        },


        {

            filtro:
                "filtroSplitter",

            datos:
                datosPorTipo.splitters

        },


        {

            filtro:
                "filtroTrabajoCampo",

            datos:
                datosPorTipo.trabajoCampo

        }

    ];


    configuraciones.forEach(
        function(configuracion) {

            const select =
                document.getElementById(
                    configuracion.filtro
                );


            if (
                !select
            ) {

                return;

            }


            // ====================================================
            // LIMPIAR SELECT
            // ====================================================

            select.innerHTML =
                "";


            // ====================================================
            // OPCIÓN INICIAL
            // ====================================================

            const opcionInicial =
                document.createElement(
                    "option"
                );


            opcionInicial.value =
                "";


            opcionInicial.textContent =
                "Seleccionar sede";


            select.appendChild(
                opcionInicial
            );


            // ====================================================
            // OBTENER SEDES
            // ====================================================

            const sedes =
                Object.keys(
                    configuracion.datos
                );


            // ====================================================
            // ORDENAR SEDES
            // ====================================================

            sedes.sort(
                function(
                    a,
                    b
                ) {

                    return a.localeCompare(
                        b,

                        "es",

                        {
                            sensitivity:
                                "base"
                        }
                    );

                }
            );


            // ====================================================
            // AGREGAR SEDES
            // ====================================================

            sedes.forEach(
                function(sede) {

                    const opcion =
                        document.createElement(
                            "option"
                        );


                    opcion.value =
                        sede;


                    opcion.textContent =
                        sede;


                    select.appendChild(
                        opcion
                    );

                }
            );

        }
    );

}


// ============================================================
// CONFIGURAR FILTRO DE UN GRÁFICO
// ============================================================

function configurarFiltroGrafico(
    idSelect,
    idCantidad,
    grafico,
    etiquetasOriginales,
    valoresOriginales
) {

    const select =
        document.getElementById(
            idSelect
        );


    const cantidad =
        document.getElementById(
            idCantidad
        );


    if (
        !select ||
        !grafico
    ) {

        return;

    }


    // ============================================================
    // GUARDAR COLORES ORIGINALES
    // ============================================================

    const coloresOriginales = [

        ...grafico
            .data
            .datasets[0]
            .backgroundColor

    ];


    const bordesOriginales = [

        ...grafico
            .data
            .datasets[0]
            .borderColor

    ];


    // ============================================================
    // EVENTO DEL SELECT
    // ============================================================

    select.onchange =
        function() {

            const sedeSeleccionada =
                select.value;


            // ====================================================
            // MOSTRAR TODAS LAS SEDES
            // ====================================================

            if (
                sedeSeleccionada === ""
            ) {

                grafico.data.labels = [

                    ...etiquetasOriginales

                ];


                grafico.data.datasets[0].data = [

                    ...valoresOriginales

                ];


                grafico.data.datasets[0].backgroundColor = [

                    ...coloresOriginales

                ];


                grafico.data.datasets[0].borderColor = [

                    ...bordesOriginales

                ];


                grafico.setActiveElements(
                    []
                );


                if (
                    grafico.tooltip
                ) {

                    grafico.tooltip.setActiveElements(
                        [],

                        {

                            x: 0,

                            y: 0

                        }
                    );

                }


                if (
                    cantidad
                ) {

                    cantidad.innerHTML =
                        "";

                }


                grafico.update();


                return;

            }


            // ====================================================
            // BUSCAR ÍNDICE DE LA SEDE
            // ====================================================

            const indice =
                etiquetasOriginales.indexOf(
                    sedeSeleccionada
                );


            if (
                indice === -1
            ) {

                return;

            }


            // ====================================================
            // OBTENER VALOR
            // ====================================================

            const valor =
                valoresOriginales[
                    indice
                ];


            // ====================================================
            // OBTENER COLOR ORIGINAL
            // ====================================================

            const colorSede =
                coloresOriginales[
                    indice
                ];


            const bordeSede =
                bordesOriginales[
                    indice
                ];


            // ====================================================
            // MOSTRAR SOLAMENTE LA SEDE SELECCIONADA
            // ====================================================

            grafico.data.labels = [

                sedeSeleccionada

            ];


            grafico.data.datasets[0].data = [

                valor

            ];


            // ====================================================
            // CONSERVAR COLOR
            // ====================================================

            grafico.data.datasets[0].backgroundColor = [

                colorSede

            ];


            grafico.data.datasets[0].borderColor = [

                bordeSede

            ];


            // ====================================================
            // MOSTRAR CANTIDAD
            // ====================================================

            if (
                cantidad
            ) {

                cantidad.innerHTML = `

                    <strong>
                        ${valor}
                    </strong>

                    registros

                `;

            }


            // ====================================================
            // LIMPIAR SELECCIÓN
            // ====================================================

            grafico.setActiveElements(
                []
            );


            if (
                grafico.tooltip
            ) {

                grafico.tooltip.setActiveElements(
                    [],

                    {

                        x: 0,

                        y: 0

                    }
                );

            }


            // ====================================================
            // ACTUALIZAR
            // ====================================================

            grafico.update();

        };

}


// ============================================================
// GRÁFICOS DEL DASHBOARD
// ============================================================

async function cargarGraficosDashboard() {

    try {

        // ========================================================
        // OBTENER MANTENIMIENTOS
        // ========================================================

        const respuesta =
            await fetch(
                "/api/mantenimientos"
            );


        if (
            !respuesta.ok
        ) {

            throw new Error(
                "Error al obtener mantenimientos"
            );

        }


        const mantenimientos =
            await respuesta.json();


        // ========================================================
        // VERIFICAR DATOS RECIBIDOS
        // ========================================================

        console.log(
            "MANTENIMIENTOS RECIBIDOS:",
            mantenimientos
        );


        // ========================================================
        // DATOS POR TIPO
        // ========================================================

        const certificaciones = {};

        const averias = {};

        const splitters = {};

        const trabajoCampo = {};


        // ========================================================
        // RECORRER MANTENIMIENTOS
        // ========================================================

        mantenimientos.forEach(
            function(mantenimiento) {

                // ==================================================
                // SEDE
                // ==================================================

                const sede =
                    (
                        mantenimiento.sede ||
                        "Sin sede"
                    )
                    .toString()
                    .trim();


                // ==================================================
                // TIPO DE MANTENIMIENTO
                // ==================================================

                const tipo =
                    (
                        mantenimiento.tipo_mantenimiento ||
                        ""
                    )
                    .toString()
                    .trim()
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(
                        /[\u0300-\u036f]/g,
                        ""
                    );


                console.log(
                    "Mantenimiento:",
                    {
                        sede:
                            sede,

                        tipoOriginal:
                            mantenimiento.tipo_mantenimiento,

                        tipoNormalizado:
                            tipo
                    }
                );


                // ==================================================
                // CERTIFICACIONES
                // ==================================================

                if (
                    tipo ===
                    "certificacion"
                ) {

                    certificaciones[sede] =
                        (
                            certificaciones[sede] ||
                            0
                        ) + 1;

                }


                // ==================================================
                // AVERÍAS
                // ==================================================

                if (
                    tipo ===
                    "averia"
                ) {

                    averias[sede] =
                        (
                            averias[sede] ||
                            0
                        ) + 1;

                }


                // ==================================================
                // CAMBIO DE SPLITTER
                // ==================================================

                if (
                    tipo ===
                    "cambio de splitter"
                ) {

                    splitters[sede] =
                        (
                            splitters[sede] ||
                            0
                        ) + 1;

                }


                // ==================================================
                // TRABAJO EN CAMPO
                // ==================================================

                if (
                    tipo ===
                    "trabajo en campo"
                ) {

                    trabajoCampo[sede] =
                        (
                            trabajoCampo[sede] ||
                            0
                        ) + 1;

                }

            }
        );


        // ========================================================
        // MOSTRAR RESULTADOS EN CONSOLA
        // ========================================================

        console.log(
            "CERTIFICACIONES:",
            certificaciones
        );


        console.log(
            "AVERÍAS:",
            averias
        );


        console.log(
            "SPLITTERS:",
            splitters
        );


        console.log(
            "TRABAJO EN CAMPO:",
            trabajoCampo
        );


        // ========================================================
        // CARGAR SEDES EN LOS FILTROS
        // ========================================================

        cargarSedesEnFiltros({

            certificaciones:
                certificaciones,

            averias:
                averias,

            splitters:
                splitters,

            trabajoCampo:
                trabajoCampo

        });


        // ========================================================
        // DESTRUIR GRÁFICOS ANTERIORES
        // ========================================================

        if (
            graficoCertificaciones
        ) {

            graficoCertificaciones.destroy();

            graficoCertificaciones =
                null;

        }


        if (
            graficoAverias
        ) {

            graficoAverias.destroy();

            graficoAverias =
                null;

        }


        if (
            graficoSplitters
        ) {

            graficoSplitters.destroy();

            graficoSplitters =
                null;

        }


        if (
            graficoTrabajoCampo
        ) {

            graficoTrabajoCampo.destroy();

            graficoTrabajoCampo =
                null;

        }


        // ========================================================
        // GRÁFICO CERTIFICACIONES
        // ========================================================

        const canvasCertificaciones =
            document.getElementById(
                "graficoCertificaciones"
            );


        const etiquetasCertificaciones =
            Object.keys(
                certificaciones
            );


        const valoresCertificaciones =
            Object.values(
                certificaciones
            );


        graficoCertificaciones =
            crearGraficoPie(

                canvasCertificaciones,

                etiquetasCertificaciones,

                valoresCertificaciones

            );


        // ========================================================
        // GRÁFICO AVERÍAS
        // ========================================================

        const canvasAverias =
            document.getElementById(
                "graficoAverias"
            );


        const etiquetasAverias =
            Object.keys(
                averias
            );


        const valoresAverias =
            Object.values(
                averias
            );


        graficoAverias =
            crearGraficoPie(

                canvasAverias,

                etiquetasAverias,

                valoresAverias

            );


        // ========================================================
        // GRÁFICO CAMBIO DE SPLITTER
        // ========================================================

        const canvasSplitter =
            document.getElementById(
                "graficoSplitter"
            );


        const etiquetasSplitters =
            Object.keys(
                splitters
            );


        const valoresSplitters =
            Object.values(
                splitters
            );


        graficoSplitters =
            crearGraficoPie(

                canvasSplitter,

                etiquetasSplitters,

                valoresSplitters

            );


        // ========================================================
        // GRÁFICO TRABAJO EN CAMPO
        // ========================================================

        const canvasTrabajoCampo =
            document.getElementById(
                "graficoTrabajoCampo"
            );


        const etiquetasTrabajoCampo =
            Object.keys(
                trabajoCampo
            );


        const valoresTrabajoCampo =
            Object.values(
                trabajoCampo
            );


        graficoTrabajoCampo =
            crearGraficoPie(

                canvasTrabajoCampo,

                etiquetasTrabajoCampo,

                valoresTrabajoCampo

            );


        // ========================================================
        // FILTRO CERTIFICACIONES
        // ========================================================

        configurarFiltroGrafico(

            "filtroCertificaciones",

            "cantidadCertificaciones",

            graficoCertificaciones,

            etiquetasCertificaciones,

            valoresCertificaciones

        );


        // ========================================================
        // FILTRO AVERÍAS
        // ========================================================

        configurarFiltroGrafico(

            "filtroAverias",

            "cantidadAverias",

            graficoAverias,

            etiquetasAverias,

            valoresAverias

        );


        // ========================================================
        // FILTRO SPLITTER
        // ========================================================

        configurarFiltroGrafico(

            "filtroSplitter",

            "cantidadSplitter",

            graficoSplitters,

            etiquetasSplitters,

            valoresSplitters

        );


        // ========================================================
        // FILTRO TRABAJO EN CAMPO
        // ========================================================

        configurarFiltroGrafico(

            "filtroTrabajoCampo",

            "cantidadTrabajoCampo",

            graficoTrabajoCampo,

            etiquetasTrabajoCampo,

            valoresTrabajoCampo

        );


        // ========================================================
        // FINALIZADO
        // ========================================================

        console.log(
            "Gráficos del dashboard cargados correctamente."
        );

    }
    catch (error) {

        console.error(
            "Error cargando gráficos:",
            error
        );

    }

}
