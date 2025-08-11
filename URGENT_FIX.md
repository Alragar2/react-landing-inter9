# 🚨 SOLUCIÓN URGENTE - Variables Firebase en Producción

## ❌ ERROR DETECTADO
```
❌ [Firebase Config] Campos faltantes: ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
```

**CAUSA:** Tu hosting NO tiene configuradas las variables de entorno.

## 🎯 VARIABLES QUE NECESITAS CONFIGURAR

Estas son las 6 variables que DEBES agregar en tu hosting:

```
VITE_FIREBASE_API_KEY=AIzaSyBzjI3Ii5n_U01sA836A4ZEWD0q7CXCcW4
VITE_FIREBASE_AUTH_DOMAIN=inter9-695eb.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=inter9-695eb
VITE_FIREBASE_STORAGE_BUCKET=inter9-695eb.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=711524386120
VITE_FIREBASE_APP_ID=1:711524386120:web:9c13d32ab03bae21bb5f7d
```

## 🔷 SI USAS NETLIFY

1. **Ve a [app.netlify.com](https://app.netlify.com)**
2. **Selecciona tu sitio**
3. **Site settings** → **Environment variables**
4. **Haz clic en "Add variable"** para cada una:
   - Key: `VITE_FIREBASE_API_KEY`
   - Value: `AIzaSyBzjI3Ii5n_U01sA836A4ZEWD0q7CXCcW4`
   - Scopes: Todas las opciones marcadas
5. **Repite para las 6 variables**
6. **Deploys** → **Trigger deploy** → **Deploy site**

## 🔶 SI USAS VERCEL

1. **Ve a [vercel.com/dashboard](https://vercel.com/dashboard)**
2. **Selecciona tu proyecto**
3. **Settings** → **Environment Variables**
4. **Para cada variable:**
   - Name: `VITE_FIREBASE_API_KEY`
   - Value: `AIzaSyBzjI3Ii5n_U01sA836A4ZEWD0q7CXCcW4`
   - Environment: Production (marca la casilla)
5. **Save** después de cada variable
6. **Deployments** → **Redeploy** el último deployment

## 🔸 SI USAS GITHUB PAGES

GitHub Pages NO soporta variables de entorno. Tienes 2 opciones:

**Opción 1: Build local**
```bash
# En tu computadora (asegúrate de que .env esté correcto)
npm run build
# Sube la carpeta dist/ a tu repo gh-pages
```

**Opción 2: GitHub Actions**
1. Ve a tu repositorio → Settings → Secrets and variables → Actions
2. Agrega cada variable como secret
3. Modifica tu workflow para usar esas variables

## 🔹 SI USAS FIREBASE HOSTING

```bash
# En tu computadora
firebase functions:config:set firebase.api_key="AIzaSyBzjI3Ii5n_U01sA836A4ZEWD0q7CXCcW4"
# etc para cada variable
```

## ⚡ VERIFICACIÓN RÁPIDA

Después de configurar, ve a la consola de tu sitio en producción y ejecuta:

```javascript
console.log('Variables Firebase:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
});
```

Debería mostrar los valores, no `undefined`.

## 🆘 IMPORTANTE

- ✅ **Las variables DEBEN empezar con `VITE_`**
- ✅ **Se configuran en el HOSTING, no en el código**
- ✅ **Después de configurar, REDESPLIEGA tu sitio**
- ✅ **Pueden tardar 2-5 minutos en activarse**

---

**¿En qué plataforma tienes tu sitio? Te doy instrucciones más específicas.**
