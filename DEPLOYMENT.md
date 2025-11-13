# AWS Deployment Guide

This guide will help you deploy the 67 Cool Survey App to AWS Amplify with S3 storage.

## Prerequisites

- AWS Account
- AWS CLI configured with appropriate credentials
- GitHub repository set up (https://github.com/cflinspach/67coolapp.git)
- Node.js and npm installed locally

## Step 1: Create S3 Bucket for Vote Storage

Create an S3 bucket to store the votes.json file:

```bash
# Replace YOUR_BUCKET_NAME with a unique bucket name
aws s3 mb s3://YOUR_BUCKET_NAME --region us-east-1

# Create initial votes.json file
echo '[]' | aws s3 cp - s3://YOUR_BUCKET_NAME/votes.json --content-type application/json
```

**Note:** Make sure the bucket name is globally unique. A good pattern is: `67coolapp-votes-<your-username>-<random-string>`

## Step 2: Set Up IAM Permissions

The Lambda functions need permission to read/write to the S3 bucket. Amplify will handle this automatically when you configure the functions, but you can also create a policy manually:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

## Step 3: Install Dependencies

```bash
npm install --legacy-peer-deps
```

## Step 4: Configure Amplify in AWS Console

1. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/
2. Click "New app" > "Host web app"
3. Select "GitHub" as your source
4. Authorize AWS Amplify to access your GitHub account
5. Select the repository: `cflinspach/67coolapp`
6. Select the branch: `main` (or your default branch)

## Step 5: Configure Build Settings

Amplify should automatically detect the `amplify.yml` file. If not, use these build settings:

**Build settings:**
- Build command: `npm run build`
- Output directory: `build`

## Step 6: Configure Environment Variables

In the Amplify Console, go to your app > Environment variables and add:

- `VITE_API_BASE_URL`: Leave empty (will use relative URLs in production)
- `VOTES_BUCKET_NAME`: Your S3 bucket name (e.g., `67coolapp-votes-username-12345`)
- `AWS_REGION`: `us-east-1` (or your preferred region)

## Step 7: Configure Lambda Functions

In Amplify Console:

1. Go to your app > Backend environments
2. Add the Lambda functions:
   - Function name: `vote`
   - Function name: `results`
3. For each function, set the environment variable:
   - `VOTES_BUCKET_NAME`: Your S3 bucket name
4. Configure API Gateway to route:
   - `POST /api/vote` → `vote` function
   - `GET /api/results` → `results` function

## Step 8: Deploy

1. Click "Save and deploy" in Amplify Console
2. Wait for the build to complete
3. Your app will be available at the Amplify-provided URL

## Step 9: Update Frontend API Configuration

After deployment, update the frontend to use the API Gateway endpoint:

1. In Amplify Console, note your API Gateway endpoint URL
2. Update the environment variable `VITE_API_BASE_URL` in Amplify Console to your API Gateway URL
3. Redeploy the app

## Alternative: Using Amplify CLI

If you prefer using the Amplify CLI:

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add API (API Gateway + Lambda)
amplify add api

# Add storage (S3)
amplify add storage

# Push to AWS
amplify push

# Publish
amplify publish
```

## Troubleshooting

### Lambda functions can't access S3
- Verify the IAM role has S3 permissions
- Check that the bucket name environment variable is set correctly
- Ensure the bucket exists in the same region as your Lambda functions

### CORS errors
- The Lambda functions include CORS headers
- Verify API Gateway CORS settings are configured
- Check that the frontend is using the correct API endpoint

### Build failures
- Ensure all dependencies are in package.json
- Check that `--legacy-peer-deps` is used during install
- Verify Node.js version compatibility (18.x recommended)

## Local Development

For local development, you can still use the Express server:

```bash
npm start
```

This runs both the frontend (port 5173) and backend (port 3001) locally.

