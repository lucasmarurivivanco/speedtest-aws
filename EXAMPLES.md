# Example Configurations

## Local Development Setup

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
REGION=local
```

---

## Production - Chile Local Zone

### docker-compose.yml
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://YOUR_CHILE_IP:3001
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - REGION=chile-lz
    volumes:
      - ./backend/test-data:/app/test-data
```

---

## Production - São Paulo (sa-east-1)

### docker-compose.yml
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://YOUR_SAOPAULO_IP:3001
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - REGION=sa-east-1
    volumes:
      - ./backend/test-data:/app/test-data
```

---

## EC2 Instance Recommendations

### Minimum Requirements
- **Instance Type**: t3.micro (1 vCPU, 1 GB RAM)
- **Storage**: 8 GB gp3
- **OS**: Amazon Linux 2023

### Recommended
- **Instance Type**: t3.small (2 vCPU, 2 GB RAM)
- **Storage**: 20 GB gp3
- **OS**: Amazon Linux 2023

### For High Load
- **Instance Type**: t3.medium (2 vCPU, 4 GB RAM)
- **Storage**: 30 GB gp3
- **OS**: Amazon Linux 2023

---

## Security Group Configuration

### Inbound Rules
```
Type        Protocol    Port Range    Source          Description
HTTP        TCP         80            0.0.0.0/0       Web traffic
Custom TCP  TCP         3001          0.0.0.0/0       API traffic
SSH         TCP         22            YOUR_IP/32      SSH access
```

### Outbound Rules
```
Type        Protocol    Port Range    Destination     Description
All traffic All         All           0.0.0.0/0       Allow all outbound
```

---

## Testing Configurations

### Light Load (Quick Test)
```javascript
{
  testType: 'ping',
  requestCount: 10
}
```

### Medium Load (Balanced)
```javascript
{
  testType: 'io',
  requestCount: 50
}
```

### Heavy Load (Comprehensive)
```javascript
{
  testType: 'processing',
  requestCount: 100
}
```

---

## nginx Configuration (Optional - For HTTPS)

If you want to add SSL/TLS support:

### /etc/nginx/conf.d/speedtest.conf
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## CloudWatch Monitoring (Optional)

### Install CloudWatch Agent
```bash
sudo yum install -y amazon-cloudwatch-agent

# Configure
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard

# Start
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -s \
    -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json
```

---

## Backup Script (Optional)

### backup.sh
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ec2-user/backups"

mkdir -p $BACKUP_DIR

# Backup Docker volumes
docker run --rm \
    -v speedtest-aws_test-data:/data \
    -v $BACKUP_DIR:/backup \
    alpine tar czf /backup/test-data-$DATE.tar.gz -C /data .

# Keep only last 7 backups
ls -t $BACKUP_DIR/test-data-*.tar.gz | tail -n +8 | xargs rm -f

echo "Backup completed: test-data-$DATE.tar.gz"
```

---

## Load Balancer Configuration (Optional)

If you want to use an Application Load Balancer:

### Target Groups
1. **Frontend Target Group**
   - Port: 3000
   - Health check: /
   - Interval: 30s

2. **Backend Target Group**
   - Port: 3001
   - Health check: /api/health
   - Interval: 30s

### Listener Rules
- Port 80 → Frontend Target Group
- Port 3001 → Backend Target Group

---

## Auto Scaling (Optional)

### Launch Template
```json
{
  "ImageId": "ami-xxxxxxxxx",
  "InstanceType": "t3.small",
  "KeyName": "your-key",
  "SecurityGroupIds": ["sg-xxxxxxxxx"],
  "UserData": "base64-encoded-startup-script",
  "TagSpecifications": [
    {
      "ResourceType": "instance",
      "Tags": [
        {
          "Key": "Name",
          "Value": "speedtest-auto"
        }
      ]
    }
  ]
}
```

### Auto Scaling Group
- Min: 1
- Desired: 2
- Max: 4
- Target CPU Utilization: 70%

---

## Cost Optimization Tips

1. **Use Spot Instances**: Save up to 90% for non-critical testing
2. **Stop instances when not in use**: Schedule start/stop
3. **Use t3 instances**: Burstable performance at lower cost
4. **Enable EBS optimization**: Better I/O performance
5. **Use gp3 instead of gp2**: Better price/performance

---

## Monitoring Metrics

### Key Metrics to Watch
- CPU Utilization
- Network In/Out
- Disk Read/Write Ops
- Memory Usage (with CloudWatch Agent)
- Application Response Time

### Alarms to Set
```bash
# High CPU
aws cloudwatch put-metric-alarm \
    --alarm-name high-cpu \
    --alarm-description "CPU above 80%" \
    --metric-name CPUUtilization \
    --namespace AWS/EC2 \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2
```
