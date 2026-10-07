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


    // --------------------------------------------------------
    // ÚLTIMOS 6 MANTENIMIENTOS
    // --------------------------------------------------------

    cargarUltimosMantenimientosDashboard();

}


// ============================================================
// COLORES DE LOS GRÁFICOS
// ============================================================

const COLORES_GRAFICOS = [

    "#5FD998",
    "#5FB9D9",
    "#7A5FD9",
    "#D95F98",
    "#D97A5F",
    "#D9B85F",
    "#5FD9C7",
    "#8FD95F",
    "#5F7FD9",
    "#B85FD9"

];


// ============================================================
// CREAR GRÁFICO DE RULETA / PIE
// CADA SEDE TIENE UN COLOR FIJO
// ============================================================

function crearGraficoPie(
    canvas,
    etiquetas,
    valores
) {

    const coloresPorSede = {

        "LIMA": "#1FD19F",
        "AREQUIPA": "#FF4D6D",
        "CUSCO": "#4361EE",
        "TRUJILLO": "#FFB703",
        "PIURA": "#8338EC",
        "CHICLAYO": "#00B4D8",
        "ICA": "#FB5607",
        "HUANCAYO": "#E639A5",
        "JULIACA": "#3A0CA3",
        "TACNA": "#2A9D8F"

    };


    const coloresAdicionales = [

        "#FF6B6B",
        "#5B5FEF",
        "#F7B731",
        "#A855F7",
        "#00A8CC",
        "#FF8C42",
        "#E84393",
        "#3742FA"

    ];

    let indiceColorAdicional = 0;


    const colores =
        etiquetas.map(
            function(sede) {

                const nombreSede =
                    sede
                        .toString()
                        .trim()
                        .toUpperCase();


                if (
                    coloresPorSede[
                        nombreSede
                    ]
                ) {

                    return coloresPorSede[
                        nombreSede
                    ];

                }


                const color =
                    coloresAdicionales[
                        indiceColorAdicional %
                        coloresAdicionales.length
                    ];

                indiceColorAdicional++;

                return color;

            }
        );


    const graficoExistente =
        Chart.getChart(canvas);

    if (
        graficoExistente
    ) {

        graficoExistente.destroy();

    }


    return new Chart(
        canvas,
        {

            type: "pie",

            data: {

                labels:
                    etiquetas,

                datasets: [

                    {

                        label:
                            "Registros",

                        data:
                            valores,

                        backgroundColor:
                            colores,

                        borderColor:
                            "#ffffff",

                        borderWidth:
                            2,

                        offset:
                            0,

                        hoverOffset:
                            18,

                        hoverBorderWidth:
                            4

                    }

                ]

            },

            options: {

                responsive:
                    true,

                maintainAspectRatio:
                    false,

                interaction: {

                    mode:
                        "nearest",

                    intersect:
                        true

                },

                plugins: {

                    legend: {

                        position:
                            "bottom"

                    },

                    tooltip: {

                        callbacks: {

                            label:
                                function(contexto) {

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

                type:
                    "line",

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

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    animation: {

                        duration:
                            1200,

                        easing:
                            "easeInOutQuart"

                    },

                    interaction: {

                        mode:
                            "index",

                        intersect:
                            false

                    },

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


    // --------------------------------------------------------
    // FECHA YYYY-MM-DD
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // OTROS FORMATOS
    // --------------------------------------------------------

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
// OBTENER DATOS SEGÚN RANGO DE FECHAS
// INCLUYE TODOS LOS DÍAS DEL RANGO
// ============================================================

function obtenerDatosSemanales(
    mantenimientos,
    tipoBuscado,
    sedeSeleccionada,
    fechaDesde,
    fechaHasta
) {

    const fechas = {};

    let inicio = null;
    let fin = null;


    // ========================================================
    // FECHA DESDE
    // ========================================================

    if (fechaDesde) {

        const partes =
            fechaDesde.split("-");

        inicio =
            new Date(
                Number(partes[0]),
                Number(partes[1]) - 1,
                Number(partes[2]),
                0,
                0,
                0,
                0
            );

    }


    // ========================================================
    // FECHA HASTA
    // ========================================================

    if (fechaHasta) {

        const partes =
            fechaHasta.split("-");

        fin =
            new Date(
                Number(partes[0]),
                Number(partes[1]) - 1,
                Number(partes[2]),
                23,
                59,
                59,
                999
            );

    }


    // ========================================================
    // SI SOLO HAY UNA FECHA
    // ========================================================

    if (
        inicio &&
        !fin
    ) {

        fin =
            new Date(
                inicio
            );

        fin.setHours(
            23,
            59,
            59,
            999
        );

    }


    // ========================================================
    // SI SOLO HAY FECHA HASTA
    // ========================================================

    if (
        !inicio &&
        fin
    ) {

        inicio =
            new Date(
                fin
            );

        inicio.setHours(
            0,
            0,
            0,
            0
        );

    }


    // ========================================================
    // RECORRER MANTENIMIENTOS
    // ========================================================

    mantenimientos.forEach(
        function(mantenimiento) {

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


            const fecha =
                obtenerFechaLocal(
                    mantenimiento.fecha
                );


            if (
                !fecha
            ) {

                return;

            }


            if (
                inicio &&
                fecha < inicio
            ) {

                return;

            }


            if (
                fin &&
                fecha > fin
            ) {

                return;

            }


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


            if (
                !fechas[clave]
            ) {

                fechas[clave] = 0;

            }


            fechas[clave]++;

        }
    );


    // ========================================================
    // CREAR TODOS LOS DÍAS DEL RANGO
    // ========================================================

    const fechasOrdenadas = [];


    if (
        inicio &&
        fin
    ) {

        const fechaActual =
            new Date(
                inicio
            );

        fechaActual.setHours(
            0,
            0,
            0,
            0
        );


        const fechaFinal =
            new Date(
                fin
            );

        fechaFinal.setHours(
            0,
            0,
            0,
            0
        );


        while (
            fechaActual <= fechaFinal
        ) {

            const anio =
                fechaActual.getFullYear();

            const mes =
                String(
                    fechaActual.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );

            const dia =
                String(
                    fechaActual.getDate()
                ).padStart(
                    2,
                    "0"
                );


            const clave =
                `${anio}-${mes}-${dia}`;


            fechasOrdenadas.push(
                clave
            );


            fechaActual.setDate(
                fechaActual.getDate() + 1
            );

        }

    }
    else {

        fechasOrdenadas.push(
            ...Object.keys(
                fechas
            ).sort()
        );

    }


    // ========================================================
    // ETIQUETAS
    // ========================================================

    const etiquetas =
        fechasOrdenadas.map(
            function(fecha) {

                const partes =
                    fecha.split("-");


                const fechaLocal =
                    new Date(

                        Number(
                            partes[0]
                        ),

                        Number(
                            partes[1]
                        ) - 1,

                        Number(
                            partes[2]
                        )

                    );


                return fechaLocal.toLocaleDateString(
                    "es-PE",
                    {

                        day:
                            "2-digit",

                        month:
                            "2-digit"

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

                return fechas[fecha] || 0;

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
// FILTRAR MANTENIMIENTOS POR FECHA, TIPO Y SEDE
// ============================================================

function filtrarMantenimientosDashboard(
    mantenimientos,
    tipoBuscado,
    sedeSeleccionada,
    fechaDesde,
    fechaHasta
) {

    let inicio = null;
    let fin = null;


    // ========================================================
    // FECHA DESDE
    // ========================================================

    if (
        fechaDesde
    ) {

        const partes =
            fechaDesde.split("-");

        inicio =
            new Date(

                Number(
                    partes[0]
                ),

                Number(
                    partes[1]
                ) - 1,

                Number(
                    partes[2]
                ),

                0,
                0,
                0,
                0

            );

    }


    // ========================================================
    // FECHA HASTA
    // ========================================================

    if (
        fechaHasta
    ) {

        const partes =
            fechaHasta.split("-");

        fin =
            new Date(

                Number(
                    partes[0]
                ),

                Number(
                    partes[1]
                ) - 1,

                Number(
                    partes[2]
                ),

                23,
                59,
                59,
                999

            );

    }


    return mantenimientos.filter(
        function(mantenimiento) {

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

                return false;

            }


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

                return false;

            }


            const fecha =
                obtenerFechaLocal(
                    mantenimiento.fecha
                );


            if (
                !fecha
            ) {

                return false;

            }


            if (
                inicio &&
                fecha < inicio
            ) {

                return false;

            }


            if (
                fin &&
                fecha > fin
            ) {

                return false;

            }


            return true;

        }
    );

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


    if (
        valores.length === 0
    ) {

        cantidad.innerHTML =
            "Sin registros en el rango seleccionado";

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
            "Sin registros en el rango seleccionado";

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


            select.innerHTML =
                "";


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


            const sedes =
                Object.keys(
                    configuracion.datos
                );


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

        idFechaDesde,

        idFechaHasta,

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


    const inputFechaDesde =
        document.getElementById(
            idFechaDesde
        );


    const inputFechaHasta =
        document.getElementById(
            idFechaHasta
        );


    if (
        !selectSede ||
        !canvas
    ) {

        return;

    }


    // ========================================================
    // ACTUALIZAR GRÁFICO
    // ========================================================

    function actualizarGrafico() {

        const sedeSeleccionada =
            selectSede.value;


        const tipoGrafico =
            selectTipo
                ? selectTipo.value
                : "pie";


        const fechaDesde =
            inputFechaDesde
                ? inputFechaDesde.value
                : "";


        const fechaHasta =
            inputFechaHasta
                ? inputFechaHasta.value
                : "";


        // ====================================================
        // VALIDAR RANGO
        // ====================================================

        if (
            fechaDesde &&
            fechaHasta &&
            fechaDesde > fechaHasta
        ) {

            if (
                cantidad
            ) {

                cantidad.innerHTML =
                    "La fecha inicial no puede ser mayor que la fecha final.";

            }


            return;

        }


        // ====================================================
        // DESTRUIR GRÁFICO ACTUAL
        // ====================================================

        const graficoActual =
            obtenerGrafico();


        if (
            graficoActual
        ) {

            graficoActual.destroy();

        }


        // ====================================================
        // OBTENER MANTENIMIENTOS FILTRADOS
        // ====================================================

        const mantenimientosFiltrados =
            filtrarMantenimientosDashboard(

                mantenimientos,

                tipoMantenimiento,

                sedeSeleccionada,

                fechaDesde,

                fechaHasta

            );


        // ====================================================
        // GRÁFICO DE ÁREA
        // ====================================================

        if (
            tipoGrafico === "area"
        ) {

            const datosSemanales =
                obtenerDatosSemanales(

                    mantenimientos,

                    tipoMantenimiento,

                    sedeSeleccionada,

                    fechaDesde,

                    fechaHasta

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


            mostrarMayorActividad(

                cantidad,

                datosSemanales.etiquetas,

                datosSemanales.valores

            );


            return;

        }


        // ====================================================
        // GRÁFICO DE RULETA
        // ====================================================

        const datosPorSede = {};


        mantenimientosFiltrados.forEach(
            function(mantenimiento) {

                const sede =
                    (
                        mantenimiento.sede ||
                        "Sin sede"
                    )
                    .toString()
                    .trim();


                datosPorSede[sede] =
                    (
                        datosPorSede[sede] ||
                        0
                    ) + 1;

            }
        );


        let etiquetas =
            Object.keys(
                datosPorSede
            );


        let valores =
            Object.values(
                datosPorSede
            );


        // ====================================================
        // ORDENAR SEDES
        // ====================================================

        const datosOrdenados =
            etiquetas
                .map(
                    function(sede, indice) {

                        return {

                            sede:
                                sede,

                            valor:
                                valores[indice]

                        };

                    }
                )
                .sort(
                    function(a, b) {

                        return a.sede.localeCompare(
                            b.sede,
                            "es",
                            {
                                sensitivity:
                                    "base"
                            }
                        );

                    }
                );


        etiquetas =
            datosOrdenados.map(
                function(item) {

                    return item.sede;

                }
            );


        valores =
            datosOrdenados.map(
                function(item) {

                    return item.valor;

                }
            );


        // ====================================================
        // CREAR RULETA
        // ====================================================

        const nuevoGrafico =
            crearGraficoPie(

                canvas,

                etiquetas,

                valores

            );


        asignarGrafico(
            nuevoGrafico
        );


        // ====================================================
        // MOSTRAR CANTIDAD
        // ====================================================

        if (
            cantidad
        ) {

            const total =
                mantenimientosFiltrados.length;


            if (
                total > 0
            ) {

                cantidad.innerHTML = `

                    <strong>
                        ${total}
                    </strong>

                    registros

                `;

            }
            else {

                cantidad.innerHTML =
                    "Sin registros en el rango seleccionado";

            }

        }

    }


    // ========================================================
    // CAMBIO DE SEDE
    // ========================================================

    selectSede.onchange =
        function() {

            actualizarGrafico();

        };


    // ========================================================
    // CAMBIO DE TIPO DE GRÁFICO
    // ========================================================

    if (
        selectTipo
    ) {

        selectTipo.onchange =
            function() {

                actualizarGrafico();

            };

    }


    // ========================================================
    // CAMBIO DE FECHA DESDE
    // ========================================================

    if (
        inputFechaDesde
    ) {

        inputFechaDesde.addEventListener(
            "change",
            actualizarGrafico
        );

    }


    // ========================================================
    // CAMBIO DE FECHA HASTA
    // ========================================================

    if (
        inputFechaHasta
    ) {

        inputFechaHasta.addEventListener(
            "change",
            actualizarGrafico
        );

    }


    // ========================================================
    // CONFIGURACIÓN INICIAL
    // ========================================================

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

                const sede =
                    (
                        mantenimiento.sede ||
                        "Sin sede"
                    )
                    .toString()
                    .trim();


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


                // ------------------------------------------------
                // CERTIFICACIONES
                // ------------------------------------------------

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


                // ------------------------------------------------
                // AVERÍAS
                // ------------------------------------------------

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


                // ------------------------------------------------
                // CAMBIO DE SPLITTER
                // ------------------------------------------------

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


                // ------------------------------------------------
                // TRABAJO EN CAMPO
                // ------------------------------------------------

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

        configurarGraficoDashboard({

            idSelectSede:
                "filtroCertificaciones",

            idSelectTipo:
                "tipoGraficoCertificaciones",

            idCantidad:
                "cantidadCertificaciones",

            idFechaDesde:
                "fechaDesdeCertificaciones",

            idFechaHasta:
                "fechaHastaCertificaciones",

            canvas:
                document.getElementById(
                    "graficoCertificaciones"
                ),

            mantenimientos:
                mantenimientos,

            tipoMantenimiento:
                "certificacion",

            etiquetasOriginales:
                Object.keys(
                    certificaciones
                ),

            valoresOriginales:
                Object.values(
                    certificaciones
                ),

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

        configurarGraficoDashboard({

            idSelectSede:
                "filtroAverias",

            idSelectTipo:
                "tipoGraficoAverias",

            idCantidad:
                "cantidadAverias",

            idFechaDesde:
                "fechaDesdeAverias",

            idFechaHasta:
                "fechaHastaAverias",

            canvas:
                document.getElementById(
                    "graficoAverias"
                ),

            mantenimientos:
                mantenimientos,

            tipoMantenimiento:
                "averia",

            etiquetasOriginales:
                Object.keys(
                    averias
                ),

            valoresOriginales:
                Object.values(
                    averias
                ),

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

        configurarGraficoDashboard({

            idSelectSede:
                "filtroSplitter",

            idSelectTipo:
                "tipoGraficoSplitter",

            idCantidad:
                "cantidadSplitter",

            idFechaDesde:
                "fechaDesdeSplitter",

            idFechaHasta:
                "fechaHastaSplitter",

            canvas:
                document.getElementById(
                    "graficoSplitter"
                ),

            mantenimientos:
                mantenimientos,

            tipoMantenimiento:
                "cambio de splitter",

            etiquetasOriginales:
                Object.keys(
                    splitters
                ),

            valoresOriginales:
                Object.values(
                    splitters
                ),

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

        configurarGraficoDashboard({

            idSelectSede:
                "filtroTrabajoCampo",

            idSelectTipo:
                "tipoGraficoTrabajoCampo",

            idCantidad:
                "cantidadTrabajoCampo",

            idFechaDesde:
                "fechaDesdeTrabajoCampo",

            idFechaHasta:
                "fechaHastaTrabajoCampo",

            canvas:
                document.getElementById(
                    "graficoTrabajoCampo"
                ),

            mantenimientos:
                mantenimientos,

            tipoMantenimiento:
                "trabajo en campo",

            etiquetasOriginales:
                Object.keys(
                    trabajoCampo
                ),

            valoresOriginales:
                Object.values(
                    trabajoCampo
                ),

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


// ============================================================
// CARGAR ÚLTIMOS 6 MANTENIMIENTOS
// ============================================================

async function cargarUltimosMantenimientosDashboard() {

    try {

        // --------------------------------------------------------
        // OBTENER MANTENIMIENTOS
        // --------------------------------------------------------

        const respuesta =
            await fetch(
                "/api/mantenimientos"
            );


        if (
            !respuesta.ok
        ) {

            throw new Error(
                "Error al obtener los mantenimientos"
            );

        }


        const mantenimientos =
            await respuesta.json();


        // --------------------------------------------------------
        // TABLA DEL DASHBOARD
        // --------------------------------------------------------

        const tabla =
            document.getElementById(
                "tablaUltimosMantenimientos"
            );


        if (
            !tabla
        ) {

            console.warn(
                "No se encontró #tablaUltimosMantenimientos"
            );

            return;

        }


        // --------------------------------------------------------
        // ORDENAR DEL MÁS RECIENTE AL MÁS ANTIGUO
        // --------------------------------------------------------

        const mantenimientosOrdenados =
            [...mantenimientos].sort(
                function(a, b) {

                    const fechaA =
                        obtenerFechaLocal(
                            a.fecha
                        );


                    const fechaB =
                        obtenerFechaLocal(
                            b.fecha
                        );


                    if (
                        !fechaA &&
                        !fechaB
                    ) {

                        return 0;

                    }


                    if (
                        !fechaA
                    ) {

                        return 1;

                    }


                    if (
                        !fechaB
                    ) {

                        return -1;

                    }


                    return (
                        fechaB.getTime() -
                        fechaA.getTime()
                    );

                }
            );


        // --------------------------------------------------------
        // TOMAR SOLAMENTE LOS 6 MÁS RECIENTES
        // --------------------------------------------------------

        const ultimosSeis =
            mantenimientosOrdenados.slice(
                0,
                6
            );


        // --------------------------------------------------------
        // LIMPIAR TABLA
        // --------------------------------------------------------

        tabla.innerHTML =
            "";


        // --------------------------------------------------------
        // SI NO EXISTEN MANTENIMIENTOS
        // --------------------------------------------------------

        if (
            ultimosSeis.length === 0
        ) {

            tabla.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        style="text-align:center;"
                    >
                        No hay mantenimientos registrados
                    </td>

                </tr>

            `;

            return;

        }


        // --------------------------------------------------------
        // CREAR FILAS
        // --------------------------------------------------------

        ultimosSeis.forEach(
            function(mantenimiento) {

                const fila =
                    document.createElement(
                        "tr"
                    );


                // ------------------------------------------------
                // FECHA
                // ------------------------------------------------

                const fecha =
                    obtenerFechaLocal(
                        mantenimiento.fecha
                    );


                const fechaTexto =
                    fecha
                        ? fecha.toLocaleDateString(
                            "es-PE"
                        )
                        : "Sin fecha";


                // ------------------------------------------------
                // CÓDIGO
                // ------------------------------------------------

                const codigo =
                    mantenimiento.codigo ||
                    mantenimiento.codigo_proyecto ||
                    "Sin código";


                // ------------------------------------------------
                // PROYECTO
                // ------------------------------------------------

                const proyecto =
                    mantenimiento.proyecto ||
                    mantenimiento.nombre_proyecto ||
                    mantenimiento.proyecto_nombre ||
                    "Sin proyecto";


                // ------------------------------------------------
                // CUADRILLA
                // ------------------------------------------------

                const cuadrilla =
                    mantenimiento.cuadrilla ||
                    "Sin cuadrilla";


                // ------------------------------------------------
                // TRABAJO
                // ------------------------------------------------

                const trabajo =
    
    mantenimiento.descripcion ||
    "Sin descripción";


                // ------------------------------------------------
                // ESTADO
                // ------------------------------------------------

                const estado =
                    mantenimiento.estado ||
                    "Sin estado";


                // ------------------------------------------------
                // TIPO
                // ------------------------------------------------

                const tipo =
                    mantenimiento.tipo_mantenimiento ||
                    mantenimiento.tipo ||
                    "Sin tipo";


                // ------------------------------------------------
                // CREAR FILA
                // ------------------------------------------------

                fila.innerHTML = `

                    <td>
                        ${fechaTexto}
                    </td>

                    <td>
                        ${codigo}
                    </td>

                    <td>
                        ${proyecto}
                    </td>

                    <td>
                        ${cuadrilla}
                    </td>

                    <td>
                        ${trabajo}
                    </td>

                    <td>
                        ${estado}
                    </td>

                    <td>
                        ${tipo}
                    </td>

                `;


                tabla.appendChild(
                    fila
                );

            }
        );


        console.log(
            "Últimos 6 mantenimientos cargados correctamente."
        );

    }
    catch (error) {

        console.error(
            "Error cargando últimos mantenimientos:",
            error
        );

    }

}
