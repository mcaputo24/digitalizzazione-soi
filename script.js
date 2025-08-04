// script.js

/**
 * Inizializza Cytoscape sulla mappa, se presente.
 */
function initMap() {
  const cyContainer = document.getElementById('cy');
  if (!cyContainer) return;

  // Svuota eventuali istanze precedenti
  cyContainer.innerHTML = '';

  window.cy = cytoscape({
    container: cyContainer,
    elements: [], // parti vuoto, studente aggiunge nodi con i controlli
    style: [
      {
        selector: 'node',
        style: {
          'background-color': '#0074D9',
          'label': 'data(label)'
        }
      },
      {
        selector: 'edge',
        style: {
          'line-color': '#aaa',
          'target-arrow-shape': 'triangle'
        }
      }
    ],
    layout: { name: 'grid', rows: 1 }
  });

  // TODO: aggiungi qui i controlli per inserire i nodi/aggettivi
}

/**
 * Calcola e aggiorna i punteggi di Scheda 3.
 */
function updateScores() {
  ['gente', 'dati', 'idee', 'cose'].forEach(cat => {
    const count = document.querySelectorAll(
      `input[type=checkbox][data-category="${cat}"]:checked`
    ).length;
    const span = document.getElementById(`punteggio-${cat}`);
    if (span) span.textContent = count;
  });
}

/**
 * Collega gli event listener sui checkbox di Scheda 3.
 */
function bindScoreCalculation() {
  document.querySelectorAll(
    'input[type=checkbox][data-category]'
  ).forEach(cb => {
    cb.removeEventListener('change', updateScores);
    cb.addEventListener('change', updateScores);
  });
  // Inizializza subito i valori
  updateScores();
}

// Variabile condivisa per le classi disponibili
let availableClasses = [];

// Funzione per recuperare dati salvati
async function fetchSavedTeacherData(formType, contextId) {
    const user = firebase.auth().currentUser;
    if (!user) throw new Error("Utente non autenticato");
    const token = await user.getIdToken();

    const response = await fetch('/.netlify/functions/get-teacher-data', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formType, contextId })
    });

    if (!response.ok) return null;
    return await response.json();
}

// Event delegation per Fase 1 e Fase 3
// Registrata all'avvio su #dashboard-view
document.addEventListener('DOMContentLoaded', () => {
    const views = {
        home: document.getElementById('home-view'),
        questionnaire: document.getElementById('questionnaire-view'),
        login: document.getElementById('login-view'),
        dashboard: document.getElementById('dashboard-view'),
        studentDetail: document.getElementById('student-detail-view')
    };
    let isQuestionnaireInitialized = false;

    if (views.dashboard) {
        views.dashboard.addEventListener('click', async (event) => {
            const target = event.target.closest('button');
            if (!target) return;

            if (target.id === 'show-fase1-btn') {
    const contextId = "default";
    try {
        const savedData = await fetchSavedTeacherData('fase1', contextId);
        openModal(getPhase1FormHTML(availableClasses, savedData || {}), () => {
            const form = document.getElementById('fase1-form');
            if (form) form.addEventListener('submit', handleTeacherFormSubmit);
        });
    } catch (error) {
        console.error(error);
    }
}

            if (target.id === 'show-fase3-btn') {
    const contextId = "default";
    try {
        const savedData = await fetchSavedTeacherData('fase3', contextId);
        openModal(getPhase3FormHTML(savedData || {}), () => {
            const form = document.getElementById('fase3-form');
            if (form) form.addEventListener('submit', handleTeacherFormSubmit);
        });
    } catch (error) {
        console.error(error);
    }
}

        });
    }

    // --- LOGICA FINESTRA MODALE ---
    const modalContainer = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close-modal-btn');

    function openModal(content, onOpenCallback) {
        if (modalBody) modalBody.innerHTML = content;
        if (modalContainer) modalContainer.style.display = 'flex';
        if (typeof onOpenCallback === 'function') {
            onOpenCallback();
        }
    }

    function closeModal() {
        if (modalContainer) modalContainer.style.display = 'none';
        if (modalBody) modalBody.innerHTML = '';
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalContainer) modalContainer.addEventListener('click', function(event) {
        if (event.target === modalContainer) {
            closeModal();
        }
    });

    function getPhase1FormHTML(classiDisponibili = [], savedData = {}) {
    return `
        <h3>Fase 1: Griglia di Osservazione Classe</h3>
        <p>Indicare le annotazioni rilevanti.</p>
        <form id="fase1-form" data-studentid="default">
            <div class="teacher-form-section">
                <h4>Note su Scheda 1 (Mappa di sé)</h4>
                <div class="form-group"><label>Autoconsapevolezza:</label><textarea name="f1_s1_autoconsapevolezza" rows="2">${savedData.f1_s1_autoconsapevolezza || ''}</textarea></div>
                <div class="form-group"><label>Processo decisionale:</label><textarea name="f1_s1_processo_decisionale" rows="2">${savedData.f1_s1_processo_decisionale || ''}</textarea></div>
                <div class="form-group"><label>Visione futura:</label><textarea name="f1_s1_visione_futura" rows="2">${savedData.f1_s1_visione_futura || ''}</textarea></div>
                <div class="form-group"><label>Organizzazione:</label><textarea name="f1_s1_organizzazione" rows="2">${savedData.f1_s1_organizzazione || ''}</textarea></div>
            </div>
            <div class="teacher-form-section">
                <h4>Note su Scheda 2 (Pensiero sul lavoro)</h4>
                <div class="form-group"><label>Autoconsapevolezza:</label><textarea name="f1_s2_autoconsapevolezza" rows="2">${savedData.f1_s2_autoconsapevolezza || ''}</textarea></div>
                <div class="form-group"><label>Conoscenza del mondo del lavoro:</label><textarea name="f1_s2_conoscenza_lavoro" rows="2">${savedData.f1_s2_conoscenza_lavoro || ''}</textarea></div>
                <div class="form-group"><label>Visione futura:</label><textarea name="f1_s2_visione_futura" rows="2">${savedData.f1_s2_visione_futura || ''}</textarea></div>
                <div class="form-group"><label>Organizzazione:</label><textarea name="f1_s2_organizzazione" rows="2">${savedData.f1_s2_organizzazione || ''}</textarea></div>
            </div>
            <div class="teacher-form-section">
                <h4>Note su Scheda 3 (Modi di lavorare)</h4>
                <div class="form-group"><label>Autoconsapevolezza:</label><textarea name="f1_s3_autoconsapevolezza" rows="2">${savedData.f1_s3_autoconsapevolezza || ''}</textarea></div>
                <div class="form-group"><label>Processo decisionale:</label><textarea name="f1_s3_processo_decisionale" rows="2">${savedData.f1_s3_processo_decisionale || ''}</textarea></div>
                <div class="form-group"><label>Visione futura:</label><textarea name="f1_s3_visione_futura" rows="2">${savedData.f1_s3_visione_futura || ''}</textarea></div>
                <div class="form-group"><label>Organizzazione:</label><textarea name="f1_s3_organizzazione" rows="2">${savedData.f1_s3_organizzazione || ''}</textarea></div>
            </div>
            <div class="teacher-form-section">
                <h4>Note su Scheda 4 (Tutte le strade)</h4>
                <div class="form-group"><label>Autoconsapevolezza:</label><textarea name="f1_s4_autoconsapevolezza" rows="2">${savedData.f1_s4_autoconsapevolezza || ''}</textarea></div>
                <div class="form-group"><label>Conoscenza del mondo del lavoro:</label><textarea name="f1_s4_conoscenza_lavoro" rows="2">${savedData.f1_s4_conoscenza_lavoro || ''}</textarea></div>
                <div class="form-group"><label>Processo decisionale:</label><textarea name="f1_s4_processo_decisionale" rows="2">${savedData.f1_s4_processo_decisionale || ''}</textarea></div>
                <div class="form-group"><label>Visione futura:</label><textarea name="f1_s4_visione_futura" rows="2">${savedData.f1_s4_visione_futura || ''}</textarea></div>
                <div class="form-group"><label>Organizzazione:</label><textarea name="f1_s4_organizzazione" rows="2">${savedData.f1_s4_organizzazione || ''}</textarea></div>
            </div>
            <button type="submit" class="submit-btn">Salva Griglia Fase 1</button>
        </form>
    `;
}

    function getPhase2FormHTML(studentId, studentName, savedData = {}) {
    const isChecked = (name, value) => savedData[name] === value ? 'checked' : '';
    return `
        <h3>Fase 2: Scheda di Sintesi per ${studentName}</h3>
        <p>Indicare per ogni dimensione se è "Presente" o "Da potenziare".</p>
        <form id="fase2-form" data-studentid="${studentId}">
            <table class="evaluation-table">
                <thead><tr><th>SCHEDE</th><th>DIMENSIONI</th><th>Presente</th><th>Da potenziare</th></tr></thead>
                <tbody>
                    <tr><td rowspan="4">Scheda 1</td><td>Autoconsapevolezza</td>
    <td class="check-cell"><input type="radio" name="f2_s1_auto" value="presente" ${isChecked('f2_s1_auto', 'presente')} data-dim="autoconsapevolezza"></td>
    <td class="check-cell"><input type="radio" name="f2_s1_auto" value="potenziare" ${isChecked('f2_s1_auto', 'potenziare')} data-dim="autoconsapevolezza"></td></tr>
                    <tr><td>Processo decisionale</td>
    <td class="check-cell"><input type="radio" name="f2_s1_proc" value="presente" ${isChecked('f2_s1_proc', 'presente')} data-dim="processo_decisionale"></td>
    <td class="check-cell"><input type="radio" name="f2_s1_proc" value="potenziare" ${isChecked('f2_s1_proc', 'potenziare')} data-dim="processo_decisionale"></td></tr>
                    <tr><td>Visione futura</td>
    <td class="check-cell"><input type="radio" name="f2_s1_visi" value="presente" ${isChecked('f2_s1_visi', 'presente')} data-dim="visione_futura"></td>
    <td class="check-cell"><input type="radio" name="f2_s1_visi" value="potenziare" ${isChecked('f2_s1_visi', 'potenziare')} data-dim="visione_futura"></td></tr>
                    <tr><td>Organizzazione</td>
    <td class="check-cell"><input type="radio" name="f2_s1_orga" value="presente" ${isChecked('f2_s1_orga', 'presente')} data-dim="organizzazione"></td>
    <td class="check-cell"><input type="radio" name="f2_s1_orga" value="potenziare" ${isChecked('f2_s1_orga', 'potenziare')} data-dim="organizzazione"></td></tr>

                    <tr><td rowspan="4">Scheda 2</td><td>Autoconsapevolezza</td>
    <td class="check-cell"><input type="radio" name="f2_s2_auto" value="presente" ${isChecked('f2_s2_auto', 'presente')} data-dim="autoconsapevolezza"></td>
    <td class="check-cell"><input type="radio" name="f2_s2_auto" value="potenziare" ${isChecked('f2_s2_auto', 'potenziare')} data-dim="autoconsapevolezza"></td></tr>
<tr><td>Conoscenza mondo lavoro</td>
    <td class="check-cell"><input type="radio" name="f2_s2_cono" value="presente" ${isChecked('f2_s2_cono', 'presente')} data-dim="conoscenza_lavoro"></td>
    <td class="check-cell"><input type="radio" name="f2_s2_cono" value="potenziare" ${isChecked('f2_s2_cono', 'potenziare')} data-dim="conoscenza_lavoro"></td></tr>
<tr><td>Visione futura</td>
    <td class="check-cell"><input type="radio" name="f2_s2_visi" value="presente" ${isChecked('f2_s2_visi', 'presente')} data-dim="visione_futura"></td>
    <td class="check-cell"><input type="radio" name="f2_s2_visi" value="potenziare" ${isChecked('f2_s2_visi', 'potenziare')} data-dim="visione_futura"></td></tr>
<tr><td>Organizzazione</td>
    <td class="check-cell"><input type="radio" name="f2_s2_orga" value="presente" ${isChecked('f2_s2_orga', 'presente')} data-dim="organizzazione"></td>
    <td class="check-cell"><input type="radio" name="f2_s2_orga" value="potenziare" ${isChecked('f2_s2_orga', 'potenziare')} data-dim="organizzazione"></td></tr>

                    <tr><td rowspan="4">Scheda 3</td><td>Autoconsapevolezza</td>
<td class="check-cell"><input type="radio" name="f2_s3_auto" value="presente" ${isChecked('f2_s3_auto', 'presente')} data-dim="autoconsapevolezza"></td>
<td class="check-cell"><input type="radio" name="f2_s3_auto" value="potenziare" ${isChecked('f2_s3_auto', 'potenziare')} data-dim="autoconsapevolezza"></td></tr>

<tr><td>Processo decisionale</td>
<td class="check-cell"><input type="radio" name="f2_s3_proc" value="presente" ${isChecked('f2_s3_proc', 'presente')} data-dim="processo_decisionale"></td>
<td class="check-cell"><input type="radio" name="f2_s3_proc" value="potenziare" ${isChecked('f2_s3_proc', 'potenziare')} data-dim="processo_decisionale"></td></tr>

<tr><td>Visione futura</td>
<td class="check-cell"><input type="radio" name="f2_s3_visi" value="presente" ${isChecked('f2_s3_visi', 'presente')} data-dim="visione_futura"></td>
<td class="check-cell"><input type="radio" name="f2_s3_visi" value="potenziare" ${isChecked('f2_s3_visi', 'potenziare')} data-dim="visione_futura"></td></tr>

<tr><td>Organizzazione</td>
<td class="check-cell"><input type="radio" name="f2_s3_orga" value="presente" ${isChecked('f2_s3_orga', 'presente')} data-dim="organizzazione"></td>
<td class="check-cell"><input type="radio" name="f2_s3_orga" value="potenziare" ${isChecked('f2_s3_orga', 'potenziare')} data-dim="organizzazione"></td></tr>


                        <tr><td rowspan="5">Scheda 4</td><td>Autoconsapevolezza</td>
<td class="check-cell"><input type="radio" name="f2_s4_auto" value="presente" ${isChecked('f2_s4_auto', 'presente')} data-dim="autoconsapevolezza"></td>
<td class="check-cell"><input type="radio" name="f2_s4_auto" value="potenziare" ${isChecked('f2_s4_auto', 'potenziare')} data-dim="autoconsapevolezza"></td></tr>

<tr><td>Conoscenza mondo lavoro</td>
<td class="check-cell"><input type="radio" name="f2_s4_cono" value="presente" ${isChecked('f2_s4_cono', 'presente')} data-dim="conoscenza_lavoro"></td>
<td class="check-cell"><input type="radio" name="f2_s4_cono" value="potenziare" ${isChecked('f2_s4_cono', 'potenziare')} data-dim="conoscenza_lavoro"></td></tr>

<tr><td>Processo decisionale</td>
<td class="check-cell"><input type="radio" name="f2_s4_proc" value="presente" ${isChecked('f2_s4_proc', 'presente')} data-dim="processo_decisionale"></td>
<td class="check-cell"><input type="radio" name="f2_s4_proc" value="potenziare" ${isChecked('f2_s4_proc', 'potenziare')} data-dim="processo_decisionale"></td></tr>

<tr><td>Visione futura</td>
<td class="check-cell"><input type="radio" name="f2_s4_visi" value="presente" ${isChecked('f2_s4_visi', 'presente')} data-dim="visione_futura"></td>
<td class="check-cell"><input type="radio" name="f2_s4_visi" value="potenziare" ${isChecked('f2_s4_visi', 'potenziare')} data-dim="visione_futura"></td></tr>

<tr><td>Organizzazione</td>
<td class="check-cell"><input type="radio" name="f2_s4_orga" value="presente" ${isChecked('f2_s4_orga', 'presente')} data-dim="organizzazione"></td>
<td class="check-cell"><input type="radio" name="f2_s4_orga" value="potenziare" ${isChecked('f2_s4_orga', 'potenziare')} data-dim="organizzazione"></td></tr>

                    </tbody>
                </table>
                <hr>
                <h4>Sintesi per Dimensione (calcolata automaticamente)</h4>
                <table class="evaluation-table summary-table">
                    <thead><tr><th>DIMENSIONI</th><th>PRESENTE</th><th>DA POTENZIARE</th><th>RISULTATO GENERALE</th></tr></thead>
                    <tbody>
                        <tr><td>Autoconsapevolezza</td><td><input id="sum_auto_p" disabled> / 4</td><td><input id="sum_auto_d" disabled> / 4</td><td><input id="res_auto" disabled></td></tr>
                        <tr><td>Conoscenza mondo lavoro</td><td><input id="sum_cono_p" disabled> / 2</td><td><input id="sum_cono_d" disabled> / 2</td><td><input id="res_cono" disabled></td></tr>
                        <tr><td>Processo decisionale</td><td><input id="sum_proc_p" disabled> / 3</td><td><input id="sum_proc_d" disabled> / 3</td><td><input id="res_proc" disabled></td></tr>
                        <tr><td>Visione futura</td><td><input id="sum_visi_p" disabled> / 4</td><td><input id="sum_visi_d" disabled> / 4</td><td><input id="res_visi" disabled></td></tr>
                        <tr><td>Organizzazione</td><td><input id="sum_orga_p" disabled> / 4</td><td><input id="sum_orga_d" disabled> / 4</td><td><input id="res_orga" disabled></td></tr>
                    </tbody>
                </table>
                <button type="submit" class="submit-btn">Salva Sintesi Fase 2</button>
            </form>
        `;
    }

    function getPhase3FormHTML(savedData = {}) {
    return `
        <h3>Fase 3: Scheda di Sintesi Generale</h3>
        <form id="fase3-form" data-studentid="default">
            <hr>
            <p>Effettuare una sintesi dei risultati emersi per l'intero gruppo classe.</p>
            <div class="form-group"><label>Sintesi su Autoconsapevolezza:</label><textarea name="sintesi_autoconsapevolezza" rows="3">${savedData.sintesi_autoconsapevolezza || ''}</textarea></div>
            <div class="form-group"><label>Sintesi su Conoscenza del mondo del lavoro:</label><textarea name="sintesi_conoscenza_lavoro" rows="3">${savedData.sintesi_conoscenza_lavoro || ''}</textarea></div>
            <div class="form-group"><label>Sintesi su Processo decisionale:</label><textarea name="sintesi_processo_decisionale" rows="3">${savedData.sintesi_processo_decisionale || ''}</textarea></div>
            <div class="form-group"><label>Sintesi su Visione futura:</label><textarea name="sintesi_visione_futura" rows="3">${savedData.sintesi_visione_futura || ''}</textarea></div>
            <div class="form-group"><label>Sintesi su Organizzazione:</label><textarea name="sintesi_organizzazione" rows="3">${savedData.sintesi_organizzazione || ''}</textarea></div>
            <button type="submit" class="submit-btn">Salva Sintesi Fase 3</button>
        </form>
    `;
}


    
    // Funzione di salvataggio generica per i form del docente
    async function handleTeacherFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Salvataggio...';

        try {
            const user = firebase.auth().currentUser;
            if (!user) throw new Error("Utente non autenticato.");
            
            const token = await user.getIdToken();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            const formType = form.id.replace('-form', ''); // es. 'fase2'
const studentId = form.dataset.studentid || 'default';

const payload = {
  formType: formType,
  studentId: studentId,
  data: {
    [formType]: data  // => { fase2: { ... } }
  }
};

            const response = await fetch('/.netlify/functions/save-teacher-data', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Errore del server.');
            }
            
            alert('Dati salvati con successo!');
            closeModal();

        } catch (error) {
            alert(`Errore: ${error.message}`);
            submitButton.disabled = false;
            // Ripristina testo originale in base al form
            const formType = form.id.replace('-form', '');
            submitButton.textContent = `Salva ${formType.charAt(0).toUpperCase() + formType.slice(1)}`;
        }
    }

    function initializeQuestionnaire() {
        if (isQuestionnaireInitialized) return;
        const controlsContent = document.getElementById('controls-content');
        let selectedNode = null;
        const cy = cytoscape({
            container: document.getElementById('cy'),
            elements: [ { data: { id: 'io_sono', label: 'IO SONO' }, position: { x: 300, y: 200 }, locked: true, classes: 'io-sono' } ],
            style: [
                { selector: 'node', style: { 'label': 'data(label)','text-valign': 'center','color': '#fff','text-outline-width': 2,'background-color': '#888','width': 'label','height': 'label','padding': '10px','shape': 'round-rectangle','text-wrap': 'wrap','text-max-width': '140px' } },
                { selector: 'edge', style: { 'width': 3,'line-color': '#ccc','target-arrow-color': '#ccc','target-arrow-shape': 'triangle','curve-style': 'bezier' } },
                { selector: '.io-sono', style: { 'background-color': '#005a87','text-outline-color': '#005a87' } },
                { selector: '.aggettivo', style: { 'background-color': '#c15c2d','text-outline-color': '#c15c2d' } },
                { selector: '.attivita', style: { 'background-color': '#3a7d44','text-outline-color': '#3a7d44' } },
                { selector: '.contesto', style: { 'background-color': '#5bc0de','text-outline-color': '#5bc0de','color': '#000' } },
                { selector: ':selected', style: { 'border-width': 3,'border-color': '#DAA520' } }
            ],
            layout: { name: 'preset' }
        });

        function renderBaseControls() {
            selectedNode = null;
            cy.elements().unselect();
            controlsContent.innerHTML = `<div class="form-group"><label for="new-aggettivo">Aggiungi un aggettivo:</label><input type="text" id="new-aggettivo" placeholder="Es. Creativo"></div><button type="button" id="add-aggettivo-btn">+ Aggiungi Aggettivo</button>`;
            document.getElementById('add-aggettivo-btn').addEventListener('click', addAggettivoNode);
        }

        function renderDetailControls(node) {
            selectedNode = node;
            let deleteButtonText = '❌ Elimina questa voce';
            if (node.hasClass('aggettivo')) { deleteButtonText = '❌ Elimina aggettivo e collegamenti'; }
            controlsContent.innerHTML = `<h4>Dettagli per: "${node.data('label')}"</h4><div id="detail-actions"><p>Cosa vuoi collegare a questo aggettivo?</p><button type="button" id="show-attivita-input">+ Aggiungi Attività</button><button type="button" id="show-contesto-input">+ Aggiungi Contesto</button></div><hr><button type="button" id="delete-node-btn" class="delete-btn">${deleteButtonText}</button><button type="button" id="back-to-base-btn">Annulla</button>`;
            const detailActions = document.getElementById('detail-actions');
            if (!node.hasClass('aggettivo')) { detailActions.style.display = 'none'; }
            document.getElementById('show-attivita-input')?.addEventListener('click', () => showDetailInput('attivita'));
            document.getElementById('show-contesto-input')?.addEventListener('click', () => showDetailInput('contesto'));
            document.getElementById('delete-node-btn').addEventListener('click', deleteSelectedNode);
            document.getElementById('back-to-base-btn').addEventListener('click', renderBaseControls);
        }

        function showDetailInput(type) {
            const typeText = type === 'attivita' ? "un'attività" : 'un contesto';
            controlsContent.innerHTML = `<h4>Aggiungi ${typeText}</h4><div class="form-group"><label for="new-detail-text">Testo:</label><input type="text" id="new-detail-text" placeholder="Es. Suono la chitarra"></div><button type="button" id="confirm-detail-btn">Conferma</button><button type="button" id="cancel-detail-btn">Annulla</button>`;
            document.getElementById('confirm-detail-btn').addEventListener('click', () => addDetailNode(type));
            document.getElementById('cancel-detail-btn').addEventListener('click', () => renderDetailControls(selectedNode));
        }

        function deleteSelectedNode() {
            if (selectedNode) { const children = selectedNode.outgoers('node'); selectedNode.union(children).remove(); renderBaseControls(); }
        }

        function addAggettivoNode() {
            const input = document.getElementById('new-aggettivo');
            const label = input.value.trim();
            if (label) {
                const newNodeId = `aggettivo_${Date.now()}`;
                cy.add([{ group: 'nodes', data: { id: newNodeId, label: label }, classes: 'aggettivo' }, { group: 'edges', data: { source: 'io_sono', target: newNodeId } }]);
                cy.layout({ name: 'cose', animate: true, padding: 30 }).run();
                input.value = '';
            }
        }

        function addDetailNode(type) {
            const input = document.getElementById('new-detail-text');
            const label = input.value.trim();
            if (label && selectedNode) {
                const newNodeId = `${type}_${Date.now()}`;
                cy.add([{ group: 'nodes', data: { id: newNodeId, label: label }, classes: type }, { group: 'edges', data: { source: selectedNode.id(), target: newNodeId } }]);
                cy.layout({ name: 'cose', animate: true, padding: 30 }).run();
                renderDetailControls(selectedNode);
            }
        }

        cy.on('tap', 'node', function(evt){ const node = evt.target; if (node.id() !== 'io_sono') { renderDetailControls(node); } });
        renderBaseControls();

        const scores = { gente: 0, dati: 0, idee: 0, cose: 0 };
        const scoreSpans = {
            gente: document.getElementById('punteggio-gente'),
            dati: document.getElementById('punteggio-dati'),
            idee: document.getElementById('punteggio-idee'),
            cose: document.getElementById('punteggio-cose')
        };
        const checkboxes = document.querySelectorAll('input[type="checkbox"][data-category]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const category = checkbox.dataset.category;
                scores[category] = checkbox.checked ? scores[category] + 1 : scores[category] - 1;
                if(scoreSpans[category]) scoreSpans[category].textContent = scores[category];
            });
        });

        const form = document.getElementById('soi-form');
        let savedData = {};
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitButton = event.target.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Salvataggio in corso...';
            const formData = new FormData(form);
            savedData = Object.fromEntries(formData.entries());
            savedData.mappa_interattiva = cy.json();
            try {
                const response = await fetch('/.netlify/functions/submit-data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(savedData) });
                if (response.ok) {
                    form.style.display = 'none';
                    document.getElementById('completion-section').style.display = 'block';
                } else {
                    const errorData = await response.json();
                    alert(`Si è verificato un errore durante il salvataggio: ${errorData.message}`);
                    submitButton.disabled = false; submitButton.textContent = 'Invia e Salva i Dati';
                }
            } catch (error) {
                console.error('Errore di connessione:', error);
                alert('Errore di connessione. Controlla la console del browser per i dettagli.');
                submitButton.disabled = false; submitButton.textContent = 'Invia e Salva i Dati';
            }
        });

        document.getElementById('download-pdf-btn').addEventListener('click', () => {
             const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            // ... (codice generazione PDF completo che hai già)
            doc.save(`Riepilogo_SOI_${savedData.cognome || 'Studente'}_${savedData.nome || ''}.pdf`);
        });
        
        isQuestionnaireInitialized = true;
    }

    async function initializeDashboard() {
        const user = firebase.auth().currentUser;
        if (!user) return;
        const container = document.getElementById('student-list-container');
        if (!container) return;
        container.innerHTML = '<p>Caricamento studenti in corso...</p>';
        try {
            const token = await user.getIdToken();
            const response = await fetch('/.netlify/functions/get-student-data', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Errore nel caricamento dei dati.');
            }
            const payload = await response.json();
            const students = payload.students || [];
            availableClasses = payload.classes || [];
            renderStudentTable(students);
        } catch (error) {
            container.innerHTML = `<p class="error-message">Impossibile caricare la lista degli studenti: ${error.message}</p>`;
            console.error(error);
        }
    }
        
    function renderStudentTable(students) {
        const container = document.getElementById('student-list-container');
        if (!container) return;
        if (students.length === 0) {
            container.innerHTML = '<p>Nessuno studente ha ancora compilato il questionario.</p>';
            return;
        }
        let tableHTML = '<table class="student-table"><thead><tr><th>Cognome</th><th>Nome</th><th>Classe</th><th>Data Compilazione</th><th>Azioni</th></tr></thead><tbody>';
        students.forEach(student => {
            tableHTML += `<tr><td>${student.cognome}</td><td>${student.nome}</td><td>${student.classe}</td><td>${student.data}</td><td><button class="details-btn" data-id="${student.id}" data-name="${student.nome} ${student.cognome}">Vedi Dettagli</button></td></tr>`;
        });
        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;
        
        container.addEventListener('click', function(event) {
            if (event.target && event.target.classList.contains('details-btn')) {
                const studentId = event.target.dataset.id;
                const studentName = event.target.dataset.name;
                window.location.hash = `#/docente/studente/${studentId}/${encodeURIComponent(studentName)}`;
            }
        });
    }

    function renderMapDataAsText(mapData) {
        if (!mapData || !mapData.elements || !mapData.elements.nodes) { return '<p><strong>Riepilogo Mappa:</strong> Nessun dato presente nella mappa.</p>';}
        let html = '<div><strong>Riepilogo Mappa Interattiva:</strong><ul>';
        const nodes = mapData.elements.nodes;
        const edges = mapData.elements.edges;
        const aggettivoNodes = nodes.filter(n => n.classes && n.classes.includes('aggettivo'));
        if (aggettivoNodes.length === 0) { return '<p><strong>Riepilogo Mappa:</strong> Nessun aggettivo inserito nella mappa.</p>';}
        aggettivoNodes.forEach(aggettivo => {
            html += `<li><strong>${aggettivo.data.label}</strong><ul>`;
            const connectedEdges = edges.filter(e => e.data.source === aggettivo.data.id);
            if (connectedEdges.length > 0) {
                connectedEdges.forEach(edge => {
                    const targetNode = nodes.find(n => n.data.id === edge.data.target);
                    if (targetNode) {
                        const type = targetNode.classes.includes('attivita') ? 'Attività' : 'Contesto';
                        html += `<li><em>${type}:</em> ${targetNode.data.label}</li>`;
                    }
                });
            } else { html += `<li>Nessun dettaglio collegato.</li>`; }
            html += `</ul></li>`;
        });
        html += '</ul></div>';
        return html;
    }

    async function initializeStudentDetailView(studentId, studentName) {
        const user = firebase.auth().currentUser;
        if (!user) return;
        const contentDiv = document.getElementById('student-detail-content');
        const title = document.getElementById('student-name-title');
        title.textContent = `Dettaglio per: ${decodeURIComponent(studentName)}`;
        contentDiv.innerHTML = '<p>Caricamento dati in corso...</p>';
        try {
            const token = await user.getIdToken();
            const response = await fetch('/.netlify/functions/get-single-student-data', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId })
            });
            if (!response.ok) { throw new Error('Studente non trovato o errore di caricamento.'); }
            const teacherResponse = await fetch('/.netlify/functions/get-teacher-data?studentId=' + studentId);
let teacherData = {};
if (teacherResponse.ok) {
    const teacherJson = await teacherResponse.json();
    teacherData = teacherJson?.fase2 || {};
    console.log("🎓 Dati fase2 del docente recuperati:", teacherData);
} else {
    console.warn("⚠️ Nessun dato docente trovato per questo studente");
}

            const data = await response.json();
console.log("📦 Dati ricevuti da Firebase:", JSON.stringify(data, null, 2));

	    const savedPhase2 = teacherData;
console.log("📤 savedPhase2 passato a getPhase2FormHTML:", JSON.stringify(savedPhase2, null, 2));

          
            const renderField = (label, value) => `<p><strong>${label}:</strong><br>${value || 'Non specificato'}</p>`;

            let html = `
                <div class="student-data-section">
                    <h4>SCHEDA 1 – MAPPA DI DESCRIZIONE DI SÉ</h4>
                    ${renderField('10 Aggettivi (elenco)', [...Array(10).keys()].map(i => data[`aggettivo_${i+1}`] || '').filter(Boolean).join(', '))}
                    ${renderMapDataAsText(data.mappa_interattiva)}
                    ${renderField('Attività preferite dalla mappa', data.scheda1_attivita_preferite)}
                    ${renderField('Preferenze scolastiche', data.scheda1_preferenze_scolastiche)}
                </div>
                <div class="student-data-section">
                    <h4>SCHEDA 2 – UN PENSIERO SUL LAVORO</h4>
                    ${renderField('Cosa è il lavoro', data.scheda2_cosa_e_lavoro)}
                    ${renderField('Perché le persone lavorano', data.scheda2_perche_si_lavora)}
                    ${renderField('Se nessuno lavorasse', data.scheda2_se_nessuno_lavorasse)}
                    ${renderField('Se penso al lavoro, mi sento...', data.scheda2_come_mi_sento)}
                </div>
                 <div class="student-data-section">
                    <h4>SCHEDA 3 – MODI DI LAVORARE</h4>
                    ${renderField('Riflessione', data.scheda3_riflessione)}
                </div>
                 <div class="student-data-section">
                    <h4>SCHEDA 4 – TUTTE LE POSSIBILI STRADE</h4>
                    ${renderField('Lavori desiderati', data.scheda4_lavori_desiderati)}
                    ${renderField('Immaginario sul lavoro', data.scheda4_immaginario_lavoro)}
                    ${renderField('Motivazioni', data.scheda4_motivazioni)}
                    ${renderField('Desideri e sogni', data.scheda4_desideri_sogni)}
                    ${renderField('Ispirazione', data.scheda4_ispirazione)}
                    ${renderField('Modo di studiare', data.scheda4_modo_studiare)}
                </div>
            `;
            contentDiv.innerHTML = html;
            
            document.getElementById('show-fase2-btn')?.addEventListener('click', () => {
console.log("📤 savedPhase2 passato a getPhase2FormHTML:", JSON.stringify(savedPhase2, null, 2));
		    openModal(`
  <div class="split-modal-container">
    <div class="split-modal-left">
      ${html}
    </div>
    <div class="split-modal-right">
      ${getPhase2FormHTML(studentId, decodeURIComponent(studentName), savedPhase2)}
    </div>
  </div>
`, () => {
  attachPhase2Calculators();
  document.getElementById('fase2-form')?.addEventListener('submit', handleTeacherFormSubmit);
});
            });
        } catch (error) {
            title.textContent = "Errore";
            contentDiv.innerHTML = `<p class="error-message">Impossibile caricare i dati dello studente.</p>`;
        }
    }

    function attachPhase2Calculators() {
    const form = document.getElementById('fase2-form');
    if (!form) return;

    const dimensions = {
        autoconsapevolezza: { p: 0, d: 0, total: 4, id: 'auto' },
        conoscenza_lavoro: { p: 0, d: 0, total: 2, id: 'cono' },
        processo_decisionale: { p: 0, d: 0, total: 3, id: 'proc' },
        visione_futura: { p: 0, d: 0, total: 4, id: 'visi' },
        organizzazione: { p: 0, d: 0, total: 4, id: 'orga' }
    };

    const recalculate = () => {
        Object.values(dimensions).forEach(dim => { dim.p = 0; dim.d = 0; });

        const checkedRadios = form.querySelectorAll('input[type="radio"]:checked');
        checkedRadios.forEach(radio => {
            const dim = radio.dataset.dim;
            if (dimensions[dim]) {
                if (radio.value === 'presente') dimensions[dim].p++;
                else if (radio.value === 'potenziare') dimensions[dim].d++;
            }
        });

        Object.values(dimensions).forEach(dim => {
            const p_el = document.getElementById(`sum_${dim.id}_p`);
            const d_el = document.getElementById(`sum_${dim.id}_d`);
            const res_el = document.getElementById(`res_${dim.id}`);
            if (p_el) p_el.value = dim.p;
            if (d_el) d_el.value = dim.d;
            if (res_el) {
                if ((dim.p + dim.d) > 0) {
                    res_el.value = (dim.p >= dim.d) ? 'PRESENTE' : 'DA POTENZIARE';
                } else {
                    res_el.value = '';
                }
            }
        });
    };

    // Innesca ricalcolo ogni volta che cambia un radio
    form.addEventListener('change', (e) => {
        if (e.target.type === 'radio') {
            recalculate();
        }
    });

    // Innesca ricalcolo al primo caricamento dati
    setTimeout(() => {
        const checkedRadios = form.querySelectorAll('input[type="radio"]:checked');
        checkedRadios.forEach(input => input.dispatchEvent(new Event('change')));
    }, 50);
}

    function handleRouteChange() {
    const hash = window.location.hash;
    Object.values(views).forEach(view => {
        if (view) view.style.display = 'none';
    });

    const user = firebase.auth().currentUser;

    if (hash.startsWith('#/docente/studente/')) {
        if (user) {
            const parts = hash.split('/');
            const studentId = parts[3];
            const studentName = parts[4] || '';
            if (views.studentDetail) {
                views.studentDetail.style.display = 'block';
                initializeStudentDetailView(studentId, studentName);
            }
        } else {
            window.location.hash = '#/docente/login';
        }
    } else if (hash.startsWith('#/docente/dashboard')) {
        if (user) {
            views.dashboard.style.display = 'block';
            initializeDashboard();
        } else {
            window.location.hash = '#/docente/login';
        }
    } else if (hash.startsWith('#/docente/login')) {
        views.login.style.display = 'block';

    } else if (hash === '#/studente/fase1-anno1') {
        const view = document.getElementById('questionnaire-fase1-anno1');
        if (view) view.style.display = 'block';

    } else if (hash === '#/studente/fase1-anno2') {
        const view = document.getElementById('questionnaire-fase1-anno2');
        if (view) view.style.display = 'block';

    } else if (hash === '#/studente/fase1-anno3') {
        const view = document.getElementById('questionnaire-fase1-anno3');
        if (view) view.style.display = 'block';

    } else {
        views.home.style.display = 'block';
    }
}

    
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const loginError = document.getElementById('login-error');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            if(loginError) loginError.style.display = 'none';
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(userCredential => { window.location.hash = '#/docente/dashboard'; })
                .catch(error => {
                    if(loginError) {
                        loginError.textContent = "Credenziali non valide. Riprova.";
                        loginError.style.display = 'block';
                    }
                });
        });
    }

    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            firebase.auth().signOut().then(() => { window.location.hash = '#/'; });
        });
    }

    firebase.auth().onAuthStateChanged(user => { handleRouteChange(); });
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();
});