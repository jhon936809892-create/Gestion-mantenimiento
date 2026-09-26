// ========================================
// VARIABLES
// ========================================

let proyectos = [];
let calendarioMantenimiento = null;
let resizeCalendarioPendiente = false;


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

        /* ========================================
           BOTONES DEL MODAL PERSONAL
        ======================================== */

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


        /* ========================================
           BOTÓN GUARDAR
        ======================================== */

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


        /* ========================================
           BOTÓN CANCELAR
        ======================================== */

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


        /* ========================================
           CONFIRMACIÓN DE CANCELACIÓN
        ======================================== */

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


        /* ========================================
           BOTONES DE EDICIÓN PERSONAL
        ======================================== */

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


    // ========================================
    // BOTÓN GUARDAR
    // ========================================

    const botonGuardar =
        document.getElementById("btnGuardarPersonal");

    if (botonGuardar) {

        botonGuardar.classList.add(
            "btn-guardar-personal"
        );

        botonGuardar.type = "submit";

    }


    // ========================================
    // BUSCAR BOTÓN CANCELAR
    // ========================================

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

            if (
                texto.includes("cancelar")
            ) {

                botonCancelar = boton;

            }

        });

    }


    // ========================================
    // CONFIGURAR CANCELAR
    // ========================================

    if (botonCancelar) {

        botonCancelar.id =
            botonCancelar.id ||
            "btnCancelarPersonal";

        botonCancelar.type = "button";

        botonCancelar.classList.add(
            "btn-cancelar-personal"
        );


        // Evitar eventos duplicados
        botonCancelar.onclick = null;


        botonCancelar.onclick =
            function(event) {

                event.preventDefault();
                event.stopPropagation();

                cancelarEdicionPersonal();

            };

    }


    // ========================================
    // COLOCAR BOTONES A LA DERECHA
    // ========================================

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


    if (
        typeof FullCalendar ===
        "undefined"
    ) {

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


                // ========================================
                // CARGAR EVENTOS
                // ========================================

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


                // ========================================
                // CLICK EN MANTENIMIENTO
                // ========================================

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


            // ========================================
            // DESACTIVAR EDICIÓN
            // ========================================

            if (modoEdicion) {

                if (botonesExistentes) {

                    botonesExistentes.remove();

                }

                return;

            }


            // ========================================
            // ACTIVAR EDICIÓN
            // ========================================

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


            if (
                fila.lastElementChild
            ) {

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


    // ========================================
    // TÍTULOS
    // ========================================

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


    // ========================================
    // BOTÓN TOPBAR
    // ========================================

    const botonTopbar =
        document.getElementById(
            "botonTopbar"
        );


    if (botonTopbar) {

        botonTopbar.innerHTML = "";


        if (
            seccion === "personal"
        ) {

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


        else if (
            seccion === "proyectos"
        ) {

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


        else if (
            seccion === "mantenimiento"
        ) {

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


        else if (
            seccion === "materiales"
        ) {

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


    // ========================================
    // CARGAR DATOS
    // ========================================

    if (
        seccion === "personal"
    ) {

        cargarPersonal();

    }


    if (
        seccion === "cuadrillas"
    ) {

        cargarPersonal();

    }


    if (
        seccion === "proyectos"
    ) {

        cargarProyectos();

    }


    if (
        seccion === "mantenimiento"
    ) {

        cargarProyectos();

        cargarMantenimientos();


        setTimeout(
            function() {

                inicializarCalendarioMantenimiento();


                if (
                    calendarioMantenimiento
                ) {

                    calendarioMantenimiento.updateSize();

                    calendarioMantenimiento.refetchEvents();

                }

            },
            150
        );

    }


    if (
        seccion === "materiales"
    ) {

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
            "documento"
        );


    const celular =
        document.getElementById(
            "celular"
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


    if (modal) {

        modal.classList.add(
            "active"
        );

    }

}


// ========================================
// MODAL MATERIAL
// ========================================

async function abrirModalMaterial() {

    await cargarProyectos();


    const modal =
        document.getElementById(
            "modalMaterial"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

    }

}


// ========================================
// CANCELAR EDICIÓN DE PERSONAL
// ========================================

function cancelarEdicionPersonal() {

    const idPersonal =
        document.getElementById(
            "idPersonal"
        );


    // No estamos editando
    if (
        !idPersonal ||
        idPersonal.value.trim() === ""
    ) {

        cerrarModalPersonal();

        return;

    }


    // Estamos editando
    mostrarConfirmacionCancelar();

}


// ========================================
// MOSTRAR CONFIRMACIÓN
// ========================================

function mostrarConfirmacionCancelar() {

    const existente =
        document.getElementById(
            "modalConfirmarCancelar"
        );


    if (existente) {

        return;

    }


    const modalConfirmacion =
        document.createElement(
            "div"
        );


    modalConfirmacion.id =
        "modalConfirmarCancelar";


    modalConfirmacion.className =
        "modal-confirmacion";


    modalConfirmacion.innerHTML = `

        <div class="modal-confirmacion-contenido">

            <h2>
                ¿Cancelar edición?
            </h2>

            <p>
                ¿Está seguro de que desea cancelar?
            </p>

            <p class="texto-advertencia">
                Se perderán los cambios realizados.
            </p>

            <div class="botones-confirmacion">

                <button
                    type="button"
                    class="btn-no-cancelar"
                    onclick="cerrarConfirmacionCancelar()"
                >
                    No
                </button>

                <button
                    type="button"
                    class="btn-si-cancelar"
                    onclick="confirmarCancelacionPersonal()"
                >
                    Sí, cancelar
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modalConfirmacion
    );


    requestAnimationFrame(
        function() {

            modalConfirmacion.classList.add(
                "active"
            );

        }
    );

}


// ========================================
// CERRAR CONFIRMACIÓN - NO
// ========================================

function cerrarConfirmacionCancelar() {

    const modal =
        document.getElementById(
            "modalConfirmarCancelar"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "active"
    );


    setTimeout(
        function() {

            if (modal) {

                modal.remove();

            }

        },
        200
    );

}


// ========================================
// CONFIRMAR CANCELACIÓN - SÍ
// ========================================

function confirmarCancelacionPersonal() {

    const modalConfirmacion =
        document.getElementById(
            "modalConfirmarCancelar"
        );


    if (modalConfirmacion) {

        modalConfirmacion.remove();

    }


    cerrarModalPersonal();

}


// ========================================
// CERRAR MODAL PERSONAL
// ========================================
// ESTA ES LA ÚNICA FUNCIÓN cerrarModalPersonal()
// ========================================

function cerrarModalPersonal() {

    // ========================================
    // CERRAR CONFIRMACIÓN
    // ========================================

    const confirmacion =
        document.getElementById(
            "modalConfirmarCancelar"
        );


    if (confirmacion) {

        confirmacion.remove();

    }


    // ========================================
    // CERRAR MODAL
    // ========================================

    const modal =
        document.getElementById(
            "modalPersonal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }


    // ========================================
    // LIMPIAR FORMULARIO
    // ========================================

    const formulario =
        document.getElementById(
            "formPersonal"
        );


    if (formulario) {

        formulario.reset();

    }


    // ========================================
    // LIMPIAR ID
    // ========================================

    const id =
        document.getElementById(
            "idPersonal"
        );


    if (id) {

        id.value = "";

    }


    // ========================================
    // RESTAURAR TÍTULO
    // ========================================

    const titulo =
        document.getElementById(
            "tituloModalPersonal"
        );


    if (titulo) {

        titulo.textContent =
            "Registrar personal";

    }


    // ========================================
    // RESTAURAR BOTÓN
    // ========================================

    const boton =
        document.getElementById(
            "btnGuardarPersonal"
        );


    if (boton) {

        boton.textContent =
            "Guardar personal";

        boton.classList.add(
            "btn-guardar-personal"
        );

    }


    // ========================================
    // LIMPIAR ERRORES
    // ========================================

    limpiarErroresPersonal();

}


// ========================================
// EDITAR PERSONAL
// ========================================

async function editarPersonal(id) {

    try {

        const respuesta =
            await fetch(`/api/personal/${id}`);

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo obtener el personal"
            );

        }

        const persona =
            await respuesta.json();


        // ========================================
        // CARGAR DATOS EN EL FORMULARIO
        // ========================================

        document.getElementById(
            "idPersonal"
        ).value = persona.id || "";


        document.getElementById(
            "nombresPersonal"
        ).value = persona.nombres || "";


        document.getElementById(
            "apellidosPersonal"
        ).value = persona.apellidos || "";


        document.getElementById(
            "tipoDocumentoPersonal"
        ).value = "DNI";


        document.getElementById(
            "documentoPersonal"
        ).value = persona.documento || "";


        document.getElementById(
            "celularPersonal"
        ).value = persona.celular || "";


        document.getElementById(
            "cargoPersonal"
        ).value = persona.cargo || "";


        document.getElementById(
            "cuadrillaPersonal"
        ).value = persona.cuadrilla_id || "";


        // ========================================
        // CAMBIAR TÍTULO
        // ========================================

        const titulo =
            document.getElementById(
                "tituloModalPersonal"
            );

        if (titulo) {

            titulo.textContent =
                "Editar personal";

        }


        // ========================================
        // CAMBIAR TEXTO DEL BOTÓN
        // ========================================

        const boton =
            document.getElementById(
                "btnGuardarPersonal"
            );

        if (boton) {

            boton.textContent =
                "Guardar cambios";

        }


        // ========================================
        // ABRIR MODAL
        // ========================================

        const modal =
            document.getElementById(
                "modalPersonal"
            );

        if (modal) {

            modal.classList.add(
                "active"
            );

        }


        // ========================================
        // CONFIGURAR BOTONES
        // ========================================

        configurarBotonesModalPersonal();

    }
    catch (error) {

        console.error(
            "Error editando personal:",
            error
        );

        alert(
            "No se pudo cargar la información del personal."
        );

    }

}


// ========================================
// REGISTRAR / ACTUALIZAR PERSONAL
// ========================================

async function registrarPersonal(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "idPersonal"
        ).value.trim();


    const datos = {

        nombres:
            document.getElementById(
                "nombresPersonal"
            ).value.trim(),

        apellidos:
            document.getElementById(
                "apellidosPersonal"
            ).value.trim(),

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


    // ========================================
    // VALIDACIONES
    // ========================================

    if (
        !datos.nombres ||
        !datos.apellidos ||
        !datos.documento
    ) {

        alert(
            "Nombres, apellidos y DNI son obligatorios."
        );

        return;

    }


    if (
        !/^[0-9]{8}$/.test(
            datos.documento
        )
    ) {

        alert(
            "El DNI debe tener exactamente 8 dígitos."
        );

        return;

    }


    if (
        datos.celular &&
        !/^[0-9]{9}$/.test(
            datos.celular
        )
    ) {

        alert(
            "El celular debe tener 9 dígitos."
        );

        return;

    }


    try {

        // ========================================
        // SI HAY ID → EDITAR
        // ========================================

        let respuesta;


        if (id) {

            respuesta =
                await fetch(
                    `/api/personal/${id}`,
                    {

                        method:
                            "PUT",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                datos
                            )

                    }
                );

        }


        // ========================================
        // SI NO HAY ID → REGISTRAR
        // ========================================

        else {

            respuesta =
                await fetch(
                    "/api/personal",
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                datos
                            )

                    }
                );

        }


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            alert(
                resultado.error ||
                "No se pudo guardar el personal."
            );

            return;

        }


        // ========================================
        // MENSAJE
        // ========================================

        if (id) {

            alert(
                "Personal actualizado correctamente."
            );

        }

        else {

            alert(
                "Personal registrado correctamente."
            );

        }


        // ========================================
        // CERRAR MODAL
        // ========================================

        cerrarModalPersonal();


        // ========================================
        // ACTUALIZAR TABLA
        // ========================================

        await cargarPersonal();


        // ========================================
        // ACTUALIZAR CUADRILLAS
        // ========================================

        actualizarCuadrillas(
            await (
                await fetch(
                    "/api/personal"
                )
            ).json()
        );

    }
    catch (error) {

        console.error(
            "Error guardando personal:",
            error
        );

        alert(
            "No se pudo conectar con el servidor."
        );

    }

}

// ========================================
// EDITAR PERSONAL
// ========================================

async function editarPersonal(id) {

    try {

        const respuesta =
            await fetch(`/api/personal/${id}`);


        if (!respuesta.ok) {

            const resultado =
                await respuesta.json();

            alert(
                resultado.error ||
                "No se pudo obtener el personal."
            );

            return;

        }


        const persona =
            await respuesta.json();


        // ========================================
        // CARGAR DATOS
        // ========================================

        document.getElementById(
            "idPersonal"
        ).value =
            persona.id || "";


        document.getElementById(
            "nombresPersonal"
        ).value =
            persona.nombres || "";


        document.getElementById(
            "apellidosPersonal"
        ).value =
            persona.apellidos || "";


        document.getElementById(
            "tipoDocumentoPersonal"
        ).value =
            "DNI";


        document.getElementById(
            "documentoPersonal"
        ).value =
            persona.documento || "";


        document.getElementById(
            "celularPersonal"
        ).value =
            persona.celular || "";


        document.getElementById(
            "cargoPersonal"
        ).value =
            persona.cargo || "";


        document.getElementById(
            "cuadrillaPersonal"
        ).value =
            persona.cuadrilla_id || "";


        // ========================================
        // CAMBIAR TÍTULO
        // ========================================

        const titulo =
            document.getElementById(
                "tituloModalPersonal"
            );


        if (titulo) {

            titulo.textContent =
                "Editar personal";

        }


        // ========================================
        // CAMBIAR BOTÓN
        // ========================================

        const boton =
            document.getElementById(
                "btnGuardarPersonal"
            );


        if (boton) {

            boton.textContent =
                "Guardar cambios";

        }


        // ========================================
        // ABRIR MODAL
        // ========================================

        const modal =
            document.getElementById(
                "modalPersonal"
            );


        if (modal) {

            modal.classList.add(
                "active"
            );

        }


        // ========================================
        // CONFIGURAR BOTONES
        // ========================================

        configurarBotonesModalPersonal();

    }
    catch (error) {

        console.error(
            "Error editando personal:",
            error
        );


        alert(
            "No se pudo cargar la información del personal."
        );

    }

}

// ========================================
// ELIMINAR PERSONAL
// ========================================

async function eliminarPersonal(id) {

    const confirmar =
        confirm(
            "¿Está seguro de eliminar este personal?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                `/api/personal/${id}`,
                {
                    method:
                        "DELETE"
                }
            );


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            alert(
                resultado.error ||
                "No se pudo eliminar el personal."
            );

            return;

        }


        alert(
            "Personal eliminado correctamente."
        );


        await cargarPersonal();

    }
    catch (error) {

        console.error(
            "Error eliminando el personal:",
            error
        );


        alert(
            "No se pudo conectar con el servidor."
        );

    }

}


// ========================================
// ACTUALIZAR CUADRILLAS
// ========================================

function actualizarCuadrillas(personal) {

    const c1 =
        document.getElementById(
            "cuadrilla1"
        );


    const c2 =
        document.getElementById(
            "cuadrilla2"
        );


    const c3 =
        document.getElementById(
            "cuadrilla3"
        );


    if (
        !c1 ||
        !c2 ||
        !c3
    ) {

        return;

    }


    c1.innerHTML = "";
    c2.innerHTML = "";
    c3.innerHTML = "";


    let cantidad1 = 0;
    let cantidad2 = 0;
    let cantidad3 = 0;


    personal.forEach(
        function(persona) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "tecnico";


            div.innerHTML = `

                <strong>
                    ${persona.nombres || ""}
                    ${persona.apellidos || ""}
                </strong>

                <small>
                    ${persona.cargo || "Sin cargo"}
                </small>

            `;


            if (
                String(
                    persona.cuadrilla_id
                ) === "1"
            ) {

                c1.appendChild(div);

                cantidad1++;

            }

            else if (
                String(
                    persona.cuadrilla_id
                ) === "2"
            ) {

                c2.appendChild(div);

                cantidad2++;

            }

            else if (
                String(
                    persona.cuadrilla_id
                ) === "3"
            ) {

                c3.appendChild(div);

                cantidad3++;

            }

        }
    );


    const cantidadC1 =
        document.getElementById(
            "cantidadC1"
        );


    const cantidadC2 =
        document.getElementById(
            "cantidadC2"
        );


    const cantidadC3 =
        document.getElementById(
            "cantidadC3"
        );


    if (cantidadC1) {

        cantidadC1.textContent =
            cantidad1 + " técnicos";

    }


    if (cantidadC2) {

        cantidadC2.textContent =
            cantidad2 + " técnicos";

    }


    if (cantidadC3) {

        cantidadC3.textContent =
            cantidad3 + " técnicos";

    }

}

// ========================================
// CARGAR PERSONAL
// ========================================

async function cargarPersonal() {

    try {

        const respuesta =
            await fetch("/api/personal");


        if (!respuesta.ok) {

            throw new Error(
                "Error al obtener el personal"
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


        personal.forEach(
            function(persona) {

                const fila =
                    document.createElement("tr");


                fila.dataset.id =
                    persona.id;


                fila.innerHTML = `

                    <td>
                        ${persona.nombres || ""}
                    </td>

                    <td>
                        ${persona.apellidos || ""}
                    </td>

                    <td>
                        ${persona.documento || ""}
                    </td>

                    <td>
                        ${persona.celular || ""}
                    </td>

                    <td>
                        ${persona.cargo || ""}
                    </td>

                    <td>
                        ${persona.cuadrilla_id || ""}
                    </td>

                `;


                tabla.appendChild(fila);

            }
        );


        actualizarCuadrillas(personal);

    }
    catch (error) {

        console.error(
            "Error cargando personal:",
            error
        );

    }

}
// ========================================
// REGISTRAR PROYECTO
// ========================================

async function registrarProyecto(event) {

    event.preventDefault();


    const datos = {

        nombre:
            document
                .getElementById(
                    "nombreProyecto"
                )
                .value
                .trim(),

        cuadrilla:
            document
                .getElementById(
                    "cuadrillaProyecto"
                )
                .value,

        responsable:
            document
                .getElementById(
                    "responsableProyecto"
                )
                .value
                .trim(),

        fecha:
            document
                .getElementById(
                    "fechaProyecto"
                )
                .value,

        estado:
            document
                .getElementById(
                    "estadoProyecto"
                )
                .value

    };


    if (!datos.nombre) {

        alert(
            "Ingrese el nombre del proyecto."
        );

        return;

    }


    try {

        const respuesta =
            await fetch(
                "/api/proyectos",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            datos
                        )

                }
            );


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            alert(
                resultado.error ||
                "No se pudo registrar el proyecto."
            );

            return;

        }


        alert(
            "Proyecto registrado correctamente."
        );


        cerrarModal(
            "modalProyecto"
        );


        const formulario =
            document.querySelector(
                "#modalProyecto form"
            );


        if (formulario) {

            formulario.reset();

        }


        await cargarProyectos();

    }
    catch (error) {

        console.error(
            "Error registrando proyecto:",
            error
        );


        alert(
            "No se pudo conectar con el servidor."
        );

    }

}


// ========================================
// CARGAR PROYECTOS
// ========================================

async function cargarProyectos() {

    try {

        const respuesta =
            await fetch(
                "/api/proyectos"
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error al obtener proyectos"
            );

        }


        proyectos =
            await respuesta.json();


        const tabla =
            document.getElementById(
                "tablaProyectos"
            );


        if (tabla) {

            tabla.innerHTML = "";


            proyectos.forEach(
                function(proyecto) {

                    const fila =
                        document.createElement(
                            "tr"
                        );


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


                    tabla.appendChild(
                        fila
                    );

                }
            );

        }


        const total =
            document.getElementById(
                "totalProyectos"
            );


        if (total) {

            total.textContent =
                proyectos.length;

        }


        cargarSelectProyectos();

    }
    catch (error) {

        console.error(
            "Error cargando proyectos:",
            error
        );

    }

}


// ========================================
// CARGAR PROYECTOS EN SELECT
// ========================================

function cargarSelectProyectos() {

    const selects = [

        document.getElementById(
            "proyectoMaterial"
        ),

        document.getElementById(
            "proyectoMantenimiento"
        )

    ];


    selects.forEach(
        function(select) {

            if (!select) {

                return;

            }


            const valorActual =
                select.value;


            select.innerHTML = `

                <option value="">
                    Seleccione un proyecto
                </option>

            `;


            proyectos.forEach(
                function(proyecto) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        proyecto.id;


                    option.textContent =
                        proyecto.nombre;


                    select.appendChild(
                        option
                    );

                }
            );


            if (valorActual) {

                select.value =
                    valorActual;

            }

        }
    );

}


// ========================================
// REGISTRAR MATERIAL
// ========================================

async function registrarMaterial(event) {

    event.preventDefault();


    const proyecto =
        document
            .getElementById(
                "proyectoMaterial"
            )
            .value;


    const material =
        document
            .getElementById(
                "nombreMaterial"
            )
            .value
            .trim();


    const cantidad =
        document
            .getElementById(
                "cantidadMaterial"
            )
            .value;


    const unidad =
        document
            .getElementById(
                "unidadMaterial"
            )
            .value;


    if (!proyecto) {

        alert(
            "Debe seleccionar un proyecto."
        );

        return;

    }


    if (!material) {

        alert(
            "Debe ingresar el material."
        );

        return;

    }


    if (
        !cantidad ||
        Number(cantidad) <= 0
    ) {

        alert(
            "La cantidad debe ser mayor a 0."
        );

        return;

    }


    if (!unidad) {

        alert(
            "Debe seleccionar una unidad."
        );

        return;

    }


    const datos = {

        proyecto_id:
            Number(proyecto),

        material:
            material,

        cantidad:
            Number(cantidad),

        unidad:
            unidad

    };


    try {

        const respuesta =
            await fetch(
                "/api/materiales",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            datos
                        )

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


        const formulario =
            document.querySelector(
                "#modalMaterial form"
            );


        if (formulario) {

            formulario.reset();

        }


        cargarMateriales();

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


// ========================================
// CARGAR MATERIALES
// ========================================

async function cargarMateriales() {

    try {

        const respuesta =
            await fetch(
                "/api/materiales"
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error al obtener materiales"
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


        materiales.forEach(
            function(material) {

                const fila =
                    document.createElement(
                        "tr"
                    );


                fila.innerHTML = `

                    <td>
                        ${material.material || ""}
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


                tabla.appendChild(
                    fila
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Error cargando materiales:",
            error
        );

    }

}


// ========================================
// REGISTRAR MANTENIMIENTO
// ========================================

async function registrarMantenimiento(event) {

    event.preventDefault();


    const datos = {

        fecha:
            document
                .getElementById(
                    "fechaMantenimiento"
                )
                .value,

        proyecto_id:
            Number(
                document
                    .getElementById(
                        "proyectoMantenimiento"
                    )
                    .value
            ),

        cuadrilla:
            document
                .getElementById(
                    "cuadrillaMantenimiento"
                )
                .value,

        trabajo:
            document
                .getElementById(
                    "trabajoMantenimiento"
                )
                .value
                .trim(),

        estado:
            document
                .getElementById(
                    "estadoMantenimiento"
                )
                .value

    };


    if (!datos.fecha) {

        alert(
            "Debe seleccionar una fecha."
        );

        return;

    }


    if (!datos.proyecto_id) {

        alert(
            "Debe seleccionar un proyecto."
        );

        return;

    }


    if (!datos.trabajo) {

        alert(
            "Debe ingresar la descripción del trabajo."
        );

        return;

    }


    try {

        const respuesta =
            await fetch(
                "/api/mantenimientos",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            datos
                        )

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


        cerrarModal(
            "modalMantenimiento"
        );


        const formulario =
            document.querySelector(
                "#modalMantenimiento form"
            );


        if (formulario) {

            formulario.reset();

        }


        await cargarMantenimientos();


        if (
            calendarioMantenimiento
        ) {

            calendarioMantenimiento.refetchEvents();

        }

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


// ========================================
// CARGAR MANTENIMIENTOS
// ========================================

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


        const tabla =
            document.getElementById(
                "tablaMantenimiento"
            );


        if (tabla) {

            tabla.innerHTML = "";


            mantenimientos.forEach(
                function(mantenimiento) {

                    const fila =
                        document.createElement(
                            "tr"
                        );


                    fila.innerHTML = `

                        <td>
                            ${mantenimiento.fecha || ""}
                        </td>

                        <td>
                            ${mantenimiento.proyecto || ""}
                        </td>

                        <td>
                            Cuadrilla
                            ${mantenimiento.cuadrilla || ""}
                        </td>

                        <td>
                            ${mantenimiento.trabajo || ""}
                        </td>

                        <td>
                            ${mantenimiento.estado || ""}
                        </td>

                    `;


                    tabla.appendChild(
                        fila
                    );

                }
            );

        }


        const total =
            document.getElementById(
                "totalMantenimientos"
            );


        if (total) {

            total.textContent =
                mantenimientos.length;

        }

    }
    catch (error) {

        console.error(
            "Error cargando mantenimientos:",
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
