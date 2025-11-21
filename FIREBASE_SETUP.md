# Configuración de Firebase - Solución de Problemas

## Error: NOT_FOUND (Código 5)

Este error generalmente indica que **Firestore no está habilitado** en tu proyecto de Firebase.

### Pasos para solucionar:

1. **Habilitar Firestore Database:**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Selecciona tu proyecto
   - En el menú lateral, ve a **Firestore Database**
   - Si no está habilitado, haz clic en **"Crear base de datos"**
   - Selecciona **"Comenzar en modo de prueba"** (para desarrollo)
   - Elige una ubicación para tu base de datos

2. **Verificar las Reglas de Seguridad:**
   - En Firestore Database, ve a la pestaña **"Reglas"**
   - Asegúrate de que las reglas permitan lectura y escritura:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; // Solo para desarrollo
       }
     }
   }
   ```
   - Haz clic en **"Publicar"**

3. **Verificar las Variables de Entorno:**
   - Asegúrate de que tu archivo `.env.local` tenga todas las variables:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
   ```
   - **Importante:** Reinicia el servidor de desarrollo después de cambiar las variables de entorno

4. **Obtener las Credenciales:**
   - En Firebase Console, ve a **Configuración del proyecto** (ícono de engranaje)
   - Baja hasta **"Tus aplicaciones"**
   - Si no tienes una app web, haz clic en **"</>"** para agregar una
   - Copia las credenciales y pégalas en tu `.env.local`

5. **Verificar el Project ID:**
   - Asegúrate de que `NEXT_PUBLIC_FIREBASE_PROJECT_ID` coincida exactamente con el ID de tu proyecto en Firebase Console

### Verificación Rápida:

1. ¿Firestore está habilitado en Firebase Console? ✅
2. ¿Las reglas de seguridad permiten escritura? ✅
3. ¿Todas las variables de entorno están configuradas? ✅
4. ¿Reiniciaste el servidor después de configurar `.env.local`? ✅
5. ¿El Project ID coincide exactamente? ✅

### Si el problema persiste:

- Verifica la consola del navegador para más detalles del error
- Revisa los logs del servidor de Next.js
- Asegúrate de que no haya errores de red en la pestaña Network del navegador

