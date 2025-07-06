#!/bin/bash

echo "🧠 TokenWise Setup Script"
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Create data directory
echo "📁 Creating data directory..."
mkdir -p data

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please review and modify if needed."
else
    echo "✅ .env file already exists."
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd dashboard
npm install
cd ..

# Build the project
echo "🔨 Building the project..."
npm run build

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the backend: npm start"
echo "2. Start the dashboard: cd dashboard && npm start"
echo ""
echo "Access the application:"
echo "- Dashboard: http://localhost:3000"
echo "- API: http://localhost:3001/api"
echo ""
echo "Happy monitoring! 🚀" 