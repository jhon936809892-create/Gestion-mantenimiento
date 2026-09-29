
// ============================================================
// MÓDULO USUARIO
// usuario.js
// ============================================================


// ============================================================
// CARGAR USUARIO ACTUAL
// ============================================================

async function cargarUsuarioActual() {

    try {

        const respuesta =
            await fetch(
                "/api/usuario-actual"
            );


        if (!respuesta.ok) {

            return;

        }


        const usuario =
            await respuesta.json();


        console.log(
            "Usuario actual:",
            usuario
        );

    }
    catch (error) {

        console.error(
            "Error obteniendo usuario actual:",
            error
        );

    }

}


// ============================================================
// CERRAR SESIÓN
// ============================================================

async function cerrarSesion() {

    try {

        const respuesta =
            await fetch(
                "/api/logout",
                {
                    method: "POST"
                }
            );


        if (respuesta.ok) {

            window.location.href =
                "/";

        }
        else {

            alert(
                "No se pudo cerrar la sesión."
            );

        }

    }
    catch (error) {

        console.error(
            "Error cerrando sesión:",
            error
        );

    }

}
