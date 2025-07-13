// Attende il caricamento completo della pagina
document.addEventListener('DOMContentLoaded', () => {
    
    // Logica per aggiungere dinamicamente i blocchi della "Mappa di Sé"
    // ...

    const form = document.getElementById('soi-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impedisce l'invio tradizionale del form
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Invia i dati alla Netlify Function per salvarli su Firebase
        try {
            const response = await fetch('/.netlify/functions/submit-data', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Mostra la sezione di completamento e nasconde il form
                form.style.display = 'none';
                document.getElementById('completion-section').style.display = 'block';
            } else {
                alert('Si è verificato un errore durante il salvataggio.');
            }
        } catch (error) {
            console.error('Errore:', error);
            alert('Errore di connessione.');
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