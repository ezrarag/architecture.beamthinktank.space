#!/bin/bash

echo "🚀 Setting up BEAM Architecture Site..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cp env.example .env.local
    echo "⚠️  Please update .env.local with your actual API keys"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete! To start the development server:"
echo "   npm run dev"
echo ""
echo "📝 Don't forget to:"
echo "   1. Update .env.local with your Supabase and Stripe keys"
echo "   2. Configure your Supabase database"
echo "   3. Set up Stripe webhooks (optional)"
echo ""
echo "🌐 The site will be available at: http://localhost:3000"
