// Attende il caricamento completo della pagina
document.addEventListener('DOMContentLoaded', () => {
    // Inserisci questo codice dentro a: document.addEventListener('DOMContentLoaded', () => { ... });

const mappaContainer = document.getElementById('mappa-container');
const addMappaBtn = document.getElementById('add-mappa-block');
let mappaBlockCount = 0;

addMappaBtn.addEventListener('click', () => {
    mappaBlockCount++;
    const block = document.createElement('div');
    block.classList.add('mappa-block');
    block.innerHTML = `
        <h4>Descrizione #${mappaBlockCount}</h4>
        <div class="form-group">
            <label>Qualità/Aggettivo:</label>
            <input type="text" name="mappa_${mappaBlockCount}_aggettivo">
        </div>
        <div class="form-group">
            <label>Dove la usi di più?</label>
            <input type="text" name="mappa_${mappaBlockCount}_dove">
        </div>
        <div class="form-group">
            <label>In quale attività?</label>
            <input type="text" name="mappa_${mappaBlockCount}_attivita">
        </div>
        <div class="form-group">
            <label>Con chi?</label>
            <input type="text" name="mappa_${mappaBlockCount}_con_chi">
        </div>
    `;
    mappaContainer.appendChild(block);
});
    // Logica per aggiungere dinamicamente i blocchi della "Mappa di Sé"
    // ...

    const form = document.getElementById('soi-form');
    // Sostituisci il vecchio event listener del form con questo
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Salvataggio in corso...';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

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
            // Se c'è un errore, leggiamo il testo dell'errore dal server
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

    // Gestione del download PDF
    document.getElementById('download-pdf-btn').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        doc.setFontSize(22);
        doc.text('Riepilogo SOI', 10, 20);
        
        let y = 30; // Posizione verticale nel PDF
        for(const [key, value] of Object.entries(data)) {
            if (value) { // Aggiunge solo i campi compilati
                doc.setFontSize(12);
                doc.text(`${key}:`, 10, y);
                doc.setFontSize(10);
                doc.text(value, 50, y);
                y += 10;
            }
        }

        doc.save(`Riepilogo_SOI_${data.cognome}_${data.nome}.pdf`);
    });
});