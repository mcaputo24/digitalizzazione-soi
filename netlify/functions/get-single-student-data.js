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
    const { studentId } = JSON.parse(event.body);
    const schoolId = process.env.SCHOOL_ID;

    if (!schoolId || !studentId) {
      throw new Error('ID scuola o studente mancante.');
    }

    const doc = await db.collection('scuole').doc(schoolId).collection('studenti').doc(studentId).get();

    if (!doc.exists) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Studente non trovato.' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ id: doc.id, ...doc.data() }) };

  } catch (error) {
    console.error('Errore nel recuperare i dati dello studente:', error);
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};