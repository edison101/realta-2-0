# 🏡 Realta 2.0 - Plataforma Inmobiliaria Global

Una plataforma moderna para alquiler de propiedades en Latinoamérica, desarrollada con Next.js 14, TypeScript, Supabase y Stripe.

## ✨ Características Principales

- 🔐 **Autenticación completa** con Supabase
- 🏠 **Gestión de propiedades** con filtros avanzados
- 💳 **Pagos seguros** con Stripe
- 💬 **Chat en tiempo real** entre propietarios e inquilinos
- 📱 **Responsive design** para móviles y desktop
- 🌍 **Multi-moneda** para mercados latinoamericanos
- 📄 **Contratos digitales** y aplicaciones de renta
- ⭐ **Sistema de reseñas** y calificaciones
- 🔔 **Notificaciones** en tiempo real

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase
- Cuenta en Stripe (opcional)

### Instalación

1. **Clona el repositorio**
```bash
git clone <repository-url>
cd realta-2.0
```

2. **Instala dependencias**
```bash
npm install
```

3. **Configura variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
- Supabase URL y keys
- Stripe keys (opcional)
- Otras configuraciones

4. **Ejecuta la aplicación**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🛠 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: Radix UI
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Pagos**: Stripe
- **Iconos**: Lucide React
- **Internacionalización**: next-intl

## 🌐 Deployment

### Vercel (Recomendado)

1. **Conecta con GitHub**
2. **Importa el proyecto** en Vercel
3. **Configura variables de entorno** en Vercel dashboard
4. **Deploy automático** en cada push

### Variables de entorno requeridas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (opcional)
- `STRIPE_SECRET_KEY` (opcional)

## 📋 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linting
```

## 🗄 Base de Datos

Los scripts SQL están en `/scripts/`. Ejecutar en orden:

1. `01-initial-schema.sql` - Schema inicial
2. `02-seed-sample-data.sql` - Datos de prueba
3. `03-setup-rls.sql` - Row Level Security
4. `04-guatemala-data.sql` - Datos específicos
5. Y así sucesivamente...

## 🔧 Configuración

### Supabase Setup

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar scripts SQL
3. Configurar RLS policies
4. Obtener credenciales

### Stripe Setup (Opcional)

1. Crear cuenta en [Stripe](https://stripe.com)
2. Obtener API keys
3. Configurar webhooks
4. Configurar productos/precios

## 📝 Licencia

Este proyecto está licenciado bajo la licencia MIT.

---

**¡Desarrollado con ❤️ para el mercado inmobiliario latinoamericano!**
