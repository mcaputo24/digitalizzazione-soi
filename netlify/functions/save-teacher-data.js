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

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = event.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Autenticazione richiesta.' })
    };
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const teacherUid = decodedToken.uid;
    const schoolId = process.env.SCHOOL_ID;
    const { formType, contextId, data } = JSON.parse(event.body);

    if (!schoolId || !formType || !contextId || !data) {
      throw new Error('Dati insufficienti per il salvataggio.');
    }

    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const dataToSave = { ...data, teacherUid, lastUpdated: timestamp };

    const docRef = db
      .collection('scuole')
      .doc(schoolId)
      .collection('teacherData')
      .doc(contextId);

    await docRef.set({ [formType]: dataToSave }, { merge: true });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Dati salvati con successo!' })
    };

  } catch (error) {
    console.error('Errore nel salvataggio dei dati del conduttore:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  }
};
