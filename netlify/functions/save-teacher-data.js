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
    const decodedToken = await admin.auth().verifyIdToken(token);
    const teacherUid = decodedToken.uid;
    const schoolId = process.env.SCHOOL_ID;
    const { formType, studentId, data } = JSON.parse(event.body);

    if (!schoolId || !formType) {
      throw new Error('Dati insufficienti per il salvataggio.');
    }

    let docRef;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const dataToSave = { ...data, teacherUid, lastUpdated: timestamp };

    if (formType === 'fase1') {
      docRef = db.collection('scuole').doc(schoolId).collection('reports_classe').doc('fase1_osservazione');
      await docRef.set(dataToSave, { merge: true });
    } else if (formType === 'fase2' && studentId) {
      docRef = db.collection('scuole').doc(schoolId).collection('studenti').doc(studentId).collection('evaluations').doc('fase2_sintesi');
      await docRef.set(dataToSave);
    } else if (formType === 'fase3') {
      docRef = db.collection('scuole').doc(schoolId).collection('reports_classe').doc('fase3_sintesi');
      await docRef.set(dataToSave, { merge: true });
    } else {
      throw new Error('Tipo di modulo non valido o ID studente mancante.');
    }

    return { statusCode: 200, body: JSON.stringify({ message: 'Dati salvati con successo!' }) };

  } catch (error) {
    console.error('Errore nel salvataggio dei dati del conduttore:', error);
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};