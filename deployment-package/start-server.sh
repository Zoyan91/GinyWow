#!/bin/bash

# GinyWow Website - Production Server Startup Script
# This script will start your website in production mode

echo "🚀 Starting GinyWow Website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project if dist folder doesn't exist
if [ ! -d "dist" ]; then
    echo "🔨 Building production files..."
    npm run build
fi

# Check if .env file exists, if not create from example
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your production settings!"
fi

# Start the server
echo "✅ Starting GinyWow website on port 3000..."
echo "🌐 Visit: http://localhost:3000"
echo "🛑 Press Ctrl+C to stop the server"

npm start