# 🚀 Quick Start Guide

## Inicio Rápido - Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Instalar dependencias del frontend
cd frontend && npm install && cd ..

# 3. Instalar dependencias del backend
cd backend && npm install && cd ..

# 4. Ejecutar en modo desarrollo
npm run dev
```

Abre http://localhost:3000 en tu navegador.

---

## 🐳 Quick Start - Docker Local

```bash
# 1. Build y ejecutar
docker-compose up --build

# 2. Abrir en el navegador
# http://localhost
```

---

## ☁️ Quick Start - Despliegue en EC2

### Paso 1: Preparar las instancias EC2
- Crear 2 instancias EC2 (una en Chile Local Zone, otra en sa-east-1)
- Configurar Security Groups (puertos 80, 22, 3001)
- Anotar las IPs públicas

### Paso 2: Desplegar usando el script

```bash
# Instancia de Chile
./deploy.sh <IP_CHILE> ~/.ssh/tu-key.pem

# Instancia de São Paulo
./deploy.sh <IP_SAOPAULO> ~/.ssh/tu-key.pem
```

### Paso 3: Configurar en la aplicación web
1. Visita `http://<IP_CUALQUIERA>`
2. Ingresa las URLs:
   - Chile: `http://<IP_CHILE>`
   - São Paulo: `http://<IP_SAOPAULO>`
3. ¡Haz clic en "Iniciar Prueba"!

---

## 📊 Tipos de Pruebas Disponibles

1. **Latencia Simple** (ping)
   - Mide el tiempo de respuesta básico
   - Más rápido (~5-50ms)

2. **I/O de Archivos**
   - Lectura y escritura de archivos
   - Mide rendimiento del disco

3. **Procesamiento**
   - Simula procesamiento de imágenes
   - Combina CPU + I/O

4. **Base de Datos**
   - Operaciones de consulta y escritura
   - Simula carga de aplicación real

---

## 🎯 Configuración de URLs

### Formato de URLs
```
http://YOUR_EC2_IP
```

### Ejemplo
```
Chile:      http://18.228.123.45
São Paulo:  http://54.207.89.123
```

**Nota**: Asegúrate de usar `http://` (no `https://`)

---

## 🔧 Comandos Útiles

### Ver logs en EC2
```bash
ssh -i your-key.pem ec2-user@<EC2_IP>
cd ~/speedtest-aws
docker-compose logs -f
```

### Reiniciar servicios
```bash
docker-compose restart
```

### Detener servicios
```bash
docker-compose down
```

### Actualizar código
```bash
git pull
docker-compose down
docker-compose build
docker-compose up -d
```

---

## ❓ Problemas Comunes

### Error: "Cannot connect to server"
- ✅ Verifica que el Security Group permita el puerto 80
- ✅ Verifica que Docker esté corriendo: `docker-compose ps`
- ✅ Revisa los logs: `docker-compose logs`

### Error: "Timeout"
- ✅ Aumenta el timeout en la configuración
- ✅ Verifica conectividad: `curl http://EC2_IP/api/health`

### Error: Puerto 80 ocupado
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "8080:3000"  # Usar 8080 en lugar de 80
```

---

## 📚 Documentación Adicional

- [README.md](README.md) - Documentación completa
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guía detallada de despliegue
- [TESTING.md](TESTING.md) - Guía de testing

---

## 💡 Tips

1. **Requests**: Empieza con 10 requests, aumenta a 50-100 para más precisión
2. **Tests**: Prueba todos los tipos para tener una visión completa
3. **Horarios**: Los resultados pueden variar según la hora del día
4. **Múltiples pruebas**: Ejecuta varias pruebas para obtener promedios más confiables

---

## 🎨 Características de la UI

- ✨ Diseño moderno y responsivo
- 📊 Gráficos interactivos con Chart.js
- ⚡ Actualización en tiempo real del progreso
- 🏆 Comparación visual clara del ganador
- 📈 Métricas detalladas (avg, min, max, p50, p95, p99)

---

## 🤝 Soporte

Si tienes problemas:
1. Revisa los logs: `docker-compose logs`
2. Verifica conectividad: `curl http://EC2_IP/api/health`
3. Consulta [TESTING.md](TESTING.md) para troubleshooting

---

¡Listo! 🎉 Ahora puedes medir el rendimiento real entre Chile y São Paulo.
