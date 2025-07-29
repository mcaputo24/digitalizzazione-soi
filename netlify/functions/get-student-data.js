const admin = require('firebase-admin');

// Inizializza Firebase Admin (se non già fatto)
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
  // 1. Verifica che la richiesta provenga da un utente autenticato
  const token = event.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ message: 'Autenticazione richiesta.' }) };
  }

  try {
    // 2. Verifica la validità del token
    await admin.auth().verifyIdToken(token);
  } catch (error) {
    console.error('Errore di verifica token:', error);
    return { statusCode: 403, body: JSON.stringify({ message: 'Token non valido o scaduto.' }) };
  }

  // 3. Se il token è valido, recupera i dati degli studenti
  try {
    const schoolId = process.env.SCHOOL_ID;
    if (!schoolId) {
      throw new Error('SCHOOL_ID non impostato su Netlify.');
    }

    const snapshot = await db.collection('scuole').doc(schoolId).collection('studenti').get();
    
    if (snapshot.empty) {
      return { statusCode: 200, body: JSON.stringify([]) };
    }

    const students = snapshot.docs.map(doc => ({
      id: doc.id,
      nome: doc.data().nome,
      cognome: doc.data().cognome,
      classe: doc.data().classe,
      data: doc.data().data
    }));

    return { statusCode: 200, body: JSON.stringify(students) };

  } catch (error) {
    console.error('Errore nel recuperare i dati:', error);
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};