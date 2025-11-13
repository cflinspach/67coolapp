# Complete Deployment Steps

## ✅ What's Already Done

1. ✅ SvelteKit frontend configured for static deployment
2. ✅ Lambda function code created (vote and results)
3. ✅ S3 bucket created for vote storage
4. ✅ GitHub Actions workflow created
5. ✅ Code pushed to GitHub

## 🔧 Next Steps to Complete Deployment

### Step 1: Set Up GitHub Secrets

1. Go to your GitHub repository: https://github.com/cflinspach/67coolapp
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

   **Secret 1: AWS_ACCESS_KEY_ID**
   - Name: `AWS_ACCESS_KEY_ID`
   - Value: Your AWS Access Key ID
   - How to get it:
     - Go to AWS Console → IAM → Users → Your username
     - Security credentials tab → Create access key
     - Choose "Command Line Interface (CLI)"
     - Copy the Access Key ID

   **Secret 2: AWS_SECRET_ACCESS_KEY**
   - Name: `AWS_SECRET_ACCESS_KEY`
   - Value: Your AWS Secret Access Key
   - (From the same place as above, copy the Secret Access Key)

   **Secret 3: AWS_ACCOUNT_ID**
   - Name: `AWS_ACCOUNT_ID`
   - Value: Your 12-digit AWS Account ID
   - How to get it:
     - Go to AWS Console
     - Click your username in top right
     - Your Account ID is displayed there

### Step 2: Trigger the GitHub Actions Workflow

1. Go to your GitHub repository → **Actions** tab
2. You should see "Deploy Lambda Functions and API Gateway" workflow
3. Click on it, then click **Run workflow** → **Run workflow**
4. Wait for the workflow to complete (takes about 2-3 minutes)
5. Check the workflow output for the API Gateway URL

### Step 3: Update Amplify Environment Variable

1. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/
2. Select your app: **67coolapp**
3. Go to **Environment variables** (under Hosting in sidebar)
4. Add/Update:
   - Key: `VITE_API_BASE_URL`
   - Value: The API Gateway URL from Step 2 (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/prod`)
5. Click **Save**
6. This will trigger a new deployment of your frontend

### Step 4: Verify Deployment

1. Wait for Amplify to finish redeploying
2. Visit your app: https://main.d7helhxlyq50t.amplifyapp.com/
3. Try submitting a vote
4. Check the browser console (F12) for any errors
5. Visit the results page to see if votes are being recorded

## 🔍 Troubleshooting

### If the GitHub Actions workflow fails:

1. Check the workflow logs for specific errors
2. Verify all three secrets are set correctly
3. Make sure your AWS credentials have permissions for:
   - Lambda (create/update functions)
   - API Gateway (create/update APIs)
   - IAM (create roles and policies)
   - S3 (read access to the votes bucket)

### If API calls still fail:

1. Check browser console for the actual API URL being used
2. Verify the `VITE_API_BASE_URL` environment variable is set in Amplify
3. Test the API Gateway URL directly:
   ```bash
   curl -X POST https://YOUR_API_URL/api/vote \
     -H "Content-Type: application/json" \
     -d '{"option":"Very cool"}'
   ```

### If Lambda functions can't access S3:

1. Go to Lambda Console → Your function → Configuration → Permissions
2. Verify the IAM role has S3 access
3. Check that `VOTES_BUCKET_NAME` environment variable is set correctly

## 📝 What the Workflow Does

The GitHub Actions workflow automatically:

1. **Creates IAM Role** with permissions for:
   - Lambda execution
   - S3 read/write access to votes bucket

2. **Deploys Lambda Functions**:
   - `vote` function (POST /api/vote)
   - `results` function (GET /api/results)
   - Sets environment variables (bucket name, region)

3. **Creates API Gateway**:
   - REST API named `67coolapp-api`
   - Routes `/api/vote` and `/api/results`
   - Configures CORS for cross-origin requests
   - Deploys to `prod` stage

4. **Outputs API Gateway URL** for you to use in Amplify

## 🎉 After Everything is Set Up

Your app will be fully functional:
- Frontend hosted on Amplify
- Backend API on API Gateway
- Lambda functions processing votes
- S3 storing vote data
- Automatic deployments on code changes

