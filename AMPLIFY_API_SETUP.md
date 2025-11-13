# Setting Up API Routes in AWS Amplify

## Option 1: Using Amplify CLI (Recommended)

1. **Install Amplify CLI** (if not already installed):
```bash
npm install -g @aws-amplify/cli
```

2. **Initialize Amplify in your project**:
```bash
cd /home/cflinspach/Church
amplify init
```
   - Choose your AWS profile
   - Select the region (e.g., us-east-1)
   - Choose JavaScript as the framework
   - Source directory: `src`
   - Distribution directory: `build`
   - Build command: `npm run build`
   - Start command: `npm run dev`

3. **Add API (REST API with Lambda)**:
```bash
amplify add api
```
   - Choose: REST
   - API name: `67coolappapi` (or any name)
   - Path: `/api`
   - Choose: Create a new Lambda function
   - Function name: `vote`
   - Choose: Serverless ExpressJS function
   - Edit the function code to match our vote function
   - Add another path: `/api`
   - Add another function: `results`

4. **Push to AWS**:
```bash
amplify push
```

## Option 2: Manual API Gateway Setup

1. **Go to API Gateway Console**:
   - Navigate to: https://console.aws.amazon.com/apigateway/
   - Click "Create API"
   - Choose "REST API" → "Build"
   - Name: `67coolapp-api`
   - Create API

2. **Create Resources**:
   - Create resource: `/api`
   - Create resource under `/api`: `vote`
   - Create resource under `/api`: `results`

3. **Create Methods**:
   - Select `/api/vote` → Create Method → POST
   - Integration type: Lambda Function
   - Select your `vote` Lambda function
   - Select `/api/results` → Create Method → GET
   - Integration type: Lambda Function
   - Select your `results` Lambda function

4. **Deploy API**:
   - Actions → Deploy API
   - Stage: `prod` (or create new)
   - Note the Invoke URL (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/prod`)

5. **Update Amplify Environment Variable**:
   - In Amplify Console → Environment variables
   - Add: `VITE_API_BASE_URL` = your API Gateway Invoke URL

## Option 3: Check Amplify Console for Backend Section

1. In the Amplify Console sidebar, scroll down or look for:
   - "Backend" section
   - "Backend environments" 
   - Or check under "App settings" → "General settings"

2. If you see "Backend", click it to configure Lambda functions and API routes.

## Quick Check: Do Lambda Functions Exist?

1. Go to AWS Lambda Console: https://console.aws.amazon.com/lambda/
2. Check if `vote` and `results` functions exist
3. If they exist, you just need to connect them via API Gateway
4. If they don't exist, you need to create them first

