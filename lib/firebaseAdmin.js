// Server-only Firebase Admin helper. Do not import from the client.
// This file intentionally uses guarded requires to avoid bundling Node core modules.

/** @type {import('firebase-admin/auth').Auth | null} */
let adminAuth = null;
/** @type {import('firebase-admin/firestore').Firestore | null} */
let adminFirestore = null;

if (typeof window === 'undefined') {
  const { initializeApp, cert, getApps } = require('firebase-admin/app');
  const { getAuth } = require('firebase-admin/auth');
  const { getFirestore } = require('firebase-admin/firestore');

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}';
  let serviceAccount = {};
  try {
    serviceAccount = JSON.parse(raw);
  } catch {
    serviceAccount = {};
  }

  const app = getApps().length
    ? getApps()[0]
    : initializeApp({ credential: cert(serviceAccount) });

  adminAuth = getAuth(app);
  adminFirestore = getFirestore(app);
}

module.exports = { adminAuth, adminFirestore };
