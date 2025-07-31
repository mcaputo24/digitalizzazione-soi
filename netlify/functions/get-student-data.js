const admin = require('firebase-admin');

try {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) {
  console.error('Errore di inizializzazione Firebase:', error);
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  const token = event.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ message: 'Autenticazione richiesta.' }) };
  }

  try {
    await admin.auth().verifyIdToken(token);
  } catch (error) {
    return { statusCode: 403, body: JSON.stringify({ message: 'Token non valido.' }) };
  }

  try {
    const schoolId = process.env.SCHOOL_ID;
    if (!schoolId) {
      throw new Error('SCHOOL_ID non impostato su Netlify.');
    }

    const snapshot = await db.collection('scuole').doc(schoolId).collection('studenti').orderBy('cognome').get();
    
    if (snapshot.empty) {
      // Se non ci sono studenti, restituisce array vuoti per entrambi
      return { statusCode: 200, body: JSON.stringify({ students: [], classes: [] }) };
    }

    const students = snapshot.docs.map(doc => ({
      id: doc.id,
      nome: doc.data().nome || '',
      cognome: doc.data().cognome || '',
      classe: doc.data().classe || '',
      data: doc.data().data || ''
    }));
    
    // --- NUOVA AGGIUNTA ---
    // Estrae la lista delle classi uniche dagli studenti trovati e la ordina
    const classes = [...new Set(students.map(s => s.classe).filter(Boolean))].sort();

    // Restituisce un oggetto contenente sia gli studenti che le classi
    return { statusCode: 200, body: JSON.stringify({ students, classes }) };

  } catch (error) {
    console.error('Errore nel recuperare i dati:', error);
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};