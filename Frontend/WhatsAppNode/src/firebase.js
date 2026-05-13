import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDuhqXJI9CtSaSYIYXvK-WsWUkU1TY8HSA',
  authDomain: 'whatsappnode-f49e1.firebaseapp.com',
  projectId: 'whatsappnode-f49e1',
  storageBucket: 'whatsappnode-f49e1.firebasestorage.app',
  messagingSenderId: '83790148707',
  appId: '1:83790148707:web:c98d0c8cd6b5b2d5017456',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
