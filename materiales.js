
"use strict";

// ============================================================
// MÓDULO MATERIALES
// ============================================================

// Datos temporales. Después los conectaremos con PostgreSQL.
let materiales = [];
let movimientosMateriales = [];
let graficoMovimientosMateriales = null;
let graficoGruposMateriales = null;


// ============================================================
// CAMBIAR ENTRE LAS VISTAS DEL MÓDULO
// ============================================================

function mostrarVistaMateriales(vista, boton) {
    const seccion = document.getElementById("materiales");

    if (!seccion) {
        console.error("No se encontró la sección Materiales.");
        return;
    }

    // Ocultar todas las vistas.
    seccion.querySelectorAll(".mat-vista").forEach(elemento => {
        elemento.style.display = "none";
    });

    // Mostrar la vista seleccionada.
    const vistaSeleccionada = document.getElementById(
        "mat-vista-" + vista
    );

    if (!vistaSeleccionada) {
        console.error("No se encontró la vista:", vista);
        return;
    }

    vistaSeleccionada.style.display = "block";

    // Actualizar el botón seleccionado.
    seccion.querySelectorAll(".mat-menu-btn").forEach(elemento => {
        elemento.classList.remove("activo");
    });

    if (boton) {
        boton.classList.add("activo");
    }
}


// ============================================================
// INICIALIZAR EL MÓDULO
// ============================================================

function iniciarModuloMateriales() {
    const seccion = document.getElementById("materiales");

    if (!seccion) return;

    const botonDashboard = seccion.querySelector(".mat-menu-btn");

    mostrarVistaMateriales("dashboard", botonDashboard);

    actualizarDashboardMateriales();
    actualizarTablaInventarioMateriales();
}


// ============================================================
// ACTUALIZAR TARJETAS DEL DASHBOARD
// ============================================================

function actualizarDashboardMateriales() {
    establecerTexto("matTotalMateriales", materiales.length);

    establecerTexto(
        "matTotalEntradas",
        movimientosMateriales.filter(m => m.tipo === "Entrada").length
    );

    establecerTexto(
        "matTotalEntregas",
        movimientosMateriales.filter(m => m.tipo === "Entrega").length
    );

    const stockBajo = materiales.filter(material =>
        Number(material.stock) <= Number(material.stockMinimo)
    ).length;

    establecerTexto("matTotalStockBajo", stockBajo);
}


// ============================================================
// ACTUALIZAR TABLA DE INVENTARIO
// ============================================================

function actualizarTablaInventarioMateriales() {
    const tabla = document.getElementById("matTablaInventario");

    if (!tabla) return;

    tabla.innerHTML = "";

    if (materiales.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="6" class="mat-sin-datos">
                    Todavía no hay materiales registrados.
                </td>
            </tr>
        `;
        return;
    }

    materiales.forEach(material => {
        const stock = Number(material.stock) || 0;
        const minimo = Number(material.stockMinimo) || 0;

        let estado = "Disponible";
        let claseEstado = "mat-estado-disponible";

        if (stock <= 0) {
            estado = "Agotado";
            claseEstado = "mat-estado-agotado";
        } else if (stock <= minimo) {
            estado = "Stock bajo";
            claseEstado = "mat-estado-bajo";
        }

        const fila = document.createElement("tr");

        [
            material.codigo,
            material.nombre,
            material.unidad,
            stock,
            minimo
        ].forEach(valor => {
            const celda = document.createElement("td");
            celda.textContent = valor ?? "";
            fila.appendChild(celda);
        });

        const celdaEstado = document.createElement("td");
        const etiqueta = document.createElement("span");

        etiqueta.className = claseEstado;
        etiqueta.textContent = estado;

        celdaEstado.appendChild(etiqueta);
        fila.appendChild(celdaEstado);

        tabla.appendChild(fila);
    });
}


// ============================================================
// BUSCAR MATERIALES
// ============================================================

function buscarMateriales() {
    const buscador = document.getElementById("matBuscarInventario");

    if (!buscador) return;

    const texto = buscador.value.trim().toLowerCase();
    const tabla = document.getElementById("matTablaInventario");

    if (!tabla) return;

    const filas = tabla.querySelectorAll("tr");

    filas.forEach(fila => {
        const contenido = fila.textContent.toLowerCase();
        fila.style.display = contenido.includes(texto) ? "" : "none";
    });
}


// ============================================================
// FILTRAR MOVIMIENTOS
// ============================================================

function actualizarTablaMovimientosMateriales() {
    const tabla = document.getElementById(
        "matTablaMovimientosRecientes"
    );

    if (!tabla) return;

    tabla.innerHTML = "";

    if (movimientosMateriales.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="5" class="mat-sin-datos">
                    No hay movimientos registrados.
                </td>
            </tr>
        `;
        return;
    }

    movimientosMateriales.slice(-10).reverse().forEach(movimiento => {
        const fila = document.createElement("tr");

        [
            movimiento.fecha,
            movimiento.tipo,
            movimiento.material,
            movimiento.cantidad,
            movimiento.responsable || "-"
        ].forEach(valor => {
            const celda = document.createElement("td");
            celda.textContent = valor ?? "";
            fila.appendChild(celda);
        });

        tabla.appendChild(fila);
    });
}


// ============================================================
// FUNCIONES PROVISIONALES PARA LOS BOTONES
// ============================================================

// Aún no guardan información. Las implementaremos junto con
// los formularios y la conexión a la base de datos.

function abrirFormularioMaterial() {
    alert("El formulario para registrar materiales se implementará en el siguiente paso.");
}

function abrirFormularioEntrada() {
    alert("El formulario de entradas se implementará en el siguiente paso.");
}

function abrirFormularioEntrega() {
    alert("El formulario de entregas se implementará en el siguiente paso.");
}

function abrirFormularioDevolucion() {
    alert("El formulario de devoluciones se implementará en el siguiente paso.");
}

function generarReporteMateriales() {
    alert("Los reportes se implementarán después de conectar los movimientos.");
}


// ============================================================
// UTILIDAD
// ============================================================

function establecerTexto(id, valor) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}


// ============================================================
// INICIO
// ============================================================

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarModuloMateriales
    );
} else {
    iniciarModuloMateriales();
}
