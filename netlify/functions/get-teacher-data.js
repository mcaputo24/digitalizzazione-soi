const admin = require('firebase-admin');

try {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) { console.error('Errore di inizializzazione Firebase:', error); }

const db = admin.firestore();

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = event.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ message: 'Autenticazione richiesta.' }) };
  }

  try {
    await admin.auth().verifyIdToken(token);
    const schoolId = process.env.SCHOOL_ID;
    const { formType, studentId, classe } = JSON.parse(event.body);

    if (!schoolId || !formType) {
      throw new Error('Dati insufficienti per il recupero.');
    }

    let docRef;
    if (formType === 'fase1' && classe) {
      docRef = db.collection('scuole').doc(schoolId).collection('reports_classe').doc(`fase1_${classe}`);
    } else if (formType === 'fase2' && studentId) {
      docRef = db.collection('scuole').doc(schoolId).collection('studenti').doc(studentId).collection('evaluations').doc('fase2_sintesi');
    } else if (formType === 'fase3' && classe) {
      docRef = db.collection('scuole').doc(schoolId).collection('reports_classe').doc(`fase3_${classe}`);
    } else {
      throw new Error('Tipo di modulo non valido o dati mancanti.');
    }

    const doc = await docRef.get();

    if (!doc.exists) {
      return { statusCode: 200, body: JSON.stringify({ data: {} }) }; // Restituisce un oggetto vuoto se non ci sono dati
    }

    return { statusCode: 200, body: JSON.stringify({ data: doc.data() }) };

  } catch (error) {
    console.error('Errore nel recupero dei dati del conduttore:', error);
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};