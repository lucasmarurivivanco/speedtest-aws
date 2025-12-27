speedtest-aws/
│
├── 📄 README.md                    # Documentación principal
├── 📄 QUICKSTART.md                # Guía rápida de inicio
├── 📄 DEPLOYMENT.md                # Guía detallada de despliegue
├── 📄 TESTING.md                   # Guía de testing
├── 📄 EXAMPLES.md                  # Configuraciones de ejemplo
├── 📄 package.json                 # Dependencias root
├── 📄 docker-compose.yml           # Docker Compose config
├── 📄 .gitignore                   # Git ignore rules
├── 🔧 deploy.sh                    # Script de despliegue automático
│
├── 📁 frontend/                    # Frontend Next.js + React
│   ├── 📄 package.json             # Dependencias frontend
│   ├── 📄 Dockerfile               # Docker config frontend
│   ├── 📄 next.config.js           # Next.js config
│   ├── 📄 tailwind.config.js       # Tailwind CSS config
│   ├── 📄 postcss.config.js        # PostCSS config
│   ├── 📄 .env.local.example       # Variables de entorno ejemplo
│   │
│   ├── 📁 src/
│   │   ├── 📁 app/                 # Next.js App Router
│   │   │   ├── 📄 layout.js        # Layout principal
│   │   │   ├── 📄 page.js          # Página principal
│   │   │   └── 📄 globals.css      # Estilos globales
│   │   │
│   │   ├── 📁 components/          # Componentes React
│   │   │   ├── 📄 Header.js        # Header con branding
│   │   │   ├── 📄 Footer.js        # Footer
│   │   │   ├── 📄 SpeedTestDashboard.js    # Dashboard principal
│   │   │   ├── 📄 TestConfiguration.js     # Config de pruebas
│   │   │   ├── 📄 ResultsDisplay.js        # Display de resultados
│   │   │   └── 📄 ComparisonChart.js       # Gráficos comparativos
│   │   │
│   │   └── 📁 lib/                 # Utilidades
│   │       └── 📄 testRunner.js    # Lógica de ejecución de tests
│   │
│   └── 📁 public/                  # Archivos estáticos
│       ├── 📄 logo.svg             # Logo de la app
│       ├── 📄 favicon.svg          # Favicon
│       └── 📄 manifest.json        # PWA manifest
│
└── 📁 backend/                     # Backend Node.js + Express
    ├── 📄 package.json             # Dependencias backend
    ├── 📄 Dockerfile               # Docker config backend
    ├── 📄 .env.example             # Variables de entorno ejemplo
    │
    ├── 📁 src/
    │   ├── 📄 index.js             # Entry point del servidor
    │   └── 📁 routes/
    │       └── 📄 testRoutes.js    # Rutas de API de tests
    │
    └── 📁 test-data/               # Directorio para archivos temporales
        └── 📄 .gitkeep             # Mantener directorio en git

---

## 🎨 Stack Tecnológico

### Frontend
- ⚛️  React 18
- ⚡  Next.js 14 (App Router)
- 🎨 Tailwind CSS
- 📊 Chart.js + react-chartjs-2
- 🔥 Lucide React (iconos)
- 📡 Axios (HTTP client)

### Backend
- 🟢 Node.js 18+
- 🚀 Express.js
- 🔄 CORS
- 📦 Compression

### DevOps
- 🐳 Docker
- 🐙 Docker Compose
- ☁️  AWS EC2
- 🔒 Security Groups

---

## 📦 Archivos Principales

### Configuración
- `docker-compose.yml` - Orquestación de contenedores
- `tailwind.config.js` - Configuración de Tailwind
- `next.config.js` - Configuración de Next.js

### Componentes Clave
- `SpeedTestDashboard.js` - Dashboard principal con toda la lógica
- `TestConfiguration.js` - Configuración de URLs y parámetros
- `ResultsDisplay.js` - Visualización de resultados detallados
- `ComparisonChart.js` - Gráficos comparativos

### Backend
- `index.js` - Servidor Express con middleware
- `testRoutes.js` - Endpoints de API (ping, io, processing, database)

### Utilidades
- `testRunner.js` - Ejecución de tests y cálculo de métricas
- `deploy.sh` - Script de despliegue automático

---

## 🚀 Endpoints de API

### Health & Info
- `GET /api/health` - Health check
- `GET /api/info` - Información del servidor

### Tests
- `GET /api/test/ping` - Test de latencia simple
- `POST /api/test/io` - Test de I/O de archivos
- `POST /api/test/processing` - Test de procesamiento
- `POST /api/test/database` - Test de base de datos
- `POST /api/test/batch` - Batch de múltiples tests

---

## 🎯 Características Implementadas

### ✅ Frontend
- [x] Interfaz moderna y responsiva
- [x] Diseño con gradientes y efectos visuales
- [x] Configuración de 2 servidores
- [x] 4 tipos de tests disponibles
- [x] Selección de cantidad de requests
- [x] Barra de progreso en tiempo real
- [x] Gráficos comparativos (Chart.js)
- [x] Métricas detalladas (avg, min, max, p50, p95, p99)
- [x] Indicador de ganador
- [x] Diseño mobile-first
- [x] Dark theme con colores tecnológicos

### ✅ Backend
- [x] API REST con Express
- [x] Test de latencia (ping)
- [x] Test de I/O (lectura/escritura)
- [x] Test de procesamiento (simula imágenes)
- [x] Test de base de datos (operaciones in-memory)
- [x] CORS habilitado
- [x] Compression middleware
- [x] Error handling
- [x] Health checks

### ✅ DevOps
- [x] Dockerfiles para frontend y backend
- [x] Docker Compose configuration
- [x] Script de despliegue automático
- [x] Documentación completa
- [x] Ejemplos de configuración
- [x] Guías de testing

---

## 📊 Métricas Calculadas

Para cada test se calculan:
- **Average**: Tiempo promedio de respuesta
- **Min**: Tiempo mínimo registrado
- **Max**: Tiempo máximo registrado
- **P50 (Mediana)**: 50% de las respuestas fueron más rápidas
- **P95**: 95% de las respuestas fueron más rápidas
- **P99**: 99% de las respuestas fueron más rápidas

---

## 🎨 Diseño UI/UX

### Colores
- **Primary**: Azul (#0ea5e9) - Tecnología, confianza
- **Accent**: Púrpura (#d946ef) - Innovación, creatividad
- **Success**: Verde (#10b981) - Éxito, positivo
- **Background**: Slate oscuro - Moderno, profesional

### Características
- Gradientes suaves
- Animaciones sutiles
- Efectos de hover
- Bordes con glow effect
- Iconos de Lucide React
- Tipografía Inter (Google Fonts)

---

## 📝 Notas Importantes

1. El proyecto está completamente configurado y listo para usar
2. Solo necesitas configurar las URLs de tus EC2
3. Los archivos Docker están optimizados para producción
4. La documentación incluye troubleshooting común
5. El script de despliegue automatiza todo el proceso

---

## 🔗 Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [Express.js](https://expressjs.com/)
- [Docker Documentation](https://docs.docker.com/)
- [AWS EC2](https://aws.amazon.com/ec2/)

---

¡El proyecto está completo y listo para desplegar! 🎉
