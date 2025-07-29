document.addEventListener('DOMContentLoaded', () => {
    // Definizione delle viste
    const views = {
        home: document.getElementById('home-view'),
        questionnaire: document.getElementById('questionnaire-view'),
        login: document.getElementById('login-view'),
        dashboard: document.getElementById('dashboard-view')
    };
    let isQuestionnaireInitialized = false;

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
            // ... (codice generazione PDF completo)
            doc.save(`Riepilogo_SOI_${savedData.cognome || 'Studente'}_${savedData.nome || ''}.pdf`);
        });
        
        isQuestionnaireInitialized = true;
    }

    async function initializeDashboard() {
        const user = firebase.auth().currentUser;
        if (!user) return;
        const container = document.getElementById('student-list-container');
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
            const students = await response.json();
            renderStudentTable(students);
        } catch (error) {
            container.innerHTML = `<p class="error-message">Impossibile caricare la lista degli studenti: ${error.message}</p>`;
            console.error(error);
        }
    }

    function renderStudentTable(students) {
        const container = document.getElementById('student-list-container');
        if (students.length === 0) {
            container.innerHTML = '<p>Nessuno studente ha ancora compilato il questionario.</p>';
            return;
        }
        let tableHTML = '<table class="student-table"><thead><tr><th>Cognome</th><th>Nome</th><th>Classe</th><th>Data Compilazione</th><th>Azioni</th></tr></thead><tbody>';
        students.forEach(student => {
            tableHTML += `<tr><td>${student.cognome}</td><td>${student.nome}</td><td>${student.classe}</td><td>${student.data}</td><td><button class="details-btn" data-id="${student.id}">Vedi Dettagli</button></td></tr>`;
        });
        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;
    }

    function handleRouteChange() {
        const hash = window.location.hash;
        Object.values(views).forEach(view => { if (view) view.style.display = 'none'; });
        const user = firebase.auth().currentUser;
        if (hash.startsWith('#/docente/dashboard')) {
            if (user) { views.dashboard.style.display = 'block'; initializeDashboard(); } 
            else { window.location.hash = '#/docente/login'; }
        } else if (hash.startsWith('#/docente/login')) {
            views.login.style.display = 'block';
        } else if (hash.startsWith('#/studente/anno-1')) {
            views.questionnaire.style.display = 'block';
            initializeQuestionnaire();
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