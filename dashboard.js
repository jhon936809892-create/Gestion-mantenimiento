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
        document.getElementById("totalPersonal");

    if (
        totalPersonal &&
        Array.isArray(datosPersonalDashboard)
    ) {

        totalPersonal.textContent =
            datosPersonalDashboard.length;

    }


    // --------------------------------------------------------
    // PROYECTOS
    // --------------------------------------------------------

    const totalProyectos =
        document.getElementById("totalProyectos");

    if (
        totalProyectos &&
        Array.isArray(datosProyectosDashboard)
    ) {

        totalProyectos.textContent =
            datosProyectosDashboard.length;

    }


    // --------------------------------------------------------
    // MANTENIMIENTOS
    // --------------------------------------------------------

    const totalMantenimientos =
        document.getElementById("totalMantenimientos");

    if (
        totalMantenimientos &&
        Array.isArray(datosMantenimientosDashboard)
    ) {

        totalMantenimientos.textContent =
            datosMantenimientosDashboard.length;

    }


    // --------------------------------------------------------
    // MATERIALES
    // --------------------------------------------------------

    const totalMateriales =
        document.getElementById("totalMateriales");

    if (
        totalMateriales &&
        Array.isArray(datosMaterialesDashboard)
    ) {

        totalMateriales.textContent =
            datosMaterialesDashboard.length;

    }

}


// ============================================================
// COLORES DE LOS GRÁFICOS
// ============================================================

const COLORES_GRAFICOS = [

    "#5FD998", // Verde
    "#5FB9D9", // Azul
    "#7A5FD9", // Morado
    "#D95F98", // Rosa
    "#D97A5F", // Coral
    "#D9B85F", // Amarillo
    "#5FD9C7", // Turquesa
    "#8FD95F", // Verde lima
    "#5F7FD9", // Azul índigo
    "#B85FD9"  // Violeta

];


// ============================================================
// CREAR GRÁFICO DE TIPO PIE / RULETA
// ============================================================

// ============================================================
// CREAR GRÁFICO DE RULETA / PIE
// CADA SEDE TIENE UN COLOR DIFERENTE
// ============================================================

function crearGraficoPie(
    canvas,
    etiquetas,
    valores
) {

    // Paleta de colores para las sedes
    const coloresSedes = [
        "#2563eb", // Azul
        "#16a34a", // Verde
        "#f59e0b", // Amarillo
        "#dc2626", // Rojo
        "#9333ea", // Morado
        "#0891b2", // Celeste
        "#ea580c", // Naranja
        "#db2777", // Rosado
        "#65a30d", // Verde lima
        "#475569"  // Gris
    ];

    // Si ya existe un gráfico en ese canvas,
    // se elimina antes de crear el nuevo
    const graficoExistente =
        Chart.getChart(canvas);

    if (graficoExistente) {
        graficoExistente.destroy();
    }

    return new Chart(
        canvas,
        {
            type: "pie",

            data: {
                labels: etiquetas,

                datasets: [
                    {
                        label: "Registros",

                        data: valores,

                        backgroundColor:
                            etiquetas.map(
                                function(
                                    sede,
                                    indice
                                ) {
                                    return coloresSedes[
                                        indice %
                                        coloresSedes.length
                                    ];
                                }
                            ),

                        borderColor: "#ffffff",

                        borderWidth: 2
                    }
                ]
            },

            options: {
                responsive: true,

                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: "bottom"
                    },

                    tooltip: {
                        callbacks: {
                            label: function(
                                contexto
                            ) {

                                const sede =
                                    contexto.label;

                                const cantidad =
                                    contexto.raw;

                                return (
                                    " " +
                                    sede +
                                    ": " +
                                    cantidad
                                );
                            }
                        }
                    }
                }
            }
        }
    );
}


// ============================================================
// CREAR GRÁFICO DE ÁREA / MONTAÑAS
// ============================================================

function crearGraficoArea(
    canvas,
    etiquetas,
    valores
) {

    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {

        console.error(
            "No se puede crear el gráfico de área."
        );

        return null;

    }


    const grafico =
        new Chart(
            canvas,
            {

                // ====================================================
                // TIPO LINEA
                // ====================================================

                type: "line",


                // ====================================================
                // DATOS
                // ====================================================

                data: {

                    labels:
                        etiquetas,

                    datasets: [

                        {

                            label:
                                "Registros",

                            data:
                                valores,

                            fill:
                                true,

                            tension:
                                0.4,

                            borderColor:
                                "#5FD998",

                            backgroundColor:
                                "rgba(95, 217, 152, 0.25)",

                            borderWidth:
                                3,

                            pointRadius:
                                5,

                            pointHoverRadius:
                                7,

                            pointBorderWidth:
                                2,

                            pointBackgroundColor:
                                "#5FD998",

                            spanGaps:
                                false

                        }

                    ]

                },


                // ====================================================
                // OPCIONES
                // ====================================================

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,


                    // ==================================================
                    // ANIMACIÓN
                    // ==================================================

                    animation: {

                        duration:
                            1200,

                        easing:
                            "easeInOutQuart"

                    },


                    // ==================================================
                    // INTERACCIÓN
                    // ==================================================

                    interaction: {

                        mode:
                            "index",

                        intersect:
                            false

                    },


                    // ==================================================
                    // ESCALAS
                    // ==================================================

                    scales: {

                        x: {

                            grid: {

                                display:
                                    false

                            },

                            ticks: {

                                font: {

                                    size:
                                        12

                                }

                            }

                        },


                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                precision:
                                    0

                            },

                            title: {

                                display:
                                    true,

                                text:
                                    "Cantidad de registros"

                            }

                        }

                    },


                    // ==================================================
                    // PLUGINS
                    // ==================================================

                    plugins: {

                        legend: {

                            display:
                                false

                        },


                        tooltip: {

                            enabled:
                                true,

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            " " +
                                            context.parsed.y +
                                            " registros"
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );


    return grafico;

}


// ============================================================
// OBTENER FECHA SIN PROBLEMAS DE ZONA HORARIA
// ============================================================

function obtenerFechaLocal(
    fecha
) {

    if (
        !fecha
    ) {

        return null;

    }


    const texto =
        fecha
            .toString()
            .trim();


    // ========================================================
    // FECHA YYYY-MM-DD
    // ========================================================

    const coincidencia =
        texto.match(
            /^(\d{4})-(\d{2})-(\d{2})/
        );


    if (
        coincidencia
    ) {

        return new Date(
            Number(
                coincidencia[1]
            ),

            Number(
                coincidencia[2]
            ) - 1,

            Number(
                coincidencia[3]
            )
        );

    }


    // ========================================================
    // OTROS FORMATOS
    // ========================================================

    const fechaConvertida =
        new Date(
            fecha
        );


    if (
        isNaN(
            fechaConvertida.getTime()
        )
    ) {

        return null;

    }


    return fechaConvertida;

}


// ============================================================
// OBTENER LUNES DE LA SEMANA ACTUAL
// ============================================================

function obtenerInicioSemanaActual() {

    const hoy =
        new Date();


    hoy.setHours(
        0,
        0,
        0,
        0
    );


    const dia =
        hoy.getDay();


    // Domingo = 0
    // Lunes = 1
    // Martes = 2
    // ...
    // Sábado = 6

    const diferencia =
        dia === 0
            ? -6
            : 1 - dia;


    const lunes =
        new Date(
            hoy
        );


    lunes.setDate(
        hoy.getDate() +
        diferencia
    );


    lunes.setHours(
        0,
        0,
        0,
        0
    );


    return lunes;

}


// ============================================================
// OBTENER DATOS SEMANALES
// ============================================================

// ============================================================
// OBTENER DATOS DEL GRÁFICO DE ÁREA SEGÚN FECHA
// ============================================================

function obtenerDatosSemanales(
    mantenimientos,
    tipoBuscado,
    sedeSeleccionada
) {

    const fechas = {};

    // ========================================================
    // RECORRER MANTENIMIENTOS
    // ========================================================

    mantenimientos.forEach(
        function(mantenimiento) {

            // ==================================================
            // TIPO
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


            if (
                tipo !== tipoBuscado
            ) {

                return;

            }


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


            if (
                sedeSeleccionada &&
                sede !== sedeSeleccionada
            ) {

                return;

            }


            // ==================================================
            // FECHA DEL MANTENIMIENTO
            // ==================================================

            const fecha =
                obtenerFechaLocal(
                    mantenimiento.fecha
                );


            if (!fecha) {

                return;

            }


            // ==================================================
            // CREAR FECHA SIN HORA
            // ==================================================

            const anio =
                fecha.getFullYear();

            const mes =
                String(
                    fecha.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );

            const dia =
                String(
                    fecha.getDate()
                ).padStart(
                    2,
                    "0"
                );


            const clave =
                `${anio}-${mes}-${dia}`;


            // ==================================================
            // CONTAR MANTENIMIENTOS POR FECHA
            // ==================================================

            if (
                !fechas[clave]
            ) {

                fechas[clave] = 0;

            }


            fechas[clave]++;

        }
    );


    // ========================================================
    // ORDENAR FECHAS
    // ========================================================

    const fechasOrdenadas =
        Object.keys(
            fechas
        ).sort();


    // ========================================================
    // ETIQUETAS
    // ========================================================

    const etiquetas =
        fechasOrdenadas.map(
            function(fecha) {

                const partes =
                    fecha.split("-");

                const anio =
                    Number(
                        partes[0]
                    );

                const mes =
                    Number(
                        partes[1]
                    ) - 1;

                const dia =
                    Number(
                        partes[2]
                    );


                const fechaLocal =
                    new Date(
                        anio,
                        mes,
                        dia
                    );


                return fechaLocal.toLocaleDateString(
                    "es-PE",
                    {
                        day: "2-digit",
                        month: "2-digit"
                    }
                );

            }
        );


    // ========================================================
    // VALORES
    // ========================================================

    const valores =
        fechasOrdenadas.map(
            function(fecha) {

                return fechas[fecha];

            }
        );


    return {

        etiquetas:
            etiquetas,

        valores:
            valores

    };

}


// ============================================================
// MOSTRAR INFORMACIÓN DEL DÍA CON MAYOR ACTIVIDAD
// ============================================================

function mostrarMayorActividad(
    cantidad,
    etiquetas,
    valores
) {

    if (
        !cantidad
    ) {

        return;

    }


    const mayor =
        Math.max(
            ...valores
        );


    if (
        mayor <= 0
    ) {

        cantidad.innerHTML =
            "Sin registros esta semana";

        return;

    }


    const indice =
        valores.indexOf(
            mayor
        );


    cantidad.innerHTML = `

        <strong>
            Mayor actividad:
        </strong>

        ${etiquetas[indice]}

        <strong>
            (${mayor})
        </strong>

        registros

    `;

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
// CONFIGURAR CONTROLES DE UN GRÁFICO
// ============================================================

function configurarGraficoDashboard(
    configuracion
) {

    const {

        idSelectSede,

        idSelectTipo,

        idCantidad,

        canvas,

        mantenimientos,

        tipoMantenimiento,

        etiquetasOriginales,

        valoresOriginales,

        obtenerGrafico,

        asignarGrafico

    } =
        configuracion;


    const selectSede =
        document.getElementById(
            idSelectSede
        );


    const selectTipo =
        document.getElementById(
            idSelectTipo
        );


    const cantidad =
        document.getElementById(
            idCantidad
        );


    if (
        !selectSede ||
        !canvas
    ) {

        return;

    }


    // ==========================================================
    // FUNCIÓN PARA ACTUALIZAR
    // ==========================================================

    function actualizarGrafico() {

        const sedeSeleccionada =
            selectSede.value;


        const tipoGrafico =
            selectTipo
                ? selectTipo.value
                : "pie";


        // ======================================================
        // DESTRUIR GRÁFICO ACTUAL
        // ======================================================

        const graficoActual =
            obtenerGrafico();


        if (
            graficoActual
        ) {

            graficoActual.destroy();

        }


        // ======================================================
        // GRÁFICO DE ÁREA
        // ======================================================

        if (
            tipoGrafico === "area"
        ) {

            const datosSemanales =
                obtenerDatosSemanales(

                    mantenimientos,

                    tipoMantenimiento,

                    sedeSeleccionada

                );


            const nuevoGrafico =
                crearGraficoArea(

                    canvas,

                    datosSemanales.etiquetas,

                    datosSemanales.valores

                );


            asignarGrafico(
                nuevoGrafico
            );


            // ==================================================
            // MOSTRAR DÍA CON MAYOR ACTIVIDAD
            // ==================================================

            mostrarMayorActividad(

                cantidad,

                datosSemanales.etiquetas,

                datosSemanales.valores

            );


            return;

        }


        // ======================================================
        // GRÁFICO DE RULETA
        // ======================================================

        let etiquetas =
            [
                ...etiquetasOriginales
            ];


        let valores =
            [
                ...valoresOriginales
            ];


        if (
            sedeSeleccionada !== ""
        ) {

            const indice =
                etiquetasOriginales.indexOf(
                    sedeSeleccionada
                );


            if (
                indice !== -1
            ) {

                etiquetas = [

                    sedeSeleccionada

                ];


                valores = [

                    valoresOriginales[
                        indice
                    ]

                ];

            }

        }


        const nuevoGrafico =
            crearGraficoPie(

                canvas,

                etiquetas,

                valores

            );


        asignarGrafico(
            nuevoGrafico
        );


        // ======================================================
        // CANTIDAD
        // ======================================================

        if (
            cantidad
        ) {

            if (
                sedeSeleccionada !== ""
            ) {

                const indice =
                    etiquetasOriginales.indexOf(
                        sedeSeleccionada
                    );


                if (
                    indice !== -1
                ) {

                    cantidad.innerHTML = `

                        <strong>
                            ${valoresOriginales[indice]}
                        </strong>

                        registros

                    `;

                }

            }
            else {

                cantidad.innerHTML =
                    "";

            }

        }

    }


    // ==========================================================
    // CAMBIO DE SEDE
    // ==========================================================

    selectSede.onchange =
        function() {

            actualizarGrafico();

        };


    // ==========================================================
    // CAMBIO DE TIPO DE GRÁFICO
    // ==========================================================

    if (
        selectTipo
    ) {

        selectTipo.onchange =
            function() {

                actualizarGrafico();

            };

    }


    // ==========================================================
    // CONFIGURACIÓN INICIAL
    // ==========================================================

    actualizarGrafico();

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
        // VERIFICAR DATOS
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
                // TIPO
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
        // CONSOLA
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
        // CARGAR SEDES
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
        // CERTIFICACIONES
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


        configurarGraficoDashboard({

            idSelectSede:
                "filtroCertificaciones",

            idSelectTipo:
                "tipoGraficoCertificaciones",

            idCantidad:
                "cantidadCertificaciones",

            canvas:
                canvasCertificaciones,

            mantenimientos:
                mantenimientos,

            tipoMantenimiento:
                "certificacion",

            etiquetasOriginales:
                etiquetasCertificaciones,

            valoresOriginales:
                valoresCertificaciones,

            obtenerGrafico:
                function() {

                    return graficoCertificaciones;

                },

            asignarGrafico:
                function(nuevoGrafico) {

                    graficoCertificaciones =
                        nuevoGrafico;

                }

        });


        // ========================================================
        // AVERÍAS
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


        configurarGraficoDashboard({

            idSelectSede:
                "filtroAverias",

            idSelectTipo:
                "tipoGraficoAverias",

            idCantidad:
                "cantidadAverias",

            canvas:
                canvasAverias,

            mantenimientos:
                mantenimientos,

            tipoMantenimiento:
                "averia",

            etiquetasOriginales:
                etiquetasAverias,

            valoresOriginales:
                valoresAverias,

            obtenerGrafico:
                function() {

                    return graficoAverias;

                },

            asignarGrafico:
                function(nuevoGrafico) {

                    graficoAverias =
                        nuevoGrafico;

                }

        });


        // ========================================================
        // CAMBIO DE SPLITTER
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


        configurarGraficoDashboard({

            idSelectSede:
                "filtroSplitter",

            idSelectTipo:
                "tipoGraficoSplitter",

            idCantidad:
                "cantidadSplitter",

            canvas:
                canvasSplitter,

            mantenimientos:
                mantenimientos,

            tipoMantenimiento:
                "cambio de splitter",

            etiquetasOriginales:
                etiquetasSplitters,

            valoresOriginales:
                valoresSplitters,

            obtenerGrafico:
                function() {

                    return graficoSplitters;

                },

            asignarGrafico:
                function(nuevoGrafico) {

                    graficoSplitters =
                        nuevoGrafico;

                }

        });


        // ========================================================
        // TRABAJO EN CAMPO
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


        configurarGraficoDashboard({

            idSelectSede:
                "filtroTrabajoCampo",

            idSelectTipo:
                "tipoGraficoTrabajoCampo",

            idCantidad:
                "cantidadTrabajoCampo",

            canvas:
                canvasTrabajoCampo,

            mantenimientos:
                mantenimientos,

            tipoMantenimiento:
                "trabajo en campo",

            etiquetasOriginales:
                etiquetasTrabajoCampo,

            valoresOriginales:
                valoresTrabajoCampo,

            obtenerGrafico:
                function() {

                    return graficoTrabajoCampo;

                },

            asignarGrafico:
                function(nuevoGrafico) {

                    graficoTrabajoCampo =
                        nuevoGrafico;

                }

        });


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
