# Despacha Zap - Terraform Infrastructure

This directory contains Terraform configuration to deploy the Despacha Zap frontend to AWS with secure API key handling.

## Architecture

```
User Browser → CloudFront → CloudFront Function (adds x-api-key) → API Gateway → Lambda
                    ↓
                S3 Bucket (frontend static files)
```

## Features

- ✅ S3 bucket for frontend hosting
- ✅ CloudFront distribution with custom domain support
- ✅ CloudFront Function to inject API key (never exposed to browser)
- ✅ Automatic HTTPS with CloudFront certificate
- ✅ SPA routing support (404 → index.html)
- ✅ API requests proxied through CloudFront

## Local Testing

For local development, continue using the Vite dev server with proxy:

```bash
# From project root
npm run dev
```

The Vite proxy (vite.config.ts) handles API key injection locally, so you can test the full flow before deploying.

## Prerequisites

1. **AWS CLI configured:**
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region
```

2. **Terraform installed:**
```bash
# macOS
brew install terraform

# Verify
terraform --version
```

3. **API Key as environment variable:**
```bash
export TF_VAR_api_key="your-api-key-here"
```

## Deployment Steps

### 1. Configure variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values (optional)
```

### 2. Deploy with script (easiest)

```bash
chmod +x deploy.sh
export TF_VAR_api_key="your-api-key-here"
./deploy.sh
```

### 3. Or deploy manually

```bash
# Build frontend
cd ..
npm run build

# Initialize Terraform
cd terraform
terraform init

# Preview changes
terraform plan

# Apply configuration
terraform apply

# Upload frontend files
aws s3 sync ../dist/ s3://$(terraform output -raw s3_bucket_name)/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $(terraform output -raw cloudfront_distribution_id) \
  --paths "/*"
```

## Outputs

After deployment, Terraform will output:

- `cloudfront_url`: Your CloudFront distribution URL
- `website_url`: Full website URL (https://...)
- `s3_bucket_name`: S3 bucket where files are stored
- `cloudfront_distribution_id`: For cache invalidation

## Updating Frontend

After making changes to the frontend:

```bash
# Build new version
npm run build

# Upload to S3
aws s3 sync dist/ s3://$(terraform output -raw s3_bucket_name)/ --delete

# Invalidate cache (so users see new version immediately)
aws cloudfront create-invalidation \
  --distribution-id $(terraform output -raw cloudfront_distribution_id) \
  --paths "/*"
```

## Custom Domain (Optional)

To use a custom domain like `despachazap.com.br`:

1. **Uncomment domain configuration in cloudfront.tf**

2. **Create ACM certificate in us-east-1:**
```bash
aws acm request-certificate \
  --domain-name despachazap.com.br \
  --validation-method DNS \
  --region us-east-1
```

3. **Validate certificate** via DNS (follow AWS instructions)

4. **Update terraform.tfvars:**
```hcl
domain_name = "despachazap.com.br"
```

5. **Apply Terraform again:**
```bash
terraform apply
```

6. **Update DNS:** Add CNAME record pointing to CloudFront URL

## Cost Estimation

**Monthly costs (approximate):**
- S3 storage: ~$0.50 (for 20GB)
- CloudFront: ~$1-5 (first 1TB free tier)
- CloudFront Functions: ~$0.10 per 1M requests
- Total: **~$2-6/month** for moderate traffic

## Cleanup

To destroy all resources:

```bash
cd terraform
terraform destroy
```

## Security Notes

- ✅ API key is stored in CloudFront Function (server-side)
- ✅ Never exposed to browser network tab
- ✅ S3 bucket is private (only CloudFront can access)
- ✅ All traffic uses HTTPS
- ✅ API key not committed to git (use environment variable)

## Troubleshooting

**CloudFront changes taking time?**
- CloudFront distribution changes take 15-20 minutes to propagate globally

**403 Forbidden errors?**
- Check S3 bucket policy allows CloudFront OAI access
- Verify files were uploaded to S3

**API requests failing?**
- Check CloudFront Function logs in CloudWatch
- Verify API Gateway URL is correct in terraform.tfvars

**Cache not updating?**
- Always invalidate CloudFront cache after uploading new files
- Use `/*` path to invalidate everything
