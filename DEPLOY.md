# 🚀 Guía de Deployment - Realta 2.0

## Pre-requisitos

1. ✅ **Proyecto construye sin errores** - `npm run build`
2. ✅ **Cuenta en Vercel** - [vercel.com](https://vercel.com)
3. ✅ **Cuenta en Supabase** - [supabase.com](https://supabase.com)  
4. ✅ **Repositorio en GitHub** (recomendado)

## 🎯 Deployment Rápido en Vercel

### Opción 1: CLI (Más Rápido)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login en Vercel
vercel login

# 3. Deploy desde el directorio my-app
cd my-app
vercel

# 4. Seguir el wizard:
# - Set up and deploy? Yes
# - Which scope? Tu cuenta
# - Link to existing project? No
# - Project name? realta-2-0
# - Directory? ./
# - Override settings? No
```

### Opción 2: GitHub Integration (Recomendado)

1. **Subir a GitHub**
```bash
git init
git add .
git commit -m "🚀 Initial Realta 2.0 deployment"
git branch -M main
git remote add origin https://github.com/tu-usuario/realta-2-0.git
git push -u origin main
```

2. **Conectar con Vercel**
   - Ir a [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from GitHub
   - Seleccionar repositorio `realta-2-0`
   - **Root Directory**: `my-app` ⚠️ IMPORTANTE
   - Click "Deploy"

## ⚙️ Variables de Entorno en Vercel

En Vercel Dashboard → Project → Settings → Environment Variables:

### 🔴 OBLIGATORIAS (Supabase):
```
NEXT_PUBLIC_SUPABASE_URL=https://phakfnedzdxpybictlmv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_real
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_real
```

### 🟡 OPCIONALES (Stripe):
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_tu_key
STRIPE_SECRET_KEY=sk_live_tu_key
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook
```

### 🟢 ADICIONALES:
```
NEXTAUTH_SECRET=genera_un_secret_aleatorio_32_chars
NEXTAUTH_URL=https://tu-proyecto.vercel.app
NEXT_PUBLIC_APP_URL=https://tu-proyecto.vercel.app
OPEN_EXCHANGE_RATES_API_KEY=tu_api_key
```

## 🗄️ Configuración de Supabase

1. **Crear Proyecto** en [supabase.com](https://supabase.com)
2. **Ejecutar Scripts SQL** (en orden):
```sql
-- En Supabase SQL Editor
-- Ejecutar archivos en /scripts/ uno por uno
01-initial-schema.sql
02-seed-sample-data.sql  
03-setup-rls.sql
04-guatemala-data.sql
-- etc...
```

3. **Obtener Credenciales**:
   - Settings → API → Project URL y anon key
   - Settings → API → service_role key (mantener privada)

## 🔐 Configuración de Seguridad

### RLS Policies (Row Level Security)
```sql
-- Ejecutar en Supabase SQL Editor
-- Ver archivo 03-setup-rls.sql para policies completas
```

### Dominios Permitidos
En Supabase → Authentication → URL Configuration:
- Site URL: `https://tu-proyecto.vercel.app`
- Redirect URLs: `https://tu-proyecto.vercel.app/**`

## 🎨 Dominio Personalizado (Opcional)

1. **En Vercel Dashboard** → Project → Settings → Domains
2. **Agregar dominio**: `tudominio.com`
3. **Configurar DNS** según instrucciones de Vercel

## 🚨 Troubleshooting

### Build Fails
```bash
# Verificar localmente
npm run build

# Si falla, revisar:
# - Imports incorrectos
# - Variables de entorno faltantes
# - TypeScript errors
```

### 500 Error en Producción
- Verificar variables de entorno en Vercel
- Revisar logs en Vercel Dashboard → Functions
- Verificar conexión a Supabase

### Supabase Connection Issues
- Verificar URL y keys en variables de entorno
- Verificar que RLS está configurado correctamente
- Verificar que el usuario tiene permisos

## 📊 Post-Deployment Checklist

- [ ] ✅ App carga correctamente
- [ ] ✅ Registro de usuarios funciona
- [ ] ✅ Login/logout funciona  
- [ ] ✅ Listado de propiedades carga
- [ ] ✅ Filtros de búsqueda funcionan
- [ ] ✅ Cambio de moneda funciona
- [ ] ✅ Responsive design en móvil
- [ ] ✅ SEO meta tags correctos

## 🔄 CI/CD Automático

Con GitHub integration, cada push a `main` deployará automáticamente.

Para branches de desarrollo:
```bash
git checkout -b feature/nueva-funcionalidad
# ... hacer cambios
git push origin feature/nueva-funcionalidad
# Vercel creará preview deployment automáticamente
```

## 📱 PWA (Opcional)

Para convertir en PWA, agregar:
- `next-pwa` package
- `manifest.json`
- Service worker

---

## 🆘 Soporte

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

---

**¡Tu app Realta 2.0 estará live en minutos! 🎉**