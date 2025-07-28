document.addEventListener('DOMContentLoaded', () => {
    const controlsContent = document.getElementById('controls-content');
    let selectedNode = null;

    const cy = cytoscape({
        container: document.getElementById('cy'),
        elements: [ { data: { id: 'io_sono', label: 'IO SONO' }, position: { x: 300, y: 200 }, locked: true, classes: 'io-sono' } ],
        style: [
            { selector: 'node', style: { 'label': 'data(label)', 'text-valign': 'center', 'color': '#fff', 'text-outline-width': 2, 'background-color': '#888', 'width': 'label', 'height': 'label', 'padding': '10px', 'shape': 'round-rectangle', 'text-wrap': 'wrap', 'text-max-width': '140px' } },
            { selector: 'edge', style: { 'width': 3, 'line-color': '#ccc', 'target-arrow-color': '#ccc', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier' } },
            { selector: '.io-sono', style: { 'background-color': '#005a87', 'text-outline-color': '#005a87' } },
            { selector: '.aggettivo', style: { 'background-color': '#c15c2d', 'text-outline-color': '#c15c2d' } },
            { selector: '.attivita', style: { 'background-color': '#3a7d44', 'text-outline-color': '#3a7d44' } },
            { selector: '.contesto', style: { 'background-color': '#5bc0de', 'text-outline-color': '#5bc0de', 'color': '#000' } },
            { selector: ':selected', style: { 'border-width': 3, 'border-color': '#DAA520' } }
        ],
        layout: { name: 'preset' }
    });

    function renderBaseControls() {
        selectedNode = null;
        cy.elements().unselect();
        controlsContent.innerHTML = `
            <div class="form-group">
                <label for="new-aggettivo">Aggiungi un aggettivo:</label>
                <input type="text" id="new-aggettivo" placeholder="Es. Creativo">
            </div>
            <button type="button" id="add-aggettivo-btn">+ Aggiungi Aggettivo</button>
        `;
        document.getElementById('add-aggettivo-btn').addEventListener('click', addAggettivoNode);
    }

    function renderDetailControls(node) {
        selectedNode = node;
        let deleteButtonText = '❌ Elimina questa voce';
        if (node.hasClass('aggettivo')) {
            deleteButtonText = '❌ Elimina aggettivo e collegamenti';
        }

        controlsContent.innerHTML = `
            <h4>Dettagli per: "${node.data('label')}"</h4>
            <div id="detail-actions">
                <p>Cosa vuoi collegare a questo aggettivo?</p>
                <button type="button" id="show-attivita-input">+ Aggiungi Attività</button>
                <button type="button" id="show-contesto-input">+ Aggiungi Contesto</button>
            </div>
            <hr>
            <button type="button" id="delete-node-btn" class="delete-btn">${deleteButtonText}</button>
            <button type="button" id="back-to-base-btn">Annulla</button>
        `;

        const detailActions = document.getElementById('detail-actions');
        if (!node.hasClass('aggettivo')) {
            detailActions.style.display = 'none';
        }

        document.getElementById('show-attivita-input')?.addEventListener('click', () => showDetailInput('attivita'));
        document.getElementById('show-contesto-input')?.addEventListener('click', () => showDetailInput('contesto'));
        document.getElementById('delete-node-btn').addEventListener('click', deleteSelectedNode);
        document.getElementById('back-to-base-btn').addEventListener('click', renderBaseControls);
    }

    function showDetailInput(type) {
        const typeText = type === 'attivita' ? 'un\'attività' : 'un contesto';
        controlsContent.innerHTML = `
            <h4>Aggiungi ${typeText}</h4>
            <div class="form-group">
                <label for="new-detail-text">Testo:</label>
                <input type="text" id="new-detail-text" placeholder="Es. Suono la chitarra">
            </div>
            <button type="button" id="confirm-detail-btn">Conferma</button>
            <button type="button" id="cancel-detail-btn">Annulla</button>
        `;
        document.getElementById('confirm-detail-btn').addEventListener('click', () => addDetailNode(type));
        document.getElementById('cancel-detail-btn').addEventListener('click', () => renderDetailControls(selectedNode));
    }

    function deleteSelectedNode() {
        if (selectedNode) {
            const children = selectedNode.outgoers('node');
            selectedNode.union(children).remove();
            renderBaseControls();
        }
    }

    function addAggettivoNode() {
        const input = document.getElementById('new-aggettivo');
        const label = input.value.trim();
        if (label) {
            const newNodeId = `aggettivo_${Date.now()}`;
            cy.add([
                { group: 'nodes', data: { id: newNodeId, label: label }, classes: 'aggettivo' },
                { group: 'edges', data: { source: 'io_sono', target: newNodeId } }
            ]);
            cy.layout({ name: 'cose', animate: true, padding: 30 }).run();
            input.value = '';
        }
    }

    function addDetailNode(type) {
        const input = document.getElementById('new-detail-text');
        const label = input.value.trim();
        if (label && selectedNode) {
            const newNodeId = `${type}_${Date.now()}`;
            cy.add([
                { group: 'nodes', data: { id: newNodeId, label: label }, classes: type },
                { group: 'edges', data: { source: selectedNode.id(), target: newNodeId } }
            ]);
            cy.layout({ name: 'cose', animate: true, padding: 30 }).run();
            renderDetailControls(selectedNode);
        }
    }

    cy.on('tap', 'node', function(evt){
        const node = evt.target;
        if (node.hasClass('aggettivo')) {
            renderDetailControls(node);
        }
    });

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
            scoreSpans[category].textContent = scores[category];
        });
    });
    
    const form = document.getElementById('soi-form');
    let savedData = {}; // Variabile per conservare i dati dopo l'invio
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = event.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Salvataggio in corso...';
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.mappa_interattiva = cy.json();
        savedData = data; // Salva i dati per il PDF

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
    
    // ================= NUOVA LOGICA PER LA GENERAZIONE DEL PDF =================
    document.getElementById('download-pdf-btn').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;

        function checkPageBreak(neededHeight = 10) {
            if (y + neededHeight > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                y = margin;
            }
        }

        // TITOLO E DATI STUDENTE
        doc.setFontSize(20).setFont(undefined, 'bold');
        doc.text('Riepilogo Questionario SOI', pageWidth / 2, y, { align: 'center' });
        y += 15;
        doc.setFontSize(12).setFont(undefined, 'normal');
        doc.text(`Studente: ${savedData.nome || ''} ${savedData.cognome || ''}`, margin, y);
        y += 7;
        doc.text(`Classe: ${savedData.classe || ''}`, margin, y);
        y += 7;
        doc.text(`Data: ${savedData.data || ''}`, margin, y);
        y += 15;

        // FUNZIONE PER AGGIUNGERE SEZIONI
        function addSection(title, data) {
            checkPageBreak(20);
            doc.setFontSize(16).setFont(undefined, 'bold');
            doc.text(title, margin, y);
            y += 10;
            doc.setDrawColor(200).line(margin, y, pageWidth - margin, y);
            y += 8;

            doc.setFontSize(11).setFont(undefined, 'normal');
            data.forEach(({ label, value }) => {
                if(value) {
                    checkPageBreak(15);
                    doc.setFont(undefined, 'bold').text(label, margin, y);
                    const splitText = doc.splitTextToSize(value, pageWidth - margin * 2);
                    doc.setFont(undefined, 'normal').text(splitText, margin, y + 6);
                    y += (splitText.length * 5) + 8;
                }
            });
            y += 5;
        }

        // SCHEDA 1
        doc.setFontSize(16).setFont(undefined, 'bold').text("SCHEDA 1 – MAPPA DI DESCRIZIONE DI SÉ", margin, y);
        y += 10;
        const aggettivi = [];
        for (let i = 1; i <= 10; i++) {
            if (savedData[`aggettivo_${i}`]) aggettivi.push(savedData[`aggettivo_${i}`]);
        }
        addSection("10 Aggettivi", [{ label: "I tuoi aggettivi:", value: aggettivi.join(', ') }]);
        
        // Rappresentazione testuale della mappa
        checkPageBreak(20);
        doc.setFontSize(11).setFont(undefined, 'bold').text("La tua mappa interattiva:", margin, y);
        y += 8;
        doc.setFont(undefined, 'normal');
        const mapData = savedData.mappa_interattiva.elements;
        const aggettivoNodes = mapData.nodes.filter(n => n.classes.includes('aggettivo'));
        aggettivoNodes.forEach(aggettivo => {
            checkPageBreak(8);
            doc.setFont(undefined, 'bold').text(`• ${aggettivo.data.label}:`, margin + 5, y);
            y += 6;
            const connectedEdges = mapData.edges.filter(e => e.data.source === aggettivo.data.id);
            connectedEdges.forEach(edge => {
                const targetNode = mapData.nodes.find(n => n.data.id === edge.data.target);
                checkPageBreak(6);
                const type = targetNode.classes.includes('attivita') ? 'Attività' : 'Contesto';
                doc.setFont(undefined, 'normal').text(`- ${type}: ${targetNode.data.label}`, margin + 10, y);
                y += 6;
            });
        });
        y += 8;

        addSection("Riflessioni (Scheda 1)", [
            { label: "Le due attività che ti piacciono di più e perché:", value: savedData.scheda1_attivita_preferite },
            { label: "Cosa ti piace della scuola:", value: savedData.scheda1_preferenze_scolastiche }
        ]);

        // SCHEDA 2
        addSection("SCHEDA 2 – UN PENSIERO SUL LAVORO", [
            { label: "Secondo te, cosa è il lavoro?", value: savedData.scheda2_cosa_e_lavoro },
            { label: "Perché le persone lavorano?", value: savedData.scheda2_perche_si_lavora },
            { label: "Se nessuno lavorasse, cosa succederebbe?", value: savedData.scheda2_se_nessuno_lavorasse },
            { label: "Se penso al lavoro, mi sento...", value: savedData.scheda2_come_mi_sento }
        ]);

        // SCHEDA 3
        checkPageBreak(20);
        doc.setFontSize(16).setFont(undefined, 'bold').text("SCHEDA 3 – MODI DI LAVORARE", margin, y);
        y += 10;
        addSection("Riepilogo Punteggi", [
            { label: "Lavorare con la Gente:", value: `${scores.gente} su 10` },
            { label: "Lavorare con i Dati:", value: `${scores.dati} su 10` },
            { label: "Lavorare con le Idee:", value: `${scores.idee} su 10` },
            { label: "Lavorare con le Cose:", value: `${scores.cose} su 10` }
        ]);
        addSection("Riflessione (Scheda 3)", [
            { label: "Cosa hai capito di te e come ti piacerebbe lavorare?", value: savedData.scheda3_riflessione }
        ]);

        // SCHEDA 4
        addSection("SCHEDA 4 – TUTTE LE POSSIBILI STRADE", [
            { label: "Quali lavori ti piacerebbe fare da grande?", value: savedData.scheda4_lavori_desiderati },
            { label: "Come ti immagini mentre svolgi uno di questi lavori?", value: savedData.scheda4_immaginario_lavoro },
            { label: "Perché pensi che questo lavoro faccia per te?", value: savedData.scheda4_motivazioni },
            { label: "Quali desideri, sogni, obiettivi pensi di poter realizzare?", value: savedData.scheda4_desideri_sogni },
            { label: "C'è qualcuno che ammiri o che ti ispira?", value: savedData.scheda4_ispirazione },
            { label: "Qual è il modo di studiare che funziona meglio per te?", value: savedData.scheda4_modo_studiare }
        ]);

        // SALVATAGGIO DEL FILE
        doc.save(`Riepilogo_SOI_${savedData.cognome || 'Studente'}_${savedData.nome || ''}.pdf`);
    });
});