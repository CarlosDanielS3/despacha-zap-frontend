# AWS-Native Solutions for API Key Security

Since both frontend and API are in AWS, here are the best approaches:

## Option 1: CloudFront + Lambda@Edge (Recommended)

**Architecture:**
```
User Browser → CloudFront → Lambda@Edge (adds API key) → API Gateway
```

**Pros:**
- No separate backend server needed
- Edge computing = fast globally
- Integrates seamlessly with S3/Amplify hosting
- Scales automatically

**Setup:**

1. **Deploy frontend to S3 + CloudFront:**
```bash
# Build frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://despacha-zap-frontend

# Create CloudFront distribution pointing to S3
```

2. **Create Lambda@Edge function:**
```javascript
// lambda-edge-add-api-key.js
export const handler = async (event) => {
  const request = event.Records[0].cf.request;
  
  // Only add API key to API requests
  if (request.uri.startsWith('/api/')) {
    request.headers['x-api-key'] = [{
      key: 'x-api-key',
      value: process.env.AWS_API_KEY
    }];
    
    // Rewrite path to API Gateway
    request.origin = {
      custom: {
        domainName: process.env.AWS_API_DOMAIN || 'your-api-gateway.execute-api.region.amazonaws.com',
        port: 443,
        protocol: 'https',
        path: '/production',
        sslProtocols: ['TLSv1.2'],
        readTimeout: 30,
        keepaliveTimeout: 5
      }
    };
    request.uri = request.uri.replace('/api', '');
  }
  
  return request;
};
```

3. **Attach Lambda@Edge to CloudFront:**
- Go to CloudFront → Behaviors → Create/Edit
- Add Lambda@Edge association (Origin Request)
- Deploy to all edge locations

**Cost:** ~$0.60 per 1M requests + CloudFront costs

---

## Option 2: API Gateway with IAM Authentication + Cognito

**Architecture:**
```
User → Cognito (get temp credentials) → API Gateway (IAM auth) → Lambda
```

**Pros:**
- No API keys exposed at all
- User-level authentication
- Fine-grained permissions with IAM

**Setup:**

1. **Create Cognito Identity Pool (unauthenticated access):**
```bash
aws cognito-identity create-identity-pool \
  --identity-pool-name despacha-zap-pool \
  --allow-unauthenticated-identities
```

2. **Update API Gateway to use IAM authentication:**
- Remove API key requirement
- Enable IAM authorization
- Create IAM role for unauthenticated users

3. **Update frontend to use AWS SDK:**
```typescript
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

const credentials = fromCognitoIdentityPool({
  client: new CognitoIdentityClient({ region: "us-east-1" }),
  identityPoolId: "us-east-1:xxx-xxx-xxx"
});

// Use AWS Signature V4 to sign requests
```

**Cost:** Free tier: 50,000 MAU

---

## Option 3: CloudFront Functions (Simplest & Cheapest)

**Architecture:**
```
User → CloudFront Function (adds header) → API Gateway
```

**Pros:**
- Cheapest option ($0.10 per 1M requests)
- Runs at CloudFront edge (very fast)
- No cold starts
- Simplest to implement

**Setup:**

1. **Create CloudFront Function:**
```javascript
function handler(event) {
  var request = event.request;
  
  // Add API key to requests going to /api/*
  if (request.uri.startsWith('/api/')) {
    request.headers['x-api-key'] = {
      value: process.env.AWS_API_KEY || 'your-api-key-here'
    };
  }
  
  return request;
}
```

2. **Deploy via AWS Console:**
- CloudFront → Functions → Create
- Paste code above
- Publish function
- Associate with CloudFront distribution (Viewer Request)

3. **Add API Gateway as origin:**
- CloudFront → Origins → Add origin
- Origin domain: `your-api-gateway.execute-api.region.amazonaws.com`
- Origin path: `/production`
- Behavior pattern: `/api/*`

**Cost:** ~$0.10 per 1M invocations (10x cheaper than Lambda@Edge!)

---

## Option 4: API Gateway Request Transformation

**Architecture:**
```
User → API Gateway (adds header via mapping template) → Lambda
```

**Pros:**
- No CloudFront needed
- Built-in to API Gateway
- Zero additional cost

**Cons:**
- Still exposes API endpoint directly
- Can be bypassed if users find direct API URL

**Setup:**

1. **API Gateway → Method Request:**
- Add mapping template
- Add header transformation:
```vtl
#set($context.requestOverride.header.x-api-key = $stg.variables.api_key)
```

**Not recommended** - users can still find and call the API Gateway URL directly

---

## Recommendation: CloudFront Functions

For your use case, **CloudFront Functions** is the best choice because:
- ✅ Cheapest ($0.10/1M vs $0.60/1M for Lambda@Edge)
- ✅ Fastest (runs at edge, no cold starts)
- ✅ Simplest to set up
- ✅ API key never exposed to browser
- ✅ Works with S3/Amplify hosting
- ✅ No server to manage

Would you like me to create a CloudFormation template or Terraform config to set this up?
