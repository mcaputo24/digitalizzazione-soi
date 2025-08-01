const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
}

exports.handler = async (event, context) => {
    try {
        const token = event.headers.authorization?.split('Bearer ')[1];
        if (!token) throw new Error("Token mancante");

        const decodedToken = await admin.auth().verifyIdToken(token);

        const scuolaId = "DON_TONINO_BELLO_TRICASE"; // eventualmente rendilo dinamico
        const snapshot = await admin.firestore()
            .collection('scuole')
            .doc(scuolaId)
            .collection('studenti')
            .get();

        const classiSet = new Set();

        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.classe) {
                classiSet.add(data.classe);
            }
        });

        const classi = Array.from(classiSet).sort();

        return {
            statusCode: 200,
            body: JSON.stringify(classi)
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Errore nel recupero delle classi' })
        };
    }
};
