# 🚨 SOLUCIÓN ERROR 400 FIRESTORE

## Error Identificado
```
GET https://firestore.googleapis.com/google.firestore.v1.Firestore/Write/channel...&t=1 400 (Bad Request)
```

Este error indica que **las reglas de Firestore están bloqueando las operaciones de escritura**.

## 🔧 SOLUCIÓN INMEDIATA

### Paso 1: Ir a Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **inter9-695eb**
3. Ve a **Firestore Database**
4. Haz clic en la pestaña **"Rules"**

### Paso 2: Reemplazar las Reglas Actuales

**Reemplaza el contenido completo con estas reglas temporales:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir todas las operaciones temporalmente para testing
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Paso 3: Publicar las Reglas
1. Haz clic en **"Publish"**
2. Confirma la publicación

## ⚡ VERIFICACIÓN RÁPIDA

Después de cambiar las reglas, prueba:

1. **Abre tu aplicación local** (http://localhost:5174)
2. **Abre el formulario de inscripción**
3. **Llena y envía el formulario**
4. **Verifica en la consola** que no aparezcan errores 400

## 🔒 REGLAS DE PRODUCCIÓN (DESPUÉS DEL TEST)

Una vez que confirmes que funciona, cambia a reglas más seguras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo permitir crear inscripciones
    match /inscripciones/{document} {
      allow create: if true;
      allow read: if false;
      allow update, delete: if false;
    }
    
    // Colección de prueba (opcional, eliminar después)
    match /test/{document} {
      allow read, write: if true;
    }
  }
}
```

## 🎯 OTRAS VERIFICACIONES

Si el error persiste después de cambiar las reglas:

### 1. Verificar Proyecto ID
- Asegúrate que en `.env` tienes: `VITE_FIREBASE_PROJECT_ID=inter9-695eb`

### 2. Verificar Dominio Autorizado
1. En Firebase Console > Authentication > Settings
2. En "Authorized domains" debe estar:
   - `localhost` (para desarrollo)
   - Tu dominio de producción

### 3. Verificar API Key
- La API Key debe empezar con `AIza...`
- Debe ser la API Key de **Web** (no Android/iOS)

## 🔍 DIAGNÓSTICO AUTOMÁTICO

El panel de debug en tu aplicación ahora incluye:
- ✅/❌ Estado de conexión a Firestore
- ✅/❌ Permisos de lectura y escritura
- Mensajes específicos de error

## 📞 Si Nada Funciona

Envía una captura de pantalla de:
1. Las reglas actuales en Firebase Console
2. El panel de debug de tu aplicación
3. La consola del navegador con el error completo

## ⏱️ TIEMPO ESTIMADO DE SOLUCIÓN

- **Cambiar reglas**: 2 minutos
- **Propagar cambios**: 1-2 minutos
- **Verificar funcionamiento**: 1 minuto

**Total: ~5 minutos**
