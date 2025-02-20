import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBcbmNOgqipZkPPddrAFLddJXAJAsjcPe8',
  authDomain: 'mankora-26976.firebaseapp.com',
  projectId: 'mankora-26976',
  storageBucket: 'mankora-26976.appspot.com',
  messagingSenderId: '86247439071',
  appId: '1:86247439071:web:edf43beae6dc554ea0c76a',
  measurementId: 'G-D0M2H3TXSF',
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
