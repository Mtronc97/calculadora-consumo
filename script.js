// 1. Seleccionamos los elementos del DOM y los guardamos en constantes
const formulario = document.getElementById('calc-form');
const inputKmInicio = document.getElementById('km-inicio');
const inputKmFin = document.getElementById('km-fin');
const inputLitros = document.getElementById('litros');
const divResultado = document.getElementById('resultado');
const btnAgregarCarga = document.getElementById('agregar-carga');
const btnFinalizarViaje = document.getElementById('finalizar-viaje');
const tablaContainer = document.getElementById('tabla-container');
const tablaRegistros = document.getElementById('tabla-registros');
const divTotalConsumo = document.getElementById('total-consumo');

// 2. Variable para almacenar los registros (array)
let registros = [];

// 3. Cargar registros desde localStorage al iniciar la página
function cargarRegistrosLocal() {
    const registrosGuardados = localStorage.getItem('registrosConsumo');
    if (registrosGuardados) {
        registros = JSON.parse(registrosGuardados);
        mostrarTabla();
    }
}

// 4. Guardar registros en localStorage
function guardarRegistrosLocal() {
    localStorage.setItem('registrosConsumo', JSON.stringify(registros));
}

// 5. Función para calcular el consumo
function calcularConsumo() {
    const kmInicio = parseFloat(inputKmInicio.value);
    const kmFin = parseFloat(inputKmFin.value);
    const litros = parseFloat(inputLitros.value);

    const distancia = kmFin - kmInicio;

    if (distancia <= 0) {
        divResultado.innerHTML = '<p style="color: #ff4444;">Error: Los Km finales deben ser mayores a los iniciales.</p>';
        return null;
    }

    const consumo = (litros / distancia) * 100;
    const resultadoFormateado = consumo.toFixed(2);

    divResultado.innerHTML = `
        <div class="success-message">
            <p>Distancia recorrida: <strong>${distancia} km</strong></p>
            <p>Consumo promedio: <strong>${resultadoFormateado} L/100km</strong></p>
        </div>
    `;

    return {
        kmInicio,
        kmFin,
        litros,
        distancia,
        consumo: parseFloat(resultadoFormateado)
    };
}

// 6. Función para mostrar la tabla de registros
function mostrarTabla() {
    if (registros.length === 0) {
        tablaContainer.classList.add('hidden');
        return;
    }

    tablaContainer.classList.remove('hidden');
    tablaRegistros.innerHTML = '';

    registros.forEach((registro) => {
        const fila = document.createElement('tr');
        fila.className = 'border-b border-gray-700 hover:bg-white/5 transition';
        fila.innerHTML = `
            <td class="py-2 px-2 text-gray-300">${registro.kmInicio}</td>
            <td class="py-2 px-2 text-gray-300">${registro.kmFin}</td>
            <td class="py-2 px-2 text-gray-300">${registro.litros}</td>
            <td class="py-2 px-2 text-gray-300">${registro.distancia}</td>
            <td class="py-2 px-2 text-electricBlue font-semibold">${registro.consumo}</td>
        `;
        tablaRegistros.appendChild(fila);
    });
}

// 7. Calcular consumo total del viaje completo
function calcularConsumoTotal() {
    if (registros.length === 0) {
        divTotalConsumo.innerHTML = '<p style="color: #ff4444;">No hay registros para calcular.</p>';
        return;
    }

    const totalLitros = registros.reduce((sum, r) => sum + r.litros, 0);
    const totalDistancia = registros.reduce((sum, r) => sum + r.distancia, 0);

    if (totalDistancia <= 0) {
        divTotalConsumo.innerHTML = '<p style="color: #ff4444;">Error en los datos: distancia total debe ser mayor a 0.</p>';
        return;
    }

    const consumoTotal = (totalLitros / totalDistancia) * 100;
    const consumoTotalFormateado = consumoTotal.toFixed(2);

    divTotalConsumo.innerHTML = `Consumo total del viaje: <strong>${consumoTotalFormateado} L/100km</strong> (Litros: ${totalLitros.toFixed(2)} | Distancia: ${totalDistancia.toFixed(2)} km)`;
}

// 8. Evento para el submit del formulario (botón "Analizar Consumo")
formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    calcularConsumo();
});

// 9. Evento para el botón "Agregar Carga"
btnAgregarCarga.addEventListener('click', function() {
    const datosConsumO = calcularConsumo();
    
    if (datosConsumO) {
        registros.push(datosConsumO);
        guardarRegistrosLocal();
        mostrarTabla();
        
        // Limpiar el formulario después de agregar
        formulario.reset();
        divResultado.innerHTML = '<p style="color: #4ade80;">✓ Carga agregada exitosamente</p>';
        
        // Limpiar mensaje después de 2 segundos
        setTimeout(() => {
            divResultado.innerHTML = '';
        }, 2000);
    }
});

// 9. Evento para botón "Finalizar Viaje y Calcular"
btnFinalizarViaje.addEventListener('click', function() {
    calcularConsumoTotal();
});

// 10. Cargar registros al iniciar la página
cargarRegistrosLocal();