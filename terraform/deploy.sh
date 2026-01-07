#!/bin/bash
set -e

echo "🚀 Deploying Despacha Zap to AWS..."

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install it first."
    exit 1
fi

# Check if API key is set
if [ -z "$TF_VAR_api_key" ]; then
    echo "❌ API key not set. Please set TF_VAR_api_key environment variable:"
    echo "   export TF_VAR_api_key='your-api-key-here'"
    exit 1
fi

# Step 1: Build the frontend
echo "📦 Building frontend..."
cd ..
npm run build

# Step 2: Initialize Terraform
echo "🔧 Initializing Terraform..."
cd terraform
terraform init

# Step 3: Plan deployment
echo "📋 Planning deployment..."
terraform plan -out=tfplan

# Step 4: Apply (with confirmation)
echo "🚀 Applying Terraform configuration..."
terraform apply tfplan

# Step 5: Get outputs
echo "✅ Deployment complete!"
echo ""
echo "📊 Outputs:"
terraform output

# Step 6: Upload frontend to S3
echo ""
echo "📤 Uploading frontend files to S3..."
BUCKET_NAME=$(terraform output -raw s3_bucket_name)
aws s3 sync ../dist/ s3://$BUCKET_NAME/ --delete

# Step 7: Invalidate CloudFront cache
echo "♻️ Invalidating CloudFront cache..."
DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo ""
echo "✨ Deployment successful!"
echo "🌐 Your website is available at: $(terraform output -raw website_url)"
