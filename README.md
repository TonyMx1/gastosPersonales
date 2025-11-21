# Panel de Gastos Personales

Aplicación web full stack desarrollada con Next.js para registrar y visualizar gastos personales por categoría.

## Características

- ✅ Vista principal con tabla de gastos
- ✅ Formulario para registrar gastos (monto, categoría, fecha, descripción)
- ✅ Editar y eliminar gastos
- ✅ Resumen por categoría
- ✅ UI responsive con diseño limpio
- ✅ API CRUD con validación
- ✅ Gráfica de gastos por categoría
- ✅ Filtro por rango de fechas

## Tecnologías

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Firebase Firestore** - Base de datos en la nube
- **Tailwind CSS** - Estilos
- **Recharts** - Gráficas

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar Firebase:
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita Firestore Database
   - Obtén las credenciales de configuración
   - Crea un archivo `.env.local` en la raíz del proyecto con:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
   ```

3. Configurar reglas de seguridad de Firestore:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; // Cambiar según tus necesidades de seguridad
       }
     }
   }
   ```

4. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

5. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

**Nota:** Las categorías por defecto (Alimentación, Transporte, Entretenimiento, etc.) se inicializan automáticamente la primera vez que se carga la aplicación.

## Scripts

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run db:studio` - Abre Prisma Studio para gestionar la base de datos

