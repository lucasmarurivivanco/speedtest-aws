# AWS EC2 Configuration Guide

## Pre-requisitos

1. Dos instancias EC2:
   - Una en sa-east-1 (São Paulo)
   - Una en la Local Zone de Chile
2. Security Groups configurados para permitir:
   - Puerto 80 (HTTP)
   - Puerto 22 (SSH)
   - Puerto 3001 (API Backend)

## Paso 1: Configurar Security Group

### Inbound Rules
```
Type        Protocol    Port Range    Source
HTTP        TCP         80            0.0.0.0/0
SSH         TCP         22            Tu IP
Custom TCP  TCP         3001          0.0.0.0/0
```

## Paso 2: Conectarse a la instancia

```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

## Paso 3: Instalar Docker

```bash
# Actualizar el sistema
sudo yum update -y

# Instalar Docker
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
docker-compose --version
```

## Paso 4: Clonar o copiar el proyecto

### Opción A: Usando Git
```bash
git clone <your-repo-url>
cd speedtest-aws
```

### Opción B: Copiar archivos desde tu máquina local
```bash
# Desde tu máquina local
scp -i your-key.pem -r ./speedtest-aws ec2-user@your-ec2-ip:~/
```

## Paso 5: Configurar variables de entorno

### Para la instancia de Chile
```bash
cd speedtest-aws

# Editar docker-compose.yml
nano docker-compose.yml
```

Cambiar la variable de entorno del backend:
```yaml
environment:
  - NODE_ENV=production
  - PORT=3001
  - REGION=chile-lz  # <-- Cambiar esto
```

### Para la instancia de São Paulo
```yaml
environment:
  - NODE_ENV=production
  - PORT=3001
  - REGION=sa-east-1  # <-- Cambiar esto
```

## Paso 6: Construir y ejecutar

```bash
# Build de las imágenes
docker-compose build

# Ejecutar los contenedores
docker-compose up -d

# Verificar que estén corriendo
docker-compose ps

# Ver logs
docker-compose logs -f
```

## Paso 7: Verificar funcionamiento

```bash
# Test del backend
curl http://localhost:3001/api/health

# Debería devolver algo como:
# {"status":"healthy","region":"chile-lz","timestamp":"...","uptime":123}
```

## Paso 8: Configurar en el frontend

Una vez que ambas instancias estén corriendo, abre la aplicación web (http://tu-ec2-ip) y configura:

1. **URL Chile**: `http://ip-de-ec2-chile`
2. **URL São Paulo**: `http://ip-de-ec2-saopaulo`

## Comandos útiles

### Ver logs
```bash
docker-compose logs -f
docker-compose logs backend
docker-compose logs frontend
```

### Reiniciar servicios
```bash
docker-compose restart
docker-compose restart backend
docker-compose restart frontend
```

### Detener servicios
```bash
docker-compose down
```

### Actualizar el código
```bash
git pull
docker-compose down
docker-compose build
docker-compose up -d
```

### Ver uso de recursos
```bash
docker stats
```

## Troubleshooting

### Puerto 80 ocupado
Si el puerto 80 está ocupado, cambia el mapeo en docker-compose.yml:
```yaml
ports:
  - "8080:3000"  # Usar puerto 8080 en lugar de 80
```

### Problemas de memoria
Si la instancia tiene poca memoria:
```bash
# Verificar memoria
free -h

# Crear swap
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Error de permisos con Docker
```bash
# Volver a cargar el grupo
newgrp docker

# O reiniciar la sesión SSH
exit
ssh -i your-key.pem ec2-user@your-ec2-ip
```

## Automatización con script

Usa el script de despliegue incluido:

```bash
# Desde tu máquina local
chmod +x deploy.sh
./deploy.sh <EC2_IP> <KEY_FILE>

# Ejemplo:
./deploy.sh 54.123.456.789 ~/.ssh/my-key.pem
```

## Notas importantes

1. **Costos**: Recuerda que las instancias EC2 generan costos. Detén las instancias cuando no las uses.

2. **Seguridad**: 
   - No dejes el puerto 22 abierto a 0.0.0.0/0
   - Usa tu IP específica para SSH
   - Considera usar un Application Load Balancer

3. **HTTPS**: Para producción, configura un certificado SSL usando:
   - AWS Certificate Manager
   - Let's Encrypt con nginx

4. **Monitoring**: Considera agregar:
   - CloudWatch para monitoreo
   - CloudWatch Logs para logs centralizados
   - X-Ray para tracing

5. **Backup**: Realiza snapshots regulares de tus volúmenes EBS
