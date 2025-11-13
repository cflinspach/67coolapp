# GitHub Actions Workflows

## Deploy API Workflow

This workflow automatically deploys Lambda functions and API Gateway when changes are made to the Lambda function code.

### Required GitHub Secrets

Before the workflow can run, you need to set up the following secrets in your GitHub repository:

1. Go to: Settings → Secrets and variables → Actions → New repository secret

2. Add these secrets:
   - `AWS_ACCESS_KEY_ID` - Your AWS access key ID
   - `AWS_SECRET_ACCESS_KEY` - Your AWS secret access key
   - `AWS_ACCOUNT_ID` - Your AWS account ID (12-digit number)

### How to Get AWS Credentials

1. **AWS Access Key ID and Secret Access Key:**
   - Go to AWS Console → IAM → Users → Your user
   - Security credentials tab → Create access key
   - Choose "Command Line Interface (CLI)"
   - Save both the Access Key ID and Secret Access Key

2. **AWS Account ID:**
   - Go to AWS Console
   - Click on your username in the top right
   - Your Account ID is displayed there

### What the Workflow Does

1. Creates IAM role for Lambda functions with S3 access
2. Deploys `vote` Lambda function
3. Deploys `results` Lambda function
4. Creates or updates API Gateway REST API
5. Sets up routes:
   - `POST /api/vote` → vote function
   - `GET /api/results` → results function
6. Configures CORS for both endpoints
7. Deploys the API Gateway
8. Outputs the API Gateway URL

### After Deployment

1. Copy the API Gateway URL from the workflow output
2. Go to AWS Amplify Console → Your app → Environment variables
3. Add/Update: `VITE_API_BASE_URL` = your API Gateway URL
4. Redeploy your Amplify app

### Manual Trigger

You can also manually trigger the workflow:
- Go to Actions tab in GitHub
- Select "Deploy Lambda Functions and API Gateway"
- Click "Run workflow"

