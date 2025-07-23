document.addEventListener('DOMContentLoaded', () => {
    const controlsContent = document.getElementById('controls-content');
    let selectedNode = null;

    // --- Inizializzazione della Mappa (Cytoscape.js) ---
    const cy = cytoscape({
        container: document.getElementById('cy'),
        elements: [
            { data: { id: 'io_sono', label: 'IO SONO' }, position: { x: 300, y: 200 }, locked: true, classes: 'io-sono' }
        ],
        style: [
            { selector: 'node', style: { 'label': 'data(label)', 'text-valign': 'center', 'color': '#fff', 'text-outline-width': 2, 'text-outline-color': '#888', 'background-color': '#888', 'width': 'label', 'height': 'label', 'padding': '10px', 'shape': 'round-rectangle', 'text-wrap': 'wrap', 'text-max-width': '120px' } },
            { selector: 'edge', style: { 'width': 3, 'line-color': '#ccc', 'target-arrow-color': '#ccc', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier' } },
            { selector: '.io-sono', style: { 'background-color': '#005a87', 'text-outline-color': '#005a87' } },
            { selector: '.qualita', style: { 'background-color': '#3a7d44', 'text-outline-color': '#3a7d44' } },
            { selector: '.dettaglio', style: { 'background-color': '#c15c2d', 'text-outline-color': '#c15c2d' } },
            { selector: ':selected', style: { 'border-width': 3, 'border-color': '#DAA520' } }
        ],
        layout: { name: 'preset' }
    });

    // --- Funzioni per aggiornare il pannello di controllo ---
    function renderBaseControls() {
        selectedNode = null;
        cy.elements().unselect(); // Deseleziona qualsiasi elemento
        controlsContent.innerHTML = `
            <div class="form-group">
                <label for="new-qualita">Aggiungi una qualità:</label>
                <input type="text" id="new-qualita" placeholder="Es. Creativo">
            </div>
            <button type="button" id="add-qualita-btn">+ Aggiungi Qualità</button>
        `;
        document.getElementById('add-qualita-btn').addEventListener('click', addQualitaNode);
    }

    function renderDetailControls(node) {
        selectedNode = node;
        controlsContent.innerHTML = `
            <h4>Dettagli per: ${node.data('label')}</h4>
            <div class="form-group">
                <label for="new-dettaglio">Aggiungi attività/contesto:</label>
                <input type="text" id="new-dettaglio" placeholder="Es. Suono la chitarra">
            </div>
            <button type="button" id="add-dettaglio-btn">+ Aggiungi Dettaglio</button>
            <hr>
            <button type="button" id="delete-node-btn" class="delete-btn">❌ Elimina questa voce</button>
            <button type="button" id="back-to-base-btn">Torna Indietro</button>
        `;
        document.getElementById('add-dettaglio-btn').addEventListener('click', addDettaglioNode);
        document.getElementById('delete-node-btn').addEventListener('click', deleteSelectedNode);
        document.getElementById('back-to-base-btn').addEventListener('click', renderBaseControls);
    }
    
    // --- Funzione per cancellare un nodo ---
    function deleteSelectedNode() {
        if (selectedNode) {
            selectedNode.remove();
            renderBaseControls();
        }
    }

    // --- Funzioni per aggiungere nodi alla mappa ---
    function addQualitaNode() {
        const input = document.getElementById('new-qualita');
        const label = input.value.trim();
        if (label) {
            const newNodeId = `qualita_${Date.now()}`;
            cy.add([
                { group: 'nodes', data: { id: newNodeId, label: label }, classes: 'qualita' },
                { group: 'edges', data: { source: 'io_sono', target: newNodeId } }
            ]);
            cy.layout({ name: 'cose', animate: true, padding: 30 }).run();
            input.value = '';
        }
    }

    function addDettaglioNode() {
        const input = document.getElementById('new-dettaglio');
        const label = input.value.trim();
        if (label && selectedNode) {
            const newNodeId = `dettaglio_${Date.now()}`;
            cy.add([
                { group: 'nodes', data: { id: newNodeId, label: label }, classes: 'dettaglio' },
                { group: 'edges', data: { source: selectedNode.id(), target: newNodeId } }
            ]);
            cy.layout({ name: 'cose', animate: true, padding: 30 }).run();
            input.value = '';
        }
    }

    // --- Gestione Eventi della Mappa ---
    cy.on('tap', 'node', function(evt){
        const node = evt.target;
        // Permette di selezionare solo i nodi 'qualita' o 'dettaglio'
        if (node.id() !== 'io_sono') {
            renderDetailControls(node);
        }
    });

    // Inizializza il pannello di controllo
    renderBaseControls();

    // --- Gestione Invio Form (invariata) ---
    const form = document.getElementById('soi-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Salvataggio in corso...';
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.mappa_interattiva = cy.json();

        try {
            const response = await fetch('/.netlify/functions/submit-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                form.style.display = 'none';
                document.getElementById('completion-section').style.display = 'block';
            } else {
                const errorData = await response.json();
                alert(`Si è verificato un errore durante il salvataggio: ${errorData.message}`);
                submitButton.disabled = false;
                submitButton.textContent = 'Invia e Salva i Dati';
            }
        } catch (error) {
            console.error('Errore di connessione:', error);
            alert('Errore di connessione. Controlla la console del browser per i dettagli.');
            submitButton.disabled = false;
            submitButton.textContent = 'Invia e Salva i Dati';
        }
    });

    // Gestione PDF (invariata)
    document.getElementById('download-pdf-btn').addEventListener('click', () => {
        alert("La generazione del PDF con la mappa sarà implementata in un secondo momento.");
    });
});