const admin = require('firebase-admin');
require('dotenv').config();

// Check if Firebase environment variables are set
const isFirebaseConfigured = process.env.FIREBASE_PROJECT_ID && 
                           process.env.FIREBASE_CLIENT_EMAIL && 
                           process.env.FIREBASE_PRIVATE_KEY;

let adminInstance = null;

if (isFirebaseConfigured) {
  try {
    // Initialize Firebase Admin with environment variables
    const serviceAccount = {
      "type": process.env.FIREBASE_TYPE || 'service_account',
      "project_id": process.env.FIREBASE_PROJECT_ID,
      "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
      "private_key": process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
      "client_email": process.env.FIREBASE_CLIENT_EMAIL,
      "client_id": process.env.FIREBASE_CLIENT_ID,
      "auth_uri": process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
      "token_uri": process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
      "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
      "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
    };

    // Initialize the app
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    
    adminInstance = admin;
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    // Create a mock admin object for development/testing
    adminInstance = {
      auth: () => ({
        verifyIdToken: async () => ({ uid: 'test-uid', email: 'test@example.com' }),
        getUser: async () => ({ uid: 'test-uid', email: 'test@example.com', displayName: 'Test User' })
      })
    };
    console.warn('Using mock Firebase Admin SDK for development');
  }
} else {
  console.warn('Firebase Admin SDK not configured. Using mock implementation for development.');
  // Create a mock admin object for development/testing
  adminInstance = {
    auth: () => ({
      verifyIdToken: async () => ({ uid: 'test-uid', email: 'test@example.com' }),
      getUser: async () => ({ uid: 'test-uid', email: 'test@example.com', displayName: 'Test User' })
    })
  };
}

module.exports = adminInstance;
