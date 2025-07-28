document.addEventListener('DOMContentLoaded', () => {
    // Tutta la logica esistente per la mappa (Cytoscape)...
    // ... Lasciare invariato tutto il codice fino alla gestione del form ...

    // --- LOGICA SCHEDA 3: CONTEGGIO AUTOMATICO ---
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
            if (checkbox.checked) {
                scores[category]++;
            } else {
                scores[category]--;
            }
            scoreSpans[category].textContent = scores[category];
        });
    });

    // --- GESTIONE FORM (invariata) ---
    const form = document.getElementById('soi-form');
    // ... Lasciare invariato il resto del file da qui in poi ...
});