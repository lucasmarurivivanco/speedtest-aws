# AWS EC2 Speed Test - Local Zone vs Regional

Proyecto para comparar el rendimiento entre una EC2 en sa-east-1 (São Paulo) y una EC2 en la Local Zone de Chile.

## 🚀 Características

- ✅ Múltiples tipos de pruebas (Latencia, I/O, Procesamiento, Database)
- ✅ Tests individuales y de carga (múltiples requests)
- ✅ Métricas detalladas (avg, min, max, p50, p95, p99)
- ✅ Visualización en tiempo real
- ✅ Interfaz moderna y responsiva
- ✅ Dockerizado para fácil despliegue

## 🏗️ Arquitectura

- **Frontend**: Next.js 14 + React + Tailwind CSS + Chart.js
- **Backend**: Node.js + Express
- **Puerto**: 80 (frontend) y 3001 (backend API)

## 📦 Instalación Local

### Prerequisitos
- Node.js 18+
- npm o yarn

### Desarrollo

```bash
# Instalar dependencias del root
npm install

# Instalar dependencias del frontend
cd frontend && npm install

# Instalar dependencias del backend
cd ../backend && npm install

# Volver al root y ejecutar en modo desarrollo
cd ..
npm run dev
```

El frontend estará en `http://localhost:3000` y el backend en `http://localhost:3001`.

## 🐳 Docker

### Build y ejecución

```bash
# Build de las imágenes
docker-compose build

# Ejecutar los contenedores
docker-compose up

# Detener
docker-compose down
```

La aplicación estará disponible en `http://localhost`.

## 🚢 Despliegue en EC2

### 1. Preparar la instancia EC2

```bash
# Conectarse a la EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Instalar Docker
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Clonar y ejecutar

```bash
# Clonar el repositorio
git clone <your-repo-url>
cd speedtest-aws

# Configurar variables de entorno (si es necesario)
# Editar docker-compose.yml con las URLs correctas

# Build y ejecutar
docker-compose up -d
```

### 3. Configurar Security Group

Asegúrate de que el Security Group de tu EC2 permita tráfico en el puerto 80:
- Type: HTTP
- Protocol: TCP
- Port Range: 80
- Source: 0.0.0.0/0 (o tu rango de IPs específico)

## 🔧 Configuración

### Variables de entorno

#### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://your-backend-url:3001
NEXT_PUBLIC_REGION_NAME=sa-east-1
```

#### Backend (`backend/.env`)
```env
PORT=3001
NODE_ENV=production
REGION=sa-east-1
```

## 📊 Tipos de Pruebas

1. **Latencia Simple**: Mide el tiempo de respuesta básico
2. **I/O de Archivos**: Lee/escribe archivos para medir operaciones de disco
3. **Procesamiento con I/O**: Procesa imágenes simuladas
4. **Database Simulada**: Simula operaciones de base de datos con búsquedas

## 🎯 Uso

1. Abre la aplicación en tu navegador
2. Configura las URLs de ambos servidores (Chile y São Paulo)
3. Selecciona el tipo de prueba
4. Elige la cantidad de requests
5. Haz clic en "Iniciar Prueba"
6. Observa los resultados en tiempo real

## 📈 Métricas

- **Promedio**: Tiempo promedio de respuesta
- **Mínimo**: Tiempo más rápido
- **Máximo**: Tiempo más lento
- **P50 (Mediana)**: 50% de las respuestas fueron más rápidas
- **P95**: 95% de las respuestas fueron más rápidas
- **P99**: 99% de las respuestas fueron más rápidas

## 🤝 Contribución

Pull requests son bienvenidos. Para cambios importantes, por favor abre un issue primero.

## 📄 Licencia

[MIT](https://choosealicense.com/licenses/mit/)
