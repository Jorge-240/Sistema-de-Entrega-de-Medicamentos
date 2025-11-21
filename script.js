let stockMed1 = 0;
let stockMed2 = 0;
let totalPacientes = 0;
let pacientesMed1 = 0;
let pacientesMed2 = 0;
let pacientesLog = [];

const initBtn = document.getElementById('initBtn');
const addPatientBtn = document.getElementById('addPatientBtn');
const finishBtn = document.getElementById('finishBtn');
const patientSection = document.getElementById('patientSection');
const resultsSection = document.getElementById('resultsSection');
const patientsLog = document.getElementById('patientsLog');
const diagnosis = document.getElementById('diagnosis');

// Rangos válidos según la tabla
const RANGO_SISTOLICA_MIN = 69;
const RANGO_SISTOLICA_MAX = 246;
const RANGO_DIASTOLICA_MIN = 48;
const RANGO_DIASTOLICA_MAX = 169;

initBtn.addEventListener('click', iniciarSistema);
addPatientBtn.addEventListener('click', registrarPaciente);
finishBtn.addEventListener('click', finalizarAtencion);

function iniciarSistema() {
    const med1 = parseInt(document.getElementById('med1').value);
    const med2 = parseInt(document.getElementById('med2').value);
    
    if (isNaN(med1) || isNaN(med2) || med1 < 0 || med2 < 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingrese cantidades válidas',
            confirmButtonColor: '#667eea'
        });
        return;
    }
    
    stockMed1 = med1;
    stockMed2 = med2;
    totalPacientes = 0;
    pacientesMed1 = 0;
    pacientesMed2 = 0;
    pacientesLog = [];
    
    actualizarStock();
    patientSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    patientsLog.classList.add('hidden');
    diagnosis.classList.add('hidden');
    document.getElementById('logContent').innerHTML = '';
    
    document.getElementById('med1').disabled = true;
    document.getElementById('med2').disabled = true;
    initBtn.disabled = true;
    
    Swal.fire({
        icon: 'success',
        title: 'Sistema Iniciado',
        text: 'Puede comenzar a registrar pacientes',
        timer: 2000,
        showConfirmButton: false
    });
}

function actualizarStock() {
    document.getElementById('stock1').textContent = stockMed1;
    document.getElementById('stock2').textContent = stockMed2;
}

function validarRangos(sistolica, diastolica) {
    let alertas = [];
    let fueraDeRango = false;
    
    // Verificar si la combinación está dentro de alguna categoría válida
    
    // Hipotensión: S < 69 AND D < 48
    if (sistolica < 69 || diastolica < 48) {
        if (!(sistolica < 69 && diastolica < 48)) {
            fueraDeRango = true;
        }
    }
    
    // Óptima: [69-98) AND [48-66)
    else if ((sistolica >= 69 && sistolica < 98) || (diastolica >= 48 && diastolica < 66)) {
        if (!(sistolica >= 69 && sistolica < 98 && diastolica >= 48 && diastolica < 66)) {
            fueraDeRango = true;
        }
    }
    
    // Común: [98-143) AND [66-92)
    else if ((sistolica >= 98 && sistolica < 143) || (diastolica >= 66 && diastolica < 92)) {
        if (!(sistolica >= 98 && sistolica < 143 && diastolica >= 66 && diastolica < 92)) {
            fueraDeRango = true;
        }
    }
    
    // Pre HTA: [143-177) AND [92-124)
    else if ((sistolica >= 143 && sistolica < 177) || (diastolica >= 92 && diastolica < 124)) {
        if (!(sistolica >= 143 && sistolica < 177 && diastolica >= 92 && diastolica < 124)) {
            fueraDeRango = true;
        }
    }
    
    // HTAG1: [177-198) AND [124-142)
    else if ((sistolica >= 177 && sistolica < 198) || (diastolica >= 124 && diastolica < 142)) {
        if (!(sistolica >= 177 && sistolica < 198 && diastolica >= 124 && diastolica < 142)) {
            fueraDeRango = true;
        }
    }
    
    // HTAG2: [198-246) AND [142-169)
    else if ((sistolica >= 198 && sistolica < 246) || (diastolica >= 142 && diastolica < 169)) {
        if (!(sistolica >= 198 && sistolica < 246 && diastolica >= 142 && diastolica < 169)) {
            fueraDeRango = true;
        }
    }
    
    // HTAG3: S ≥ 246 AND D ≥ 169
    else if (sistolica >= 246 || diastolica >= 169) {
        if (!(sistolica >= 246 && diastolica >= 169)) {
            fueraDeRango = true;
        }
    }
    
    // HTASS: S ≥ 162 AND D < 86
    else if (sistolica >= 162 && diastolica < 86) {
        // Esta es válida
        fueraDeRango = false;
    }
    
    else {
        fueraDeRango = true;
    }
    
    if (fueraDeRango) {
        alertas.push(`⚠️ La combinación de presiones está FUERA DE RANGO según la tabla de categorías.<br><br>
                     <strong>Sistólica:</strong> ${sistolica} mmHg<br>
                     <strong>Diastólica:</strong> ${diastolica} mmHg<br><br>
                     Esta combinación no corresponde a ninguna categoría válida en la tabla.`);
    }
    
    return alertas;
}

function clasificarPaciente(sistolica, diastolica) {
    // Hipotensión
    if (sistolica < 69 && diastolica < 48) {
        return {categoria: 'Hipotensión', medicamento: 2, dosis: 6};
    }
    
    // Óptima
    if (sistolica >= 69 && sistolica < 98 && diastolica >= 48 && diastolica < 66) {
        return {categoria: 'Óptima', medicamento: 0, dosis: 0};
    }
    
    // Común
    if (sistolica >= 98 && sistolica < 143 && diastolica >= 66 && diastolica < 92) {
        return {categoria: 'Común', medicamento: 0, dosis: 0};
    }
    
    // Pre HTA
    if (sistolica >= 143 && sistolica < 177 && diastolica >= 92 && diastolica < 124) {
        return {categoria: 'Pre HTA', medicamento: 1, dosis: 6};
    }
    
    // HTAG1
    if (sistolica >= 177 && sistolica < 198 && diastolica >= 124 && diastolica < 142) {
        return {categoria: 'HTAG1', medicamento: 1, dosis: 10};
    }
    
    // HTAG2
    if (sistolica >= 198 && sistolica < 246 && diastolica >= 142 && diastolica < 169) {
        return {categoria: 'HTAG2', medicamento: 1, dosis: 18};
    }
    
    // HTAG3
    if (sistolica >= 246 && diastolica >= 169) {
        return {categoria: 'HTAG3', medicamento: 1, dosis: 35};
    }
    
    // HTASS
    if (sistolica >= 162 && diastolica < 86) {
        return {categoria: 'HTASS', medicamento: 1, dosis: 17};
    }
    
    // No se encuentra categoría
    return {categoria: 'No clasificado', medicamento: 0, dosis: 0};
}

function actualizarHistorial() {
    let logHTML = '';
    pacientesLog.forEach(p => {
        let clase = 'no-med';
        if (p.medicamento === 1) {
            clase = 'hipertension';
        } else if (p.medicamento === 2) {
            clase = 'hipotension';
        }
        
        logHTML += `
            <div class="log-entry ${clase}">
                <strong>Paciente ${p.numero}:</strong> 
                S: ${p.sistolica}, D: ${p.diastolica} - 
                ${p.categoria} - 
                ${p.medicamento === 0 ? 'Sin medicamento' : `Med ${p.medicamento}: ${p.dosis} dosis`}
            </div>
        `;
    });
    document.getElementById('logContent').innerHTML = logHTML;
    
    if (pacientesLog.length > 0) {
        patientsLog.classList.remove('hidden');
    }
}

async function registrarPaciente() {
    const sistolica = parseFloat(document.getElementById('sistolica').value);
    const diastolica = parseFloat(document.getElementById('diastolica').value);
    
    if (isNaN(sistolica) || isNaN(diastolica)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingrese valores válidos de presión',
            confirmButtonColor: '#667eea'
        });
        return;
    }
    
    // Validar rangos
    const alertas = validarRangos(sistolica, diastolica);
    if (alertas.length > 0) {
        const result = await Swal.fire({
            icon: 'warning',
            title: '⚠️ Valores Fuera de Rango',
            html: alertas.join('<br><br>'),
            showCancelButton: true,
            confirmButtonText: 'Continuar de todas formas',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d'
        });
        
        if (!result.isConfirmed) {
            return;
        }
    }
    
    totalPacientes++;
    const clasificacion = clasificarPaciente(sistolica, diastolica);
    
    let mensajeDiagnostico = `Paciente ${totalPacientes}: `;
    mensajeDiagnostico += `Sistólica: ${sistolica}, Diastólica: ${diastolica}<br>`;
    mensajeDiagnostico += `Categoría: ${clasificacion.categoria}<br>`;
    
    let medicamentoEntregado = false;
    let tipoClase = 'normal';
    
    if (clasificacion.medicamento === 1 && stockMed1 >= clasificacion.dosis) {
        stockMed1 -= clasificacion.dosis;
        pacientesMed1++;
        mensajeDiagnostico += `Medicamento 1 entregado: ${clasificacion.dosis} dosis`;
        medicamentoEntregado = true;
        tipoClase = 'hipertension';
    } else if (clasificacion.medicamento === 2 && stockMed2 >= clasificacion.dosis) {
        stockMed2 -= clasificacion.dosis;
        pacientesMed2++;
        mensajeDiagnostico += `Medicamento 2 entregado: ${clasificacion.dosis} dosis`;
        medicamentoEntregado = true;
        tipoClase = 'hipotension';
    } else if (clasificacion.medicamento === 0) {
        mensajeDiagnostico += `No requiere medicamento`;
        tipoClase = 'normal';
    } else {
        mensajeDiagnostico += `Stock insuficiente - Finalizando atención`;
        tipoClase = 'warning';
    }
    
    pacientesLog.push({
        numero: totalPacientes,
        sistolica: sistolica,
        diastolica: diastolica,
        categoria: clasificacion.categoria,
        medicamento: clasificacion.medicamento,
        dosis: medicamentoEntregado ? clasificacion.dosis : 0
    });
    
    diagnosis.innerHTML = mensajeDiagnostico;
    diagnosis.className = `diagnosis ${tipoClase}`;
    diagnosis.classList.remove('hidden');
    
    actualizarStock();
    actualizarHistorial();
    
    // Verificar si se debe finalizar automáticamente
    if ((clasificacion.medicamento === 1 && stockMed1 < clasificacion.dosis) ||
        (clasificacion.medicamento === 2 && stockMed2 < clasificacion.dosis)) {
        
        await Swal.fire({
            icon: 'warning',
            title: 'Stock Insuficiente',
            text: 'No hay suficiente medicamento para el siguiente paciente. Finalizando atención.',
            timer: 3000,
            showConfirmButton: false
        });
        
        finalizarAtencion();
        return;
    }
    
    // Limpiar inputs
    document.getElementById('sistolica').value = '';
    document.getElementById('diastolica').value = '';
    document.getElementById('sistolica').focus();
}

function finalizarAtencion() {
    if (totalPacientes === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Sin pacientes',
            text: 'No hay pacientes registrados',
            confirmButtonColor: '#667eea'
        });
        return;
    }
    
    const porcentajeMed1 = totalPacientes > 0 ? ((pacientesMed1 / totalPacientes) * 100).toFixed(2) : '0.00';
    const porcentajeMed2 = totalPacientes > 0 ? ((pacientesMed2 / totalPacientes) * 100).toFixed(2) : '0.00';
    
    let resultadosHTML = `
        <p><strong>Total de pacientes atendidos:</strong> ${totalPacientes}</p>
        <p><strong>Pacientes con Medicamento 1:</strong> ${pacientesMed1} (${porcentajeMed1}%)</p>
        <p><strong>Pacientes con Medicamento 2:</strong> ${pacientesMed2} (${porcentajeMed2}%)</p>
        <p><strong>Stock restante Medicamento 1:</strong> ${stockMed1} dosis</p>
        <p><strong>Stock restante Medicamento 2:</strong> ${stockMed2} dosis</p>
    `;
    
    document.getElementById('results').innerHTML = resultadosHTML;
    resultsSection.classList.remove('hidden');
    
    patientSection.classList.add('hidden');
    
    // Rehabilitar inicio
    document.getElementById('med1').disabled = false;
    document.getElementById('med2').disabled = false;
    initBtn.disabled = false;
    
    Swal.fire({
        icon: 'success',
        title: 'Atención Finalizada',
        text: `Se atendieron ${totalPacientes} pacientes`,
        confirmButtonColor: '#667eea'
    });
}