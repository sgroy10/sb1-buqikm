export function validateEnv() {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n` +
      'Please check your .env file and make sure all required variables are set.'
    );
  }
}