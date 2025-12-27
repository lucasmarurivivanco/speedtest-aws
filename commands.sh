#!/bin/bash

# Quick commands for AWS Speed Test project
# Make this file executable: chmod +x commands.sh

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

show_menu() {
    echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║   AWS Speed Test - Quick Commands         ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}Development:${NC}"
    echo "  1) Install dependencies"
    echo "  2) Run in development mode"
    echo "  3) Run frontend only"
    echo "  4) Run backend only"
    echo ""
    echo -e "${GREEN}Docker:${NC}"
    echo "  5) Build Docker images"
    echo "  6) Start Docker containers"
    echo "  7) Stop Docker containers"
    echo "  8) View Docker logs"
    echo "  9) Clean Docker (remove containers & images)"
    echo ""
    echo -e "${GREEN}Testing:${NC}"
    echo "  10) Test backend health"
    echo "  11) Test ping endpoint"
    echo "  12) Test I/O endpoint"
    echo ""
    echo -e "${GREEN}Deployment:${NC}"
    echo "  13) Deploy to EC2"
    echo ""
    echo -e "${GREEN}Utilities:${NC}"
    echo "  14) View project structure"
    echo "  15) Check ports"
    echo "  16) Generate .env files"
    echo ""
    echo "  0) Exit"
    echo ""
    echo -n "Select option: "
}

install_deps() {
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    cd frontend && npm install && cd ..
    cd backend && npm install && cd ..
    echo -e "${GREEN}✓ Dependencies installed${NC}"
}

run_dev() {
    echo -e "${YELLOW}Starting development servers...${NC}"
    npm run dev
}

run_frontend() {
    echo -e "${YELLOW}Starting frontend only...${NC}"
    cd frontend && npm run dev
}

run_backend() {
    echo -e "${YELLOW}Starting backend only...${NC}"
    cd backend && npm run dev
}

docker_build() {
    echo -e "${YELLOW}Building Docker images...${NC}"
    docker-compose build
    echo -e "${GREEN}✓ Docker images built${NC}"
}

docker_start() {
    echo -e "${YELLOW}Starting Docker containers...${NC}"
    docker-compose up -d
    sleep 3
    docker-compose ps
    echo ""
    echo -e "${GREEN}✓ Containers running${NC}"
    echo -e "${CYAN}Access at: http://localhost${NC}"
}

docker_stop() {
    echo -e "${YELLOW}Stopping Docker containers...${NC}"
    docker-compose down
    echo -e "${GREEN}✓ Containers stopped${NC}"
}

docker_logs() {
    echo -e "${YELLOW}Showing Docker logs...${NC}"
    docker-compose logs -f
}

docker_clean() {
    echo -e "${YELLOW}Cleaning Docker...${NC}"
    docker-compose down -v
    docker system prune -af
    echo -e "${GREEN}✓ Docker cleaned${NC}"
}

test_health() {
    echo -e "${YELLOW}Testing backend health...${NC}"
    curl -s http://localhost:3001/api/health | json_pp
}

test_ping() {
    echo -e "${YELLOW}Testing ping endpoint...${NC}"
    curl -s http://localhost:3001/api/test/ping | json_pp
}

test_io() {
    echo -e "${YELLOW}Testing I/O endpoint...${NC}"
    curl -s -X POST http://localhost:3001/api/test/io \
        -H "Content-Type: application/json" \
        -d '{"operation": "both", "size": 10}' | json_pp
}

deploy_ec2() {
    echo -e "${YELLOW}Deploy to EC2${NC}"
    echo -n "Enter EC2 IP: "
    read ec2_ip
    echo -n "Enter key file path (default: ~/.ssh/id_rsa): "
    read key_file
    key_file=${key_file:-~/.ssh/id_rsa}
    
    ./deploy.sh "$ec2_ip" "$key_file"
}

view_structure() {
    echo -e "${YELLOW}Project Structure:${NC}"
    cat PROJECT_STRUCTURE.md
}

check_ports() {
    echo -e "${YELLOW}Checking ports...${NC}"
    echo ""
    echo "Port 3000 (Frontend):"
    lsof -i :3000 || echo "  Not in use"
    echo ""
    echo "Port 3001 (Backend):"
    lsof -i :3001 || echo "  Not in use"
    echo ""
    echo "Port 80 (Docker):"
    sudo lsof -i :80 || echo "  Not in use"
}

generate_env() {
    echo -e "${YELLOW}Generating .env files...${NC}"
    
    # Frontend .env.local
    if [ ! -f frontend/.env.local ]; then
        cp frontend/.env.local.example frontend/.env.local
        echo -e "${GREEN}✓ Created frontend/.env.local${NC}"
    else
        echo -e "${YELLOW}! frontend/.env.local already exists${NC}"
    fi
    
    # Backend .env
    if [ ! -f backend/.env ]; then
        cp backend/.env.example backend/.env
        echo -e "${GREEN}✓ Created backend/.env${NC}"
    else
        echo -e "${YELLOW}! backend/.env already exists${NC}"
    fi
}

# Main loop
while true; do
    show_menu
    read option
    
    case $option in
        1) install_deps ;;
        2) run_dev ;;
        3) run_frontend ;;
        4) run_backend ;;
        5) docker_build ;;
        6) docker_start ;;
        7) docker_stop ;;
        8) docker_logs ;;
        9) docker_clean ;;
        10) test_health ;;
        11) test_ping ;;
        12) test_io ;;
        13) deploy_ec2 ;;
        14) view_structure ;;
        15) check_ports ;;
        16) generate_env ;;
        0) echo -e "${GREEN}Goodbye!${NC}"; exit 0 ;;
        *) echo -e "${YELLOW}Invalid option${NC}" ;;
    esac
    
    echo ""
    echo -e "${CYAN}Press Enter to continue...${NC}"
    read
    clear
done
