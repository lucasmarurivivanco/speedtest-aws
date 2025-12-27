#!/bin/bash

# AWS EC2 Deployment Script
# This script helps deploy the application to EC2 instances

echo "🚀 AWS Speed Test - Deployment Script"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if EC2 IP is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: EC2 IP address not provided${NC}"
    echo "Usage: ./deploy.sh <EC2_IP> <KEY_FILE>"
    echo "Example: ./deploy.sh 54.123.456.789 ~/my-key.pem"
    exit 1
fi

EC2_IP=$1
KEY_FILE=${2:-"~/.ssh/id_rsa"}

echo -e "${YELLOW}Target EC2:${NC} $EC2_IP"
echo -e "${YELLOW}SSH Key:${NC} $KEY_FILE"
echo ""

# Check if key file exists
if [ ! -f "$KEY_FILE" ]; then
    echo -e "${RED}Error: Key file not found: $KEY_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}Step 1:${NC} Connecting to EC2..."
ssh -i "$KEY_FILE" -o StrictHostKeyChecking=no ec2-user@$EC2_IP "echo 'Connection successful!'"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Could not connect to EC2${NC}"
    exit 1
fi

echo -e "${GREEN}Step 2:${NC} Installing Docker..."
ssh -i "$KEY_FILE" ec2-user@$EC2_IP << 'ENDSSH'
    sudo yum update -y
    sudo yum install -y docker
    sudo service docker start
    sudo usermod -a -G docker ec2-user
    
    # Install Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    # Install Git
    sudo yum install -y git
    
    echo "Docker and Docker Compose installed successfully!"
ENDSSH

echo -e "${GREEN}Step 3:${NC} Creating application directory..."
ssh -i "$KEY_FILE" ec2-user@$EC2_IP "mkdir -p ~/speedtest-aws"

echo -e "${GREEN}Step 4:${NC} Copying files to EC2..."
scp -i "$KEY_FILE" -r \
    docker-compose.yml \
    backend \
    frontend \
    ec2-user@$EC2_IP:~/speedtest-aws/

echo -e "${GREEN}Step 5:${NC} Building and starting Docker containers..."
ssh -i "$KEY_FILE" ec2-user@$EC2_IP << 'ENDSSH'
    cd ~/speedtest-aws
    docker-compose down
    docker-compose build
    docker-compose up -d
    
    echo ""
    echo "Waiting for services to start..."
    sleep 10
    
    echo ""
    echo "Container status:"
    docker-compose ps
ENDSSH

echo ""
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo "Your application should be available at:"
echo -e "${YELLOW}http://$EC2_IP${NC}"
echo ""
echo "To check logs:"
echo "  ssh -i $KEY_FILE ec2-user@$EC2_IP 'cd ~/speedtest-aws && docker-compose logs'"
echo ""
echo "To restart:"
echo "  ssh -i $KEY_FILE ec2-user@$EC2_IP 'cd ~/speedtest-aws && docker-compose restart'"
