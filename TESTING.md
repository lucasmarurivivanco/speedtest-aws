# Testing Guide

## Local Testing

### Setup
```bash
# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..

# Run in development mode
npm run dev
```

Visit `http://localhost:3000`

### Testing Backend API

#### Health Check
```bash
curl http://localhost:3001/api/health
```

#### Ping Test
```bash
curl http://localhost:3001/api/test/ping
```

#### I/O Test
```bash
curl -X POST http://localhost:3001/api/test/io \
  -H "Content-Type: application/json" \
  -d '{"operation": "both", "size": 10}'
```

#### Processing Test
```bash
curl -X POST http://localhost:3001/api/test/processing \
  -H "Content-Type: application/json" \
  -d '{"iterations": 100}'
```

#### Database Test
```bash
curl -X POST http://localhost:3001/api/test/database \
  -H "Content-Type: application/json" \
  -d '{"operations": 100}'
```

## Docker Testing

### Build and run locally with Docker
```bash
docker-compose build
docker-compose up
```

Visit `http://localhost`

### Test individual services
```bash
# Backend only
docker-compose up backend

# Frontend only
docker-compose up frontend
```

## Load Testing

Use Apache Bench (ab) or similar tools:

```bash
# Install ab (if not installed)
# macOS: brew install httpd
# Ubuntu: sudo apt-get install apache2-utils

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:3001/api/test/ping

# Test with POST
ab -n 100 -c 10 -p post-data.json -T application/json http://localhost:3001/api/test/io
```

## Performance Testing

Compare local vs EC2 performance:

1. Run the app locally
2. Configure one URL as `http://localhost:3001`
3. Configure the other URL as your EC2 instance
4. Run the test

## Expected Results

### Ping Test
- Local: < 5ms
- Same region: 10-50ms
- Cross region: 50-200ms

### I/O Test
- Local SSD: 5-20ms
- EC2 EBS gp3: 10-50ms

### Processing Test
- Depends on instance type
- t2.micro: 200-500ms
- t3.medium: 100-200ms

### Database Test
- In-memory operations: 50-200ms
- Depends on data size and operations

## Troubleshooting

### CORS Issues
If you get CORS errors, check:
1. Backend is running on correct port
2. Frontend `NEXT_PUBLIC_API_URL` is correct
3. Backend CORS middleware is configured

### Timeout Errors
Increase timeout in `testRunner.js`:
```javascript
await axios.get(endpoint, { timeout: 30000 }); // 30 seconds
```

### Port Conflicts
Change ports in:
- `docker-compose.yml`
- `frontend/.env.local`
- `backend/.env`
