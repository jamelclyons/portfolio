import type { FirebaseApp } from 'firebase/app';
import { initializeApp } from 'firebase/app';

import type { Auth } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

import type { Firestore } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

import { firebaseConfig } from '@/services/Config';

const app: FirebaseApp = initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);