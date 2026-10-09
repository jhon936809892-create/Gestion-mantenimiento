

// ============================================================
// MÓDULO PERSONAL
// ============================================================


/* ============================================================
   MODO DE EDICIÓN DEL MÓDULO PERSONAL
   ============================================================ */

let modoEdicionPersonal = false;
let personalActual = [];

// Activar o desactivar el modo de edición
function alternarModoEdicionPersonal() {

    modoEdicionPersonal = !modoEdicionPersonal;

    const boton = document.getElementById(
        "btnModoEdicionPersonal"
    );

    if (boton) {
        boton.textContent = modoEdicionPersonal
            ? "✖ Cancelar edición"
            : "✏️ Editar";

        boton.classList.toggle(
            "modo-activo",
            modoEdicionPersonal
        );
    }

    // Volver a dibujar la tabla
    cargarPersonal();
}

// Abrir el formulario con los datos del trabajador
function editarPersonal(id) {

    const persona = personalActual.find(
        p => String(p.id) === String(id)
    );

    if (!persona) {
        alert("No se encontró el trabajador seleccionado.");
        return;
    }

    const formulario = document.getElementById(
        "formPersonal"
    );

    if (formulario) {
        formulario.reset();
    }

    // Cargar los datos en el formulario existente
    document.getElementById("idPersonal").value =
        persona.id ?? "";

    document.getElementById("nombresPersonal").value =
        persona.nombres ?? "";

    document.getElementById("apellidosPersonal").value =
        persona.apellidos ?? "";

    document.getElementById("tipoDocumentoPersonal").value =
        persona.tipo_documento ?? "";

    document.getElementById("documentoPersonal").value =
        persona.documento ?? persona.dni ?? "";

    document.getElementById("celularPersonal").value =
        persona.celular ?? "";

    document.getElementById("cargoPersonal").value =
        persona.cargo ?? "";

    document.getElementById("cuadrillaPersonal").value =
        persona.cuadrilla ?? "";

    const titulo = document.getElementById(
        "tituloModalPersonal"
    );

    if (titulo) {
        titulo.textContent = "Editar personal";
    }

    document.getElementById("modalPersonal")
        .classList.add("active");
}


// ============================================================
// CARGAR PERSONAL
// ============================================================


async function cargarPersonal() {
    try {
        const respuesta = await fetch("/api/personal");

        if (!respuesta.ok) {
            throw new Error("Error al cargar personal");
        }

        const personal = await respuesta.json();

        personalActual = personal;
        datosPersonalDashboard = personal;

        const tabla = document.getElementById("tablaPersonal");

        if (!tabla) {
            actualizarDashboard();
            return;
        }

        // Activar la clase sin modificar la estructura de la tabla.
        tabla.classList.toggle(
            "modo-edicion-personal",
            modoEdicionPersonal
        );

        tabla.innerHTML = "";

        personal.forEach(function(persona) {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${persona.nombres || ""}</td>
                <td>${persona.apellidos || ""}</td>
                <td>${persona.documento || persona.dni || ""}</td>
                <td>${persona.celular || ""}</td>
                <td>${persona.cargo || ""}</td>

                <td class="celda-acciones-personal">
                    <span class="texto-cuadrilla-personal">
                        ${persona.cuadrilla || ""}
                    </span>

                    ${
                        modoEdicionPersonal
                        ? `
                            <span class="acciones-personal">
                                <button
                                    type="button"
                                    class="btn-editar-personal"
                                    onclick="editarPersonal(${Number(persona.id)})"
                                    title="Editar personal"
                                    aria-label="Editar personal">
                                    ✏️
                                </button>

                                <button
                                    type="button"
                                    class="btn-eliminar-personal"
                                    onclick="eliminarPersonal(${Number(persona.id)})"
                                    title="Eliminar personal"
                                    aria-label="Eliminar personal">
                                    🗑️
                                </button>
                            </span>
                        `
                        : ""
                    }
                </td>
            `;

            tabla.appendChild(fila);
        });

        const total = document.getElementById("totalPersonal");

        if (total) {
            total.textContent = personal.length;
        }

        actualizarDashboard();

    } catch (error) {
        console.error("Error cargando personal:", error);
    }
}

// ============================================================
// ABRIR MODAL PERSONAL
// ============================================================

function abrirModalPersonal() {

    const modal =
        document.getElementById(
            "modalPersonal"
        );


    if (!modal) {

        return;

    }


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


    const titulo =
        document.getElementById(
            "tituloModalPersonal"
        );


    if (titulo) {

        titulo.textContent =
            "Registrar personal";

    }


    modal.classList.add("active");

}


// ============================================================
// CANCELAR EDICIÓN PERSONAL
// ============================================================

function cancelarEdicionPersonal() {

    const modalConfirmacion =
        document.getElementById(
            "modalConfirmarCancelarPersonal"
        );


    if (modalConfirmacion) {

        modalConfirmacion.classList.add(
            "active"
        );

        return;

    }


    const modal =
        document.getElementById(
            "modalPersonal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


// ============================================================
// CERRAR CONFIRMACIÓN PERSONAL
// ============================================================

function cerrarConfirmacionCancelarPersonal() {

    const modal =
        document.getElementById(
            "modalConfirmarCancelarPersonal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


// ============================================================
// CONFIRMAR CANCELACIÓN PERSONAL
// ============================================================

function confirmarCancelarPersonal() {

    const formulario =
        document.getElementById(
            "formPersonal"
        );


    if (formulario) {

        formulario.reset();

    }


    const modalPersonal =
        document.getElementById(
            "modalPersonal"
        );


    const modalConfirmacion =
        document.getElementById(
            "modalConfirmarCancelarPersonal"
        );


    if (modalPersonal) {

        modalPersonal.classList.remove(
            "active"
        );

    }


    if (modalConfirmacion) {

        modalConfirmacion.classList.remove(
            "active"
        );

    }

}


// ============================================================
// REGISTRAR PERSONAL
// ============================================================

async function registrarPersonal(event) {

    event.preventDefault();


    const datos = {

        nombres:
            document.getElementById(
                "nombresPersonal"
            ).value.trim(),

        apellidos:
            document.getElementById(
                "apellidosPersonal"
            ).value.trim(),

        tipo_documento:
            document.getElementById(
                "tipoDocumentoPersonal"
            ).value,

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


    try {

        const respuesta =
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


        const modal =
            document.getElementById(
                "modalPersonal"
            );


        if (modal) {

            modal.classList.remove(
                "active"
            );

        }


        await cargarPersonal();

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
