# 🔥 DIAGNÓSTICO SIMPLE

## ✅ PROBLEMA IDENTIFICADO
Tu error en producción es exactamente este:
```
❌ [Firebase Config] Campos faltantes: ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
```

## 🎯 SOLUCIÓN EN 3 PASOS

### PASO 1: Identifica tu hosting
**¿Dónde está tu sitio desplegado?**
- ¿La URL termina en `.netlify.app`? → Es Netlify
- ¿La URL termina en `.vercel.app`? → Es Vercel  
- ¿La URL termina en `.github.io`? → Es GitHub Pages
- ¿Otro? → Dime cuál es

### PASO 2: Configura las variables según tu hosting

**Para NETLIFY:**
1. Ve a [app.netlify.com](https://app.netlify.com)
2. Tu sitio → Site settings → Environment variables
3. Add variable (hacer 6 veces):

```
VITE_FIREBASE_API_KEY = AIzaSyBzjI3Ii5n_U01sA836A4ZEWD0q7CXCcW4
VITE_FIREBASE_AUTH_DOMAIN = inter9-695eb.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = inter9-695eb
VITE_FIREBASE_STORAGE_BUCKET = inter9-695eb.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 711524386120
VITE_FIREBASE_APP_ID = 1:711524386120:web:9c13d32ab03bae21bb5f7d
```

**Para VERCEL:**
1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Tu proyecto → Settings → Environment Variables
3. Add (hacer 6 veces con las mismas variables de arriba)

**Para GITHUB PAGES:**
1. No soporta variables de entorno
2. Debes hacer `npm run build` local y subir dist/

### PASO 3: Redespliega
- **Netlify:** Deploys → Trigger deploy
- **Vercel:** Deployments → Redeploy
- **Otros:** Vuelve a subir tu código

## ⏱️ TIEMPO: 5-10 minutos

## 🔍 VERIFICACIÓN
Después de configurar, abre tu sitio y ve si ya no aparece el error en la consola.

---

**¿En qué plataforma tienes tu sitio? Te ayudo con pasos más específicos.**
