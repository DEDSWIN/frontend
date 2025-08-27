import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

const app = !getApps().length
  ? initializeApp({ credential: cert(serviceAccount) })
  : getApps()[0];

export const adminAuth = getAuth(app);
export const adminFirestore = getFirestore(app)