
// ========================================
// VARIABLES
// ========================================

let proyectos = [];

let calendarioMantenimiento = null;
// ========================================
// INICIALIZAR CALENDARIO
// ========================================

function inicializarCalendarioMantenimiento() {

    const elemento =
        document.getElementById(
            "calendarioMantenimiento"
        );


    // Si no existe el calendario
    if (!elemento) {
        return;
    }


    // Si ya fue creado
    if (calendarioMantenimiento) {
        return;
    }


    // Verificar FullCalendar
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

                // Vista inicial
                initialView: "dayGridMonth",


                // Español
                locale: "es",


                // Altura
                height: "auto",


                // Botones
                headerToolbar: {

                    left:
                        "prev,next today",

                    center:
                        "title",

                    right:
                        "dayGridMonth,timeGridWeek,timeGridDay"

                },


                // Texto de botones
                buttonText: {

                    today: "Hoy",

                    month: "Mes",

                    week: "Semana",

                    day: "Día"

                },


                // Primera hora
                scrollTime:
                    "08:00:00",


                // Mostrar hora
                allDaySlot: true,


                // Cargar eventos
                events: async function (
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
                                function (mantenimiento) {

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


                        successCallback(eventos);

                    }

                    catch (error) {

                        console.error(
                            "Error cargando eventos:",
                            error
                        );

                        failureCallback(error);

                    }

                },


                // Cuando hacen clic en un mantenimiento
                eventClick: function(info) {

                    const evento =
                        info.event;


                    const datos =
                        evento.extendedProps;


                    alert(

                        "DETALLE DEL MANTENIMIENTO\n\n" +

                        "Proyecto: " +
                        (datos.proyecto || "Sin proyecto") +

                        "\n\nCuadrilla: " +
                        (datos.cuadrilla || "Sin cuadrilla") +

                        "\n\nTrabajo: " +
                        (datos.trabajo || "Sin descripción") +

                        "\n\nEstado: " +
                        (datos.estado || "Sin estado")

                    );

                }

            }
        );


    calendarioMantenimiento.render(); 

}





// ========================================
// CAMBIAR SECCIÓN
// ========================================

function mostrarSeccion(seccion, boton) {

    // Ocultar todas las secciones
    const secciones = document.querySelectorAll(".seccion");

    secciones.forEach(function (item) {
        item.classList.remove("activa");
    });


    // Mostrar sección seleccionada
    const seleccionada = document.getElementById(seccion);

    if (seleccionada) {
        seleccionada.classList.add("activa");
    }


    // Cambiar botón activo del menú
    const botones = document.querySelectorAll(".menu");

    botones.forEach(function (item) {
        item.classList.remove("active");
    });


    if (boton) {
        boton.classList.add("active");
    }


    // Títulos
    const titulos = {

        dashboard: "Dashboard",
        personal: "Personal",
        cuadrillas: "Cuadrillas",
        proyectos: "Proyectos",
        mantenimiento: "Mantenimiento",
        materiales: "Materiales"

    };


    // Cambiar título del topbar
    const titulo = document.getElementById("titulo");

    if (titulo) {
        titulo.textContent = titulos[seccion] || "Dashboard";
    }


    // ========================================
    // BOTÓN DEL TOPBAR
    // ========================================

    const botonTopbar = document.getElementById("botonTopbar");

    if (botonTopbar) {

        botonTopbar.innerHTML = "";


        // PERSONAL
        if (seccion === "personal") {

            botonTopbar.innerHTML = `
                <button
                    class="btn-primary"
                    onclick="abrirModalPersonal()"
                >
                    + Registrar personal
                </button>
            `;

        }


        // PROYECTOS
        else if (seccion === "proyectos") {

            botonTopbar.innerHTML = `
                <button
                    class="btn-primary"
                    onclick="abrirModalProyecto()"
                >
                    + Nuevo proyecto
                </button>
            `;

        }


        // MANTENIMIENTO
        else if (seccion === "mantenimiento") {

            botonTopbar.innerHTML = `
                <button
                    class="btn-primary"
                    onclick="abrirModalMantenimiento()"
                >
                    + Nuevo mantenimiento
                </button>
            `;

        }


        // MATERIALES
        else if (seccion === "materiales") {

            botonTopbar.innerHTML = `
                <button
                    class="btn-primary"
                    onclick="abrirModalMaterial()"
                >
                    + Registrar material
                </button>
            `;

        }

    }


    // ========================================
    // CARGAR DATOS SEGÚN SECCIÓN
    // ========================================

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

    // Esperar a que la sección sea visible
 setTimeout(function () {

    inicializarCalendarioMantenimiento();

    if (calendarioMantenimiento) {

        calendarioMantenimiento.updateSize();

        calendarioMantenimiento.refetchEvents();

    }

}, 150);
}


    if (seccion === "materiales") {

        cargarProyectos();
        cargarMateriales();

    }

}



// ========================================
// MODALES
// ========================================

function abrirModalPersonal() {

    const modal =
        document.getElementById("modalPersonal");

    const titulo =
        document.getElementById("tituloModalPersonal");

    const boton =
        document.getElementById("btnGuardarPersonal");

    const id =
        document.getElementById("idPersonal");

    const formulario =
        document.getElementById("formPersonal");


    // Limpiar formulario
    if (formulario) {
        formulario.reset();
    }


    // No estamos editando
    if (id) {
        id.value = "";
    }


    // Título
    if (titulo) {
        titulo.textContent = "Registrar personal";
    }


    // Botón
    if (boton) {
        boton.textContent = "Guardar personal";
    }


    // Limpiar mensajes de validación
    const errorDNI =
        document.getElementById("errorDNI");

    const errorCelular =
        document.getElementById("errorCelular");


    if (errorDNI) {
        errorDNI.textContent = "";
    }

    if (errorCelular) {
        errorCelular.textContent = "";
    }


    const documento =
        document.getElementById("documento");

    const celular =
        document.getElementById("celular");


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


    if (modal) {
        modal.classList.add("active");
    }

}


async function abrirModalProyecto() {

    const modal = document.getElementById("modalProyecto");

    if (modal) {
        modal.classList.add("active");
    }

}


async function abrirModalMantenimiento() {

    await cargarProyectos();

    const modal =
        document.getElementById("modalMantenimiento");

    if (modal) {
        modal.classList.add("active");
    }

}


async function abrirModalMaterial() {

    await cargarProyectos();

    const modal =
        document.getElementById("modalMaterial");

    if (modal) {
        modal.classList.add("active");
    }

}



function cerrarModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.remove("active");
    }

}



// ========================================
// CERRAR MODAL AL HACER CLIC AFUERA
// ========================================

document.addEventListener("click", function (event) {

    if (event.target.classList.contains("modal")) {

        event.target.classList.remove("active");

    }

});



// ========================================
// VALIDAR DNI
// ========================================

function validarDNI() {

    const input =
        document.getElementById("documento");

    const mensaje =
        document.getElementById("errorDNI");


    if (!input || !mensaje) {
        return false;
    }


    // Solo números
    input.value =
        input.value.replace(/[^0-9]/g, "");


    // Máximo 8 dígitos
    input.value =
        input.value.slice(0, 8);


    // Vacío
    if (input.value.length === 0) {

        mensaje.textContent = "";

        input.classList.remove("input-error");
        input.classList.remove("input-correcto");

        return false;

    }


    // Menos de 8
    if (input.value.length < 8) {

        mensaje.textContent =
            "El DNI debe tener 8 dígitos.";

        input.classList.add("input-error");
        input.classList.remove("input-correcto");

        return false;

    }


    // Correcto
    mensaje.textContent = "";

    input.classList.remove("input-error");
    input.classList.add("input-correcto");

    return true;

}



// ========================================
// VALIDAR CELULAR
// ========================================

function validarCelular() {

    const input =
        document.getElementById("celular");

    const mensaje =
        document.getElementById("errorCelular");


    if (!input || !mensaje) {
        return true;
    }


    // Solo números
    input.value =
        input.value.replace(/[^0-9]/g, "");


    // Máximo 9 dígitos
    input.value =
        input.value.slice(0, 9);


    // Celular opcional
    if (input.value.length === 0) {

        mensaje.textContent = "";

        input.classList.remove("input-error");
        input.classList.remove("input-correcto");

        return true;

    }


    // Menos de 9
    if (input.value.length < 9) {

        mensaje.textContent =
            "El celular debe tener 9 dígitos.";

        input.classList.add("input-error");
        input.classList.remove("input-correcto");

        return false;

    }


    // Correcto
    mensaje.textContent = "";

    input.classList.remove("input-error");
    input.classList.add("input-correcto");

    return true;

}



// ========================================
// REGISTRAR PERSONAL
// ========================================

// ========================================
// REGISTRAR / EDITAR PERSONAL
// ========================================

async function registrarPersonal(event) {

    event.preventDefault();


    // ========================================
    // VALIDACIONES
    // ========================================

    if (!validarDNI()) {

        alert("Ingrese un DNI válido.");

        return;

    }


    if (!validarCelular()) {

        alert("Ingrese un celular válido.");

        return;

    }


    // ========================================
    // OBTENER ID
    // ========================================

    const idPersonal =
        document
            .getElementById("idPersonal")
            .value
            .trim();


    // ========================================
    // DATOS
    // ========================================

    const datos = {

        nombres:
            document
                .getElementById("nombres")
                .value
                .trim(),

        apellidos:
            document
                .getElementById("apellidos")
                .value
                .trim(),

        documento:
            document
                .getElementById("documento")
                .value
                .trim(),

        celular:
            document
                .getElementById("celular")
                .value
                .trim(),

        cargo:
            document
                .getElementById("cargo")
                .value
                .trim(),

        cuadrilla:
            document
                .getElementById("cuadrilla")
                .value

    };


    // ========================================
    // DETERMINAR SI ES REGISTRO O EDICIÓN
    // ========================================

    const editando =
        idPersonal !== "";


    try {

        let respuesta;


        // ========================================
        // EDITAR
        // ========================================

        if (editando) {

            respuesta =
                await fetch(
                    `/api/personal/${idPersonal}`,
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(datos)

                    }
                );

        }


        // ========================================
        // REGISTRAR
        // ========================================

        else {

            respuesta =
                await fetch(
                    "/api/personal",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(datos)

                    }
                );

        }


        const resultado =
            await respuesta.json();


        // ========================================
        // ERROR
        // ========================================

        if (!respuesta.ok) {

            alert(
                resultado.error ||
                (
                    editando
                        ? "No se pudo actualizar el personal."
                        : "No se pudo registrar el personal."
                )
            );

            return;

        }


        // ========================================
        // MENSAJE
        // ========================================

        alert(
            editando
                ? "Personal actualizado correctamente."
                : "Personal registrado correctamente."
        );


        // ========================================
        // CERRAR MODAL
        // ========================================

        cerrarModal("modalPersonal");


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


        const boton =
            document.getElementById(
                "btnGuardarPersonal"
            );


        if (boton) {
            boton.textContent =
                "Guardar personal";
        }


        // ========================================
        // RECARGAR PERSONAL
        // ========================================

        await cargarPersonal();

    }
    catch (error) {

        console.error(
            "Error registrando/editando personal:",
            error
        );

        alert(
            "No se pudo conectar con el servidor."
        );

    }

}


    // Validar celular
    if (!validarCelular()) {

        alert("Ingrese un celular válido.");

        return;

    }


    const datos = {

        nombres:
            document
                .getElementById("nombres")
                .value
                .trim(),

        apellidos:
            document
                .getElementById("apellidos")
                .value
                .trim(),

        documento:
            document
                .getElementById("documento")
                .value
                .trim(),

        celular:
            document
                .getElementById("celular")
                .value
                .trim(),

        cargo:
            document
                .getElementById("cargo")
                .value
                .trim(),

        cuadrilla:
            document
                .getElementById("cuadrilla")
                .value

    };


    try {

        const respuesta =
            await fetch("/api/personal", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(datos)

            });


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            alert(
                resultado.error ||
                "No se pudo registrar el personal."
            );

            return;

        }


        alert(
            "Personal registrado correctamente."
        );


        cerrarModal("modalPersonal");


        const formulario =
            document.querySelector(
                "#modalPersonal form"
            );


        if (formulario) {
            formulario.reset();
        }


        cargarPersonal();

    }
    catch (error) {

        console.error(
            "Error registrando personal:",
            error
        );

        alert(
            "No se pudo conectar con el servidor."
        );

    }

}



// ========================================
// CARGAR PERSONAL
// ========================================

// ========================================
// CARGAR PERSONAL
// ========================================

async function cargarPersonal() {

    try {

        const respuesta =
            await fetch(
                "/api/personal"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo obtener el personal"
            );

        }


        const personal =
            await respuesta.json();


        const tabla =
            document.getElementById(
                "tablaPersonal"
            );


        if (tabla) {

            tabla.innerHTML = "";


            personal.forEach(
                function (persona) {

                    const fila =
                        document.createElement("tr");


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
                            ${persona.cuadrilla || persona.cuadrilla_id || ""}
                        </td>

                        <td>

                            <div class="acciones-personal">

                                <button
                                    type="button"
                                    class="btn-editar-personal"
                                    title="Editar personal"
                                    onclick="editarPersonal(${persona.id})"
                                >
                                    ✏️
                                </button>

                                <button
                                    type="button"
                                    class="btn-eliminar-personal"
                                    title="Eliminar personal"
                                    onclick="eliminarPersonal(${persona.id})"
                                >
                                    🗑️
                                </button>

                            </div>

                        </td>

                    `;


                    tabla.appendChild(fila);

                }
            );

        }

        // ========================================
// EDITAR PERSONAL
// ========================================

async function editarPersonal(id) {

    try {

        const respuesta =
            await fetch(
                "/api/personal"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo obtener el personal."
            );

        }


        const personal =
            await respuesta.json();


        const persona =
            personal.find(
                function (item) {

                    return String(item.id) ===
                        String(id);

                }
            );


        if (!persona) {

            alert(
                "No se encontró el personal seleccionado."
            );

            return;

        }


        // ========================================
        // COLOCAR DATOS EN EL FORMULARIO
        // ========================================

        document
            .getElementById("idPersonal")
            .value =
                persona.id || "";


        document
            .getElementById("nombres")
            .value =
                persona.nombres || "";


        document
            .getElementById("apellidos")
            .value =
                persona.apellidos || "";


        document
            .getElementById("documento")
            .value =
                persona.documento || "";


        document
            .getElementById("celular")
            .value =
                persona.celular || "";


        document
            .getElementById("cargo")
            .value =
                persona.cargo || "";


        document
            .getElementById("cuadrilla")
            .value =
                persona.cuadrilla_id ||
                persona.cuadrilla ||
                "1";


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
        // MOSTRAR MODAL
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

                    method: "DELETE"

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


        // Recargar tabla
        await cargarPersonal();

    }
    catch (error) {

        console.error(
            "Error eliminando personal:",
            error
        );

        alert(
            "No se pudo conectar con el servidor."
        );

    }

}


        // ========================================
        // TOTAL DE PERSONAL
        // ========================================

        const totalPersonal =
            document.getElementById(
                "totalPersonal"
            );


        if (totalPersonal) {

            totalPersonal.textContent =
                personal.length;

        }


        // ========================================
        // ACTUALIZAR CUADRILLAS
        // ========================================

        actualizarCuadrillas(
            personal
        );

    }
    catch (error) {

        console.error(
            "Error cargando personal:",
            error
        );

    }

}


        // Total de personal
        const totalPersonal =
            document.getElementById(
                "totalPersonal"
            );


        if (totalPersonal) {

            totalPersonal.textContent =
                personal.length;

        }


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
// ACTUALIZAR CUADRILLAS
// ========================================

function actualizarCuadrillas(personal) {

    const c1 =
        document.getElementById("cuadrilla1");

    const c2 =
        document.getElementById("cuadrilla2");

    const c3 =
        document.getElementById("cuadrilla3");


    if (!c1 || !c2 || !c3) {
        return;
    }


    c1.innerHTML = "";
    c2.innerHTML = "";
    c3.innerHTML = "";


    let cantidad1 = 0;
    let cantidad2 = 0;
    let cantidad3 = 0;


    personal.forEach(function (persona) {

        const div =
            document.createElement("div");


        div.className = "tecnico";


        div.innerHTML = `

            <strong>
                ${persona.nombres || ""}
                ${persona.apellidos || ""}
            </strong>

            <small>
                ${persona.cargo || "Sin cargo"}
            </small>

        `;


        if (String(persona.cuadrilla_id) === "1") {

            c1.appendChild(div);

            cantidad1++;

        }

        else if (
            String(persona.cuadrilla_id) === "2"
        ) {

            c2.appendChild(div);

            cantidad2++;

        }

        else if (
            String(persona.cuadrilla_id) === "3"
        ) {

            c3.appendChild(div);

            cantidad3++;

        }

    });


    const cantidadC1 =
        document.getElementById("cantidadC1");

    const cantidadC2 =
        document.getElementById("cantidadC2");

    const cantidadC3 =
        document.getElementById("cantidadC3");


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
// REGISTRAR PROYECTO
// ========================================

async function registrarProyecto(event) {

    event.preventDefault();


    const datos = {

        nombre:
            document
                .getElementById("nombreProyecto")
                .value
                .trim(),

        cuadrilla:
            document
                .getElementById("cuadrillaProyecto")
                .value,

        responsable:
            document
                .getElementById("responsableProyecto")
                .value
                .trim(),

        fecha:
            document
                .getElementById("fechaProyecto")
                .value,

        estado:
            document
                .getElementById("estadoProyecto")
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
            await fetch("/api/proyectos", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body:
                    JSON.stringify(datos)

            });


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


        cerrarModal("modalProyecto");


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

// ========================================
// CARGAR PROYECTOS
// ========================================

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


        const tabla =
            document.getElementById(
                "tablaProyectos"
            );


        if (tabla) {

            tabla.innerHTML = "";


            proyectos.forEach(function (proyecto) {

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


    selects.forEach(function (select) {

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


        proyectos.forEach(function (proyecto) {

            const option =
                document.createElement("option");


            option.value =
                proyecto.id;


            option.textContent =
                proyecto.nombre;


            select.appendChild(option);

        });


        if (valorActual) {

            select.value =
                valorActual;

        }

    });

}



// ========================================
// REGISTRAR MATERIAL
// ========================================

async function registrarMaterial(event) {

    event.preventDefault();


    const proyecto =
        document
            .getElementById("proyectoMaterial")
            .value;


    const material =
        document
            .getElementById("nombreMaterial")
            .value
            .trim();


    const cantidad =
        document
            .getElementById("cantidadMaterial")
            .value;


    const unidad =
        document
            .getElementById("unidadMaterial")
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
            await fetch("/api/materiales", {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(datos)

            });


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


        cerrarModal("modalMaterial");


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
            await fetch("/api/materiales");


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


        materiales.forEach(function (material) {

            const fila =
                document.createElement("tr");


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


            tabla.appendChild(fila);

        });

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

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(datos)

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


        cargarMantenimientos();

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
        }


        mantenimientos.forEach(
    function (mantenimiento) {

        if (!tabla) {
            return;
        }

        const fila =
            document.createElement("tr");


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


        tabla.appendChild(fila);

    }
);


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
// INICIO
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        // Cargar datos
        await cargarPersonal();

        await cargarProyectos();

        await cargarMantenimientos();

        if (calendarioMantenimiento) {
             calendarioMantenimiento.refetchEvents();
        }

        await cargarMateriales();


        // Dashboard inicia sin botón
        mostrarSeccion(
            "dashboard",
            document.querySelector(
                ".menu.active"
            )
        );

    }
);


// ========================================
// USUARIO ACTUAL Y PERMISOS
// ========================================

async function cargarUsuarioActual() {

    try {

        const respuesta = await fetch("/api/usuario");

        if (!respuesta.ok) {
            return;
        }

        const usuario = await respuesta.json();

        console.log("Usuario conectado:", usuario);

        // Mostrar nombre/cargo si existen estos elementos
        const nombreUsuario =
            document.getElementById("nombreUsuario");

        const cargoUsuario =
            document.getElementById("cargoUsuario");

        if (nombreUsuario) {
            nombreUsuario.textContent =
                usuario.nombre || "";
        }

        if (cargoUsuario) {
            cargoUsuario.textContent =
                usuario.cargo || "";
        }


        // ========================================
        // PERMISO PARA GESTIONAR PERSONAL
        // ========================================

        const botonPersonal =
            document.getElementById("btnRegistrarPersonal");

        if (botonPersonal) {

            if (
                usuario.cargo ===
                "Coordinador de Proyectos"
            ) {

                botonPersonal.style.display = "";

            } else {

                botonPersonal.style.display = "none";

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

        const respuesta = await fetch("/api/logout", {
            method: "POST"
        });

        if (respuesta.ok) {

            window.location.href = "/login.html";

        } else {

            alert("No se pudo cerrar la sesión.");

        }

    } catch (error) {

        console.error(error);

        alert("Error al cerrar sesión.");

    }

}
// ========================================
// ACTUALIZAR CALENDARIO AL CAMBIAR TAMAÑO
// ========================================

let resizeCalendarioPendiente = false;

window.addEventListener("resize", function () {

    if (!calendarioMantenimiento) {
        return;
    }

    if (resizeCalendarioPendiente) {
        return;
    }

    resizeCalendarioPendiente = true;

    requestAnimationFrame(function () {

        resizeCalendarioPendiente = false;

        if (calendarioMantenimiento) {
            calendarioMantenimiento.updateSize();
        }

    });

});
// ========================================
// OBSERVAR CAMBIOS DE TAMAÑO DEL CALENDARIO
// ========================================

const elementoCalendario =
    document.getElementById("calendarioMantenimiento");

if (elementoCalendario) {

    const observadorCalendario =
        new ResizeObserver(function () {

            if (calendarioMantenimiento) {
                calendarioMantenimiento.updateSize();
            }

        });

    observadorCalendario.observe(elementoCalendario);

}
