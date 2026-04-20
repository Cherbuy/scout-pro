# ⚽ ScoutPro — Plataforma de Scouting

Aplicación web profesional de scouting de fútbol, mobile-first, construida con Next.js 14, TypeScript, Tailwind CSS y Supabase. 100% gratuita (sin hosting propio) usando el tier gratuito de Vercel + Supabase.

## 🚀 Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Estilos:** Tailwind CSS 4
- **Base de datos + Auth:** Supabase (PostgreSQL)
- **Gráficos:** Recharts (radar de métricas)
- **PDF:** jsPDF + html2canvas
- **Despliegue:** Vercel (Hobby Tier — gratis)

## 📋 Funcionalidades

- ✅ Autenticación por email/contraseña (Supabase Auth)
- ✅ Multi-tenancy con Row Level Security — cada analista ve solo sus datos
- ✅ Gestión de jugadores con **Perfil Geográfico**:
  - Demarcación principal y secundaria
  - Mapa de calor descriptivo (campo interactivo de 20 zonas)
  - Tendencias de movimiento sin balón
- ✅ Informes de scouting con:
  - Mapa SVG interactivo del campo (selector de zonas por clic)
  - Sistema de etiquetas/chips predefinidas (#RompeAlEspacio, #Falso9...)
  - Sliders para métricas técnica/física/táctica
  - Campo de conclusiones
- ✅ Visualizador de informe con gráfico de radar (Recharts)
- ✅ Exportación a PDF profesional
- ✅ Búsqueda avanzada (posición, pie, etiqueta, zona, valoración mínima)
- ✅ Diseño mobile-first para uso en la grada

## 🛠️ Instalación

### 1. Configura Supabase (gratis)

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto (elige región Europa si estás en España)
3. Ve a **SQL Editor** y ejecuta todo el contenido de `supabase-schema.sql`
4. En **Project Settings → API** copia:
   - `Project URL`
   - `anon public key`

### 2. Configura variables de entorno

Edita `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 3. Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 4. Despliegue en Vercel (gratis)

1. Sube el código a un repositorio de GitHub
2. Entra en [vercel.com](https://vercel.com) y conecta el repo
3. En **Environment Variables** añade las dos variables de Supabase
4. Deploy → tu app está online en `https://tu-app.vercel.app`

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── (auth)/                 # login, registro
│   ├── (dashboard)/            # rutas protegidas
│   │   ├── dashboard/          # resumen y estadísticas
│   │   ├── jugadores/          # CRUD jugadores + perfil geográfico
│   │   ├── informes/           # CRUD informes + PDF
│   │   └── busqueda/           # búsqueda avanzada
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── campo-svg.tsx           # Mapa SVG del campo (20 zonas)
│   ├── radar-chart.tsx         # Gráfico radar (Recharts)
│   ├── tags-input.tsx          # Chips con sugerencias
│   ├── metric-slider.tsx       # Sliders 1-10
│   ├── perfil-geografico.tsx   # Bloque de Perfil Geográfico
│   └── navbar.tsx              # Sidebar + topbar móvil
├── lib/
│   ├── supabase/{client,server}.ts
│   └── utils.ts
├── types/index.ts              # tipos + POSICIONES + ETIQUETAS
└── middleware.ts               # protección de rutas
```

## 🎨 Personalización

- **Etiquetas predefinidas:** edita `ETIQUETAS_PREDEFINIDAS` en `src/types/index.ts`
- **Posiciones:** edita `POSICIONES` en `src/types/index.ts`
- **Zonas del campo:** modifica `GRID_ROWS` y `GRID_COLS` en `src/components/campo-svg.tsx`

## 📱 Uso móvil

La app está optimizada para introducir informes desde el móvil en la grada:
- Formularios grandes, botones táctiles
- El mapa SVG responde al tap
- TagsInput con sugerencias rápidas

## 🔒 Privacidad y SaaS-ready

- Row Level Security activada en ambas tablas
- Cada email registrado tiene su espacio aislado
- Listo para monetizar como SaaS: solo falta añadir Stripe en el futuro
