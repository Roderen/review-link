#!/bin/bash

echo "🔧 Installing Firebase Functions dependencies..."
cd functions
npm install

echo "📦 Building TypeScript..."
npm run build

echo "⚙️  Checking Firebase configuration..."
firebase functions:config:get

echo ""
echo "📋 Before deploying, make sure you have set the WayForPay configuration:"
echo "   firebase functions:config:set wayforpay.merchant_account=\"YOUR_MERCHANT_ACCOUNT\""
echo "   firebase functions:config:set wayforpay.secret_key=\"YOUR_SECRET_KEY\""
echo "   firebase functions:config:set wayforpay.domain_name=\"https://yourdomain.com\""
echo ""
read -p "Have you set the WayForPay configuration? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🚀 Deploying functions to Firebase..."
    firebase deploy --only functions
    echo "✅ Functions deployed successfully!"
else
    echo "❌ Please set the configuration first, then run this script again."
    exit 1
fi

cd ..
