const admin = require('firebase-admin');
if (!admin.apps.length) {
  const svc = JSON.parse(process.env.FIREBASE_CREDENTIALS);
  admin.initializeApp({ credential: admin.credential.cert(svc) });
}
const db = admin.firestore();

exports.handler = async (event) => {
  const token = event.headers.authorization?.split('Bearer ')[1];
  if (!token) return { statusCode: 401, body: '' };
  try { await admin.auth().verifyIdToken(token); }
  catch { return { statusCode: 403, body: '' }; }

  const { studentId, formType } = JSON.parse(event.body);
  // supponiamo di salvare in: scuole/{schoolId}/teacherData/{studentId}/[fase1,fase2,fase3]
  const schoolId = process.env.SCHOOL_ID;
  const docRef  = db
    .collection('scuole').doc(schoolId)
    .collection('teacherData').doc(studentId);
  const snap = await docRef.get();
  const data = snap.exists ? (snap.data()[formType]||{}) : {};
  return {
    statusCode: 200,
    body: JSON.stringify({ data })
  };
};
