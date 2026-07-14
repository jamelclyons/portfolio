import { setEnvVariables as setComEnvVariables } from '@the7ofdiamonds/communications';
import { setEnvVariables as setGatewayVariables } from '@the7ofdiamonds/gateway';
import { setEnvVariables as setGitPortVariables } from '@the7ofdiamonds/portfolio';

const requiredEnv: readonly string[] = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID',
] as const;

requiredEnv.forEach((key) => {
  if (!import.meta.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
const gitlabToken = import.meta.env.VITE_GITLAB_TOKEN;

if (!githubToken && !gitlabToken) {
  throw new Error('Missing environment variable: Provide either VITE_GITHUB_TOKEN or VITE_GITLAB_TOKEN');
}

const gitlabAPI = import.meta.env.VITE_GITLAB_API;

if (gitlabToken && !gitlabAPI) {
  throw new Error('VITE_GITLAB_API is required when using VITE_GITLAB_TOKEN');
}

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const initializeConfig = () => {
  setGatewayVariables(import.meta.env);
  setGitPortVariables(import.meta.env)
  setComEnvVariables(import.meta.env)
};