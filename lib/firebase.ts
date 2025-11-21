import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'

// Validar que las variables de entorno estén configuradas
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
]

const missingVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
)

if (missingVars.length > 0 && typeof window === 'undefined') {
  console.warn('⚠️ Variables de entorno de Firebase faltantes:', missingVars.join(', '))
}

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validar configuración
if (!firebaseConfig.projectId) {
  throw new Error(
    'Firebase no está configurado correctamente. Por favor, verifica tu archivo .env.local'
  )
}

// Inicializar Firebase solo una vez (patrón singleton)
let app: FirebaseApp
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Exportar instancias de servicios
export const db: Firestore = getFirestore(app)
export const auth: Auth = getAuth(app)
export default app

