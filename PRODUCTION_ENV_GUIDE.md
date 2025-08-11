# 🚀 GUÍA ESPECÍFICA: Variables de Entorno en Producción

## 🎯 PROBLEMA IDENTIFICADO
✅ **Funciona en localhost**  
❌ **No funciona en producción**

**CAUSA:** Las variables de entorno de Firebase NO están configuradas en tu plataforma de hosting.

## 📋 VARIABLES NECESARIAS

Necesitas configurar estas 6 variables en tu hosting:

```
VITE_FIREBASE_API_KEY=AIzaSyBzjI3Ii5n_U01sA836A4ZEWD0q7CXCcW4
VITE_FIREBASE_AUTH_DOMAIN=inter9-695eb.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=inter9-695eb
VITE_FIREBASE_STORAGE_BUCKET=inter9-695eb.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=711524386120
VITE_FIREBASE_APP_ID=1:711524386120:web:9c13d32ab03bae21bb5f7d
```

## 🌐 CONFIGURACIÓN POR PLATAFORMA

### 🔷 NETLIFY

1. **Ve a tu dashboard de Netlify**
2. **Selecciona tu sitio**
3. **Ve a Site settings**
4. **Haz clic en "Environment variables"**
5. **Para cada variable, haz clic en "Add variable":**
   - **Key:** `VITE_FIREBASE_API_KEY`
   - **Value:** `AIzaSyBzjI3Ii5n_U01sA836A4ZEWD0q7CXCcW4`
   - **Scope:** Todas las páginas
6. **Repite para las 6 variables**
7. **Redespliega tu sitio:**
   - Ve a Deploys
   - Haz clic en "Trigger deploy" → "Deploy site"

### 🔶 VERCEL

1. **Ve a tu dashboard de Vercel**
2. **Selecciona tu proyecto**
3. **Ve a Settings**
4. **Haz clic en "Environment Variables"**
5. **Para cada variable:**
   - **Name:** `VITE_FIREBASE_API_KEY`
   - **Value:** `AIzaSyBzjI3Ii5n_U01sA836A4ZEWD0q7CXCcW4`
   - **Environment:** Production (y Development si quieres)
6. **Haz clic en "Save"**
7. **Repite para las 6 variables**
8. **Redespliega:**
   - Ve a Deployments
   - Haz clic en "Redeploy" en el último deployment

### 🔸 GITHUB PAGES

GitHub Pages no soporta variables de entorno en tiempo de ejecución. Opciones:

**Opción 1: Build local y subir**
```bash
# 1. Asegurar que .env esté correcto
# 2. Hacer build local
npm run build

# 3. Subir carpeta dist/ a tu repositorio gh-pages
```

**Opción 2: Usar GitHub Actions**
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
```

### 🔹 OTROS HOSTINGS (cPanel, Shared Hosting)

1. **Crear archivo `.env` en el servidor**
2. **Subir archivo con las variables**
3. **Hacer build EN EL SERVIDOR:**
```bash
npm install
npm run build
```

## 🔍 VERIFICACIÓN

Después de configurar las variables:

1. **Redespliega tu sitio**
2. **Abre tu sitio en producción**
3. **Busca el botón "🔧 Debug Firebase"** (esquina inferior izquierda)
4. **Haz clic y verifica que todas las variables muestren "SET"**

## ⚠️ PUNTOS IMPORTANTES

- ✅ **Deben empezar con `VITE_`** (requerimiento de Vite)
- ✅ **No son secretos** (se incrustan en el build público)
- ✅ **Se configuran en la plataforma de hosting, no en el código**
- ✅ **Requieren redespliegue después de configurar**

## 📞 VERIFICACIÓN RÁPIDA

Abre la consola del navegador en producción y ejecuta:

```javascript
console.log('Firebase Config Check:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ SET' : '❌ MISSING',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ SET' : '❌ MISSING'
});
```

## 🎯 CASOS ESPECIALES

### Si usas un dominio personalizado:
1. **Ve a Firebase Console → Authentication → Settings**
2. **En "Authorized domains" agrega tu dominio**

### Si el error persiste:
1. **Verifica que las reglas de Firestore permitan escritura**
2. **Comprueba la consola del navegador para errores específicos**
3. **Usa el componente ProductionDebugger para diagnóstico completo**

## ⏱️ TIEMPO ESTIMADO

- **Configurar variables:** 5-10 minutos
- **Redespliegue:** 2-5 minutos
- **Verificación:** 1 minuto

**Total: 10-15 minutos**
