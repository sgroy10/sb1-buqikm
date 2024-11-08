import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function initializeFirestore() {
  try {
    // Create collections with a dummy document (required for indexes)
    const collections = ['users', 'connections', 'projects'];
    
    for (const collectionName of collections) {
      const collRef = collection(db, collectionName);
      const dummyDoc = doc(collRef, 'init');
      
      // Create dummy document with minimal data
      await setDoc(dummyDoc, {
        _init: true,
        createdAt: new Date(),
      }, { merge: true });
    }

    console.log('Firestore collections initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    return false;
  }
}