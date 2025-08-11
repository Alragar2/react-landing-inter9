# ⚡ SOLUCIÓN RÁPIDA - Firebase en Producción

## 🔴 PROBLEMA
- ✅ Funciona en localhost  
- ❌ No funciona en producción

## 🎯 CAUSA
**Variables de entorno de Firebase no configuradas en tu hosting**

## 🚀 SOLUCIÓN EN 3 PASOS

### PASO 1: Identifica tu plataforma de hosting
- 🔷 **Netlify** → Sigue PASO 2A
- 🔶 **Vercel** → Sigue PASO 2B  
- 🔸 **GitHub Pages** → Sigue PASO 2C
- 🔹 **Otro hosting** → Sigue PASO 2D

### PASO 2A: NETLIFY
1. Ve a [app.netlify.com](https://app.netlify.com)
2. Selecciona tu sitio
3. **Site settings** → **Environment variables**
4. **Add variable** para cada una:

```
VITE_FIREBASE_API_KEY → AIzaSyBzjI3Ii5n_U01sA836A4ZEWD0q7CXCcW4
VITE_FIREBASE_AUTH_DOMAIN → inter9-695eb.firebaseapp.com
VITE_FIREBASE_PROJECT_ID → inter9-695eb
VITE_FIREBASE_STORAGE_BUCKET → inter9-695eb.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID → 711524386120
VITE_FIREBASE_APP_ID → 1:711524386120:web:9c13d32ab03bae21bb5f7d
```

5. **Deploys** → **Trigger deploy** → **Deploy site**

### PASO 2B: VERCEL
1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. **Settings** → **Environment Variables**
4. **Add** para cada variable (usar las mismas de arriba)
5. **Deployments** → **Redeploy** último deployment

### PASO 2C: GITHUB PAGES
```bash
# En tu computadora:
# 1. Asegurar que .env tenga las variables correctas
# 2. Hacer build
npm run build

# 3. Subir carpeta dist/ a tu repositorio gh-pages
```

### PASO 2D: OTRO HOSTING
1. Crear archivo `.env` en el servidor con las variables
2. Subir archivo
3. Ejecutar en el servidor:
```bash
npm install
npm run build
```

### PASO 3: VERIFICAR
1. **Abre tu sitio en producción**
2. **Busca botón "🔧 Debug Firebase"** (esquina inferior izquierda)
3. **Todas las variables deben mostrar "SET"**

## 📱 VERIFICACIÓN MÓVIL
En el móvil, abre la consola del navegador:
```javascript
console.log(import.meta.env.VITE_FIREBASE_API_KEY ? 'Variables OK' : 'Variables MISSING');
```

## 🆘 SI NO FUNCIONA
1. **Revisa que variables empiecen con `VITE_`**
2. **Redespliega después de agregar variables**
3. **Verifica reglas de Firestore permitan escritura**
4. **Usa el debugger de producción para más detalles**

## ⏱️ TIEMPO: 10 minutos
