#!/bin/bash

# AWS EC2 Local Deployment Script
# Execute this script directly on each EC2 instance via SSM

echo "🚀 AWS Speed Test - Local Deployment Script"
echo "============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if docker-compose.yml exists in current directory
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}Error: docker-compose.yml not found${NC}"
    echo "Please run this script from the speedtest-aws directory"
    echo ""
    echo "Expected structure:"
    echo "  speedtest-aws/"
    echo "  ├── docker-compose.yml"
    echo "  ├── frontend/"
    echo "  └── backend/"
    exit 1
fi

echo -e "${YELLOW}Current directory:${NC} $(pwd)"
echo ""

# Get EC2 metadata
echo -e "${YELLOW}Detecting EC2 location...${NC}"
AVAILABILITY_ZONE=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)
REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/region)
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Detect if it's a Local Zone (has pattern like sa-east-1-scl-1a)
if [[ $AVAILABILITY_ZONE =~ -[a-z]{3}-[0-9] ]]; then
    LOCATION_TYPE="Local Zone"
    LOCATION_NAME="$AVAILABILITY_ZONE"
else
    LOCATION_TYPE="Region"
    LOCATION_NAME="$REGION ($AVAILABILITY_ZONE)"
fi

echo -e "${GREEN}Location Type:${NC} $LOCATION_TYPE"
echo -e "${GREEN}Location:${NC} $LOCATION_NAME"
echo -e "${GREEN}Public IP:${NC} $PUBLIC_IP"
echo ""

# Create a backup of docker-compose.yml
cp docker-compose.yml docker-compose.yml.backup

# Update docker-compose.yml with the public IP
sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=http://$PUBLIC_IP:3001|g" docker-compose.yml

# Add REGION environment variable to backend if not present
if ! grep -q "REGION=" docker-compose.yml; then
    sed -i "/PORT=3001/a\      - REGION=$AVAILABILITY_ZONE" docker-compose.yml
else
    sed -i "s|REGION=.*|REGION=$AVAILABILITY_ZONE|g" docker-compose.yml
fi

echo -e "${GREEN}Configuration updated:${NC} $LOCATION_TYPE ($AVAILABILITY_ZONE)"
echo ""

# Check if Docker is running
if ! docker ps &> /dev/null; then
    echo -e "${RED}Error: Docker is not running${NC}"
    echo "Please start Docker first: sudo service docker start"
    exit 1
fi

echo -e "${GREEN}Step 1:${NC} Stopping existing containers..."
docker compose down

echo ""
echo -e "${GREEN}Step 2:${NC} Building Docker images..."
docker compose build

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Build failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Step 3:${NC} Starting containers..."
docker compose up -d

echo ""
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 10

echo ""
echo -e "${GREEN}Step 4:${NC} Checking container status..."
docker compose ps

echo ""
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Your application is ready!${NC}"
echo "━━━━━━━━━━━━━━Type:${NC} $LOCATION_TYPE"
echo -e "  ${YELLOW}Location:${NC} $AVAILABILITY_ZONE━━━━━━━━━━━━"
echo ""
echo -e "  ${YELLOW}Region:${NC} $REGION"
echo -e "  ${YELLOW}URL:${NC} http://$PUBLIC_IP"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f       # View logs"
echo "  docker compose restart       # Restart services"
echo "  docker compose down          # Stop services"
echo "  docker compose ps            # Check status"
