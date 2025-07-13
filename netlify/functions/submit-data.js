// Richiede le credenziali Firebase dalle variabili d'ambiente di Netlify
const admin = require('firebase-admin');

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  // ... altre credenziali
};

// Inizializza Firebase solo una volta
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);
    const schoolId = process.env.SCHOOL_ID; // ID univoco della scuola!

    // Salva i dati in Firestore nella collection della scuola specifica
    await db.collection('scuole').doc(schoolId).collection('studenti').add(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Dati salvati con successo" })
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};