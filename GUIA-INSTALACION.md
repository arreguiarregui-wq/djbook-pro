# DJBook Pro — Guía de instalación paso a paso

## ¿Qué necesitas?
- Un ordenador con internet
- 30 minutos de tu tiempo
- Una tarjeta de débito/crédito (solo para Vercel — es gratis)

---

## PASO 1 — Instalar Node.js

Node.js es el motor que hace funcionar la app.

1. Ve a **https://nodejs.org**
2. Descarga la versión **LTS** (la recomendada)
3. Instálala como cualquier programa
4. Para verificar: abre la Terminal (Mac) o CMD (Windows) y escribe:
   ```
   node --version
   ```
   Debe salir algo como `v20.x.x`

---

## PASO 2 — Crear cuenta en Supabase (base de datos gratis)

1. Ve a **https://supabase.com** → "Start your project" → regístrate con GitHub o email
2. Crea un nuevo proyecto:
   - Name: `djbook-pro`
   - Database Password: guarda esta contraseña en algún lugar seguro
   - Region: elige la más cercana a España (EU West)
3. Espera ~2 minutos a que se cree el proyecto
4. Ve a **Settings → API** y copia:
   - `Project URL` → es tu `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Crear las tablas en Supabase:
1. En el panel de Supabase, ve a **SQL Editor** → "New query"
2. Abre el archivo `supabase-schema.sql` de este proyecto
3. Copia TODO el contenido y pégalo en el editor
4. Pulsa **Run** (o Ctrl+Enter)
5. Debe decir "Success"

---

## PASO 3 — Conseguir tu API Key de Anthropic (IA)

1. Ve a **https://console.anthropic.com**
2. Regístrate o inicia sesión
3. Ve a **API Keys** → "Create Key"
4. Copia la key que empieza por `sk-ant-...`
5. ⚠️ Guárdala bien, solo se muestra una vez

---

## PASO 4 — Configurar el proyecto

1. Descarga los archivos del proyecto en tu ordenador
2. Abre la carpeta `djbook-pro` en tu terminal
3. Copia el archivo de variables de entorno:
   ```
   cp .env.example .env.local
   ```
4. Abre `.env.local` con cualquier editor de texto (Notepad, TextEdit...)
5. Rellena los valores:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tuproject.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ANTHROPIC_API_KEY=sk-ant-...
   ```

---

## PASO 5 — Instalar y ejecutar en local

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
# Instalar dependencias (solo la primera vez)
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

Abre tu navegador en **http://localhost:3000**

¡Ya deberías ver la app funcionando! 🎉

---

## PASO 6 — Publicar en internet (Vercel)

Para que otros DJs puedan usar tu app:

1. Ve a **https://vercel.com** → regístrate con GitHub
2. Sube tu código a GitHub:
   ```bash
   git init
   git add .
   git commit -m "DJBook Pro inicial"
   gh repo create djbook-pro --public
   git push origin main
   ```
3. En Vercel → "New Project" → importa tu repo de GitHub
4. En **Environment Variables**, añade las mismas variables de `.env.local`
5. Pulsa **Deploy**

En ~2 minutos tendrás tu app en una URL tipo `https://djbook-pro.vercel.app`

---

## PASO 7 — Añadir tu primer usuario (tú mismo)

1. Ve a tu Supabase → **Authentication → Users**
2. Pulsa "Invite user" o configura el registro desde la app
3. ¡Listo!

---

## Estructura del proyecto

```
djbook-pro/
├── app/
│   ├── dashboard/page.tsx      → Dashboard principal
│   ├── bookings/page.tsx       → Lista de bookings
│   ├── negociador/page.tsx     → Calculadora de cachet
│   ├── research/page.tsx       → Investigación de venues
│   ├── marketing/page.tsx      → Generador de contenido IA
│   ├── chat/page.tsx           → Asistente IA
│   ├── perfil/page.tsx         → Perfil del DJ
│   └── api/ai/route.ts         → API de IA (backend)
├── components/
│   ├── layout/Sidebar.tsx      → Menú lateral
│   └── ui/                     → Componentes reutilizables
├── lib/
│   ├── supabase.ts             → Cliente de base de datos
│   └── cachet.ts               → Calculadora de precios
├── types/index.ts              → Tipos TypeScript
├── supabase-schema.sql         → Schema de la base de datos
└── .env.example                → Variables de entorno (plantilla)
```

---

## Próximos pasos (fase 2)

- [ ] Sistema de autenticación completo (login/registro)
- [ ] Conectar bookings reales a Supabase
- [ ] Añadir Stripe para pagos (plan Pro)
- [ ] Notificaciones por email (Resend)
- [ ] App móvil (React Native / Expo)

---

## ¿Problemas?

Los errores más comunes:

**"Module not found"** → Ejecuta `npm install` de nuevo

**"Invalid API key"** → Revisa que `.env.local` tenga las keys correctas sin espacios

**"Supabase error"** → Verifica que ejecutaste el schema SQL correctamente

**La app carga pero no guarda datos** → Revisa las variables de Supabase en `.env.local`
