import * as admin from 'firebase-admin';

import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import dotenv from 'dotenv';

dotenv.config();

export const ADMIN_UID = process.env.ADMIN_UID ?? '';

const projectId = process.env.PROJECT_ID ?? '';
const clientEmail = process.env.CLIENT_EMAIL ?? '';
const privateKey = process.env.PRIVATE_KEY ?? '';

const serviceAccount: ServiceAccount = {
  projectId: projectId,
  clientEmail: clientEmail,
  privateKey: privateKey,
};

initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore();
export const auth = admin.auth()
