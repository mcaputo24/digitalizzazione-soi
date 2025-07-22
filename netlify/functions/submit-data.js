const admin = require('firebase-admin');

try {
  // Leggiamo e interpretiamo le credenziali dalla singola variabile d'ambiente
  const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

  // Inizializziamo Firebase solo se non è già stato fatto
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) {
  console.error('Errore di inizializzazione Firebase:', error);
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  // Controlliamo che la richiesta sia un POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const schoolId = process.env.SCHOOL_ID;

    // Aggiungiamo un controllo per essere sicuri che SCHOOL_ID sia impostato
    if (!schoolId) {
      throw new Error('La variabile d\'ambiente SCHOOL_ID non è stata impostata su Netlify.');
    }
    
    // Scriviamo i dati su Firestore
    await db.collection('scuole').doc(schoolId).collection('studenti').add(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Dati salvati con successo' })
    };
  } catch (error) {
    // Logghiamo l'errore specifico per un debug più facile
    console.error('Errore nella funzione:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: error.message }) 
    };
  }
};