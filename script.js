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

initBtn.addEventListener('click', iniciarSistema);
addPatientBtn.addEventListener('click', registrarPaciente);
finishBtn.addEventListener('click', finalizarAtencion);

function iniciarSistema() {
    const med1 = parseInt(document.getElementById('med1').value);
    const med2 = parseInt(document.getElementById('med2').value);
    
    if (isNaN(med1) || isNaN(med2) || med1 < 0 || med2 < 0) {
        alert('Por favor ingrese cantidades validas');
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
    
    document.getElementById('med1').disabled = true;
    document.getElementById('med2').disabled = true;
    initBtn.disabled = true;
}

function actualizarStock() {
    document.getElementById('stock1').textContent = stockMed1;
    document.getElementById('stock2').textContent = stockMed2;
}

function clasificarPaciente(sistolica, diastolica) {
    // Hipotension
    if (sistolica < 69 && diastolica < 48) {
        return {categoria: 'hipotension', medicamento: 2, dosis: 6};
    }
    
    // Optima
    if (sistolica >= 69 && sistolica < 98 && diastolica >= 48 && diastolica < 66) {
        return {categoria: 'Optima', medicamento: 0, dosis: 0};
    }
    
    // Comun
    if (sistolica >= 98 && sistolica < 143 && diastolica >= 66 && diastolica < 92) {
        return {categoria: 'Comun', medicamento: 0, dosis: 0};
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
    
    // No se encuentra categoria
    return {categoria: 'No clasificado', medicamento: 0, dosis: 0};
}

function registrarPaciente() {
    const sistolica = parseFloat(document.getElementById('sistolica').value);
    const diastolica = parseFloat(document.getElementById('diastolica').value);
    
    if (isNaN(sistolica) || isNaN(diastolica)) {
        alert('Por favor ingrese valores validos de presion');
        return;
    }
    
    totalPacientes++;
    const clasificacion = clasificarPaciente(sistolica, diastolica);
    
    let mensajeDiagnostico = `Paciente ${totalPacientes}: `;
    mensajeDiagnostico += `Sistolica: ${sistolica}, Diastolica: ${diastolica}<br>`;
    mensajeDiagnostico += `Categoria: ${clasificacion.categoria}<br>`;
    
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
        mensajeDiagnostico += `Stock insuficiente - Finalizando atencion`;
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
    
    // Verificar si se debe finalizar automaticamente
    if ((clasificacion.medicamento === 1 && stockMed1 < clasificacion.dosis) ||
        (clasificacion.medicamento === 2 && stockMed2 < clasificacion.dosis)) {
        setTimeout(() => {
            finalizarAtencion();
        }, 2000);
    }
    
    // Limpiar inputs
    document.getElementById('sistolica').value = '';
    document.getElementById('diastolica').value = '';
    document.getElementById('sistolica').focus();
}

function finalizarAtencion() {
    if (totalPacientes === 0) {
        alert('No hay pacientes registrados');
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
    
    // Mostrar log de pacientes
    let logHTML = '';
    pacientesLog.forEach(p => {
        const clase = p.medicamento === 0 ? 'no-med' : '';
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
    patientsLog.classList.remove('hidden');
    
    patientSection.classList.add('hidden');
    
    // Rehabilitar inicio
    document.getElementById('med1').disabled = false;
    document.getElementById('med2').disabled = false;
    initBtn.disabled = false;
}