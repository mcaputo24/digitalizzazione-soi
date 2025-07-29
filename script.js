document.addEventListener('DOMContentLoaded', () => {

    // --- ROUTER: GESTIONE DELLE VISTE ---
    const views = {
        home: document.getElementById('home-view'),
        questionnaire: document.getElementById('questionnaire-view')
    };

    let isQuestionnaireInitialized = false; // Flag per inizializzare una sola volta

    // Questa funzione contiene TUTTA la logica del questionario
    function initializeQuestionnaire() {
        if (isQuestionnaireInitialized) return; // Se già inizializzato, non fare nulla

        // --- Inizializzazione Mappa Cytoscape ---
        const controlsContent = document.getElementById('controls-content');
        let selectedNode = null;
        const cy = cytoscape({
            container: document.getElementById('cy'),
            // ... (tutta la configurazione di cytoscape, la stessa di prima)
        });

        // --- Tutte le funzioni della mappa (renderBaseControls, deleteSelectedNode, etc.) ---
        // ... (il codice completo delle funzioni della mappa va qui)

        // --- Logica Scheda 3: Conteggio Automatico ---
        const scores = { gente: 0, dati: 0, idee: 0, cose: 0 };
        // ... (tutto il codice per i contatori va qui)

        // --- Gestione Invio Form e PDF ---
        const form = document.getElementById('soi-form');
        let savedData = {};
        form.addEventListener('submit', async (event) => {
            // ... (logica di invio form)
        });
        document.getElementById('download-pdf-btn').addEventListener('click', () => {
            // ... (logica di creazione PDF)
        });
        
        isQuestionnaireInitialized = true; // Imposta il flag a true
    }

    function handleRouteChange() {
        const hash = window.location.hash;
        Object.values(views).forEach(view => {
            if (view) view.style.display = 'none';
        });

        if (hash.startsWith('#/studente/anno-1')) {
            if (views.questionnaire) {
                views.questionnaire.style.display = 'block';
                initializeQuestionnaire(); // Inizializza la logica del questionario
            }
        } else {
            if (views.home) views.home.style.display = 'block';
        }
    }

    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();
});