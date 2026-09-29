

// ============================================================
// MÓDULO PERSONAL
// ============================================================


// ============================================================
// CARGAR PERSONAL
// ============================================================

async function cargarPersonal() {

    try {

        const respuesta =
            await fetch("/api/personal");


        if (!respuesta.ok) {

            throw new Error(
                "Error al cargar personal"
            );

        }


        const personal =
            await respuesta.json();


        // Guardamos para Dashboard

        datosPersonalDashboard =
            personal;


        const tabla =
            document.getElementById(
                "tablaPersonal"
            );


        if (!tabla) {

            actualizarDashboard();

            return;

        }


        tabla.innerHTML = "";


        personal.forEach(function(persona) {

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
                    ${
                        persona.documento ||
                        persona.dni ||
                        ""
                    }
                </td>

                <td>
                    ${persona.celular || ""}
                </td>

                <td>
                    ${persona.cargo || ""}
                </td>

                <td>
                    ${
                        persona.cuadrilla ||
                        ""
                    }
                </td>

            `;


            tabla.appendChild(fila);

        });


        const total =
            document.getElementById(
                "totalPersonal"
            );


        if (total) {

            total.textContent =
                personal.length;

        }


        actualizarDashboard();

    }
    catch (error) {

        console.error(
            "Error cargando personal:",
            error
        );

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
