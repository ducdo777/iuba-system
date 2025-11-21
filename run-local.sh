#!/bin/bash

# Script to run IUBA System locally with production build
# Backend: Production build (from dist/)
# Frontend: Dev server (hot reload)

echo "=== 🚀 Starting IUBA System Locally ==="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if backend is built
if [ ! -d "dist" ] || [ ! -f "dist/main.js" ]; then
    echo -e "${YELLOW}⚠️  Backend not built. Building backend...${NC}"
    npm run build:backend
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Backend build failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Backend built successfully${NC}"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Installing backend dependencies...${NC}"
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Installing frontend dependencies...${NC}"
    cd frontend && npm install && cd ..
fi

echo ""
echo -e "${GREEN}✅ All dependencies installed${NC}"
echo ""

# Load environment variables if .env.local exists
if [ -f ".env.local" ]; then
    echo -e "${GREEN}📝 Loading .env.local${NC}"
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Start backend in background
echo -e "${GREEN}🚀 Starting backend (production build) on http://localhost:3002${NC}"
npm run start:prod > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend is running
if ! curl -s http://localhost:3002/api/health > /dev/null 2>&1; then
    echo -e "${YELLOW}⏳ Waiting for backend to start...${NC}"
    sleep 2
fi

# Check again
if curl -s http://localhost:3002/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend failed to start. Check backend.log${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend
echo ""
echo -e "${GREEN}🚀 Starting frontend (dev server) on http://localhost:5173${NC}"
echo -e "${GREEN}📝 Frontend will connect to backend at http://localhost:3002${NC}"
echo ""

cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Stopped all services${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

echo ""
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ IUBA System is running!${NC}"
echo ""
echo -e "${GREEN}📍 URLs:${NC}"
echo -e "   Backend API:  ${YELLOW}http://localhost:3002${NC}"
echo -e "   Frontend:     ${YELLOW}http://localhost:5173${NC}"
echo -e "   API Health:   ${YELLOW}http://localhost:3002/api/health${NC}"
echo ""
echo -e "${GREEN}🔐 Default Login:${NC}"
echo -e "   Username: ${YELLOW}admin${NC}"
echo -e "   Password: ${YELLOW}admin123${NC}"
echo ""
echo -e "${GREEN}📝 Logs:${NC}"
echo -e "   Backend:  ${YELLOW}backend.log${NC}"
echo -e "   Frontend: Console output (above)"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""

# Wait for processes
wait

