
// ============================================================
// MÓDULO MATERIALES
// ============================================================


// ============================================================
// CARGAR MATERIALES
// ============================================================

async function cargarMateriales() {

    try {

        const respuesta =
            await fetch(
                "/api/materiales"
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error al cargar materiales"
            );

        }


        const materiales =
            await respuesta.json();


        // Guardamos para Dashboard

        datosMaterialesDashboard =
            materiales;


        const tabla =
            document.getElementById(
                "tablaMateriales"
            );


        if (!tabla) {

            actualizarDashboard();

            return;

        }


        tabla.innerHTML = "";


        materiales.forEach(function(material) {

            const fila =
                document.createElement("tr");


            fila.innerHTML = `

                <td>
                    ${
                        material.material ||
                        material.nombre ||
                        ""
                    }
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


        actualizarDashboard();

    }
    catch (error) {

        console.error(
            "Error cargando materiales:",
            error
        );

    }

}


// ============================================================
// REGISTRAR MATERIAL
// ============================================================

async function registrarMaterial(event) {

    event.preventDefault();


    const datos = {

        proyecto_id:
            document.getElementById(
                "proyectoMaterial"
            ).value,

        material:
            document.getElementById(
                "nombreMaterial"
            ).value.trim(),

        cantidad:
            Number(
                document.getElementById(
                    "cantidadMaterial"
                ).value
            ),

        unidad:
            document.getElementById(
                "unidadMaterial"
            ).value

    };


    try {

        const respuesta =
            await fetch(
                "/api/materiales",
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


        await cargarMateriales();

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

