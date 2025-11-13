#!/bin/bash
set -e

REGION="us-east-1"
API_ID="vbi5s1qh91"

echo "Setting up API Gateway resources..."

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query 'items[?path==`/`].id' --output text)
echo "Root ID: $ROOT_ID"

# Create /api resource
API_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query "items[?path=='/api'].id" --output text)
if [ -z "$API_RESOURCE_ID" ] || [ "$API_RESOURCE_ID" == "None" ]; then
    API_RESOURCE_ID=$(aws apigateway create-resource --rest-api-id $API_ID --parent-id $ROOT_ID --path-part api --region $REGION --query 'id' --output text)
    echo "Created /api resource: $API_RESOURCE_ID"
else
    echo "/api resource already exists: $API_RESOURCE_ID"
fi

# Create /api/vote resource
VOTE_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query "items[?path=='/api/vote'].id" --output text)
if [ -z "$VOTE_RESOURCE_ID" ] || [ "$VOTE_RESOURCE_ID" == "None" ]; then
    VOTE_RESOURCE_ID=$(aws apigateway create-resource --rest-api-id $API_ID --parent-id $API_RESOURCE_ID --path-part vote --region $REGION --query 'id' --output text)
    echo "Created /api/vote resource: $VOTE_RESOURCE_ID"
else
    echo "/api/vote resource already exists: $VOTE_RESOURCE_ID"
fi

# Create /api/results resource
RESULTS_RESOURCE_ID=$(aws apigateway get-resources --rest-api-id $API_ID --region $REGION --query "items[?path=='/api/results'].id" --output text)
if [ -z "$RESULTS_RESOURCE_ID" ] || [ "$RESULTS_RESOURCE_ID" == "None" ]; then
    RESULTS_RESOURCE_ID=$(aws apigateway create-resource --rest-api-id $API_ID --parent-id $API_RESOURCE_ID --path-part results --region $REGION --query 'id' --output text)
    echo "Created /api/results resource: $RESULTS_RESOURCE_ID"
else
    echo "/api/results resource already exists: $RESULTS_RESOURCE_ID"
fi

# Get Lambda function ARNs
VOTE_FUNCTION_ARN=$(aws lambda get-function --function-name vote --region $REGION --query 'Configuration.FunctionArn' --output text)
RESULTS_FUNCTION_ARN=$(aws lambda get-function --function-name results --region $REGION --query 'Configuration.FunctionArn' --output text)

echo "Vote function ARN: $VOTE_FUNCTION_ARN"
echo "Results function ARN: $RESULTS_FUNCTION_ARN"

# Create POST method for /api/vote
if ! aws apigateway get-method --rest-api-id $API_ID --resource-id $VOTE_RESOURCE_ID --http-method POST --region $REGION 2>/dev/null; then
    echo "Creating POST method for /api/vote..."
    aws apigateway put-method --rest-api-id $API_ID --resource-id $VOTE_RESOURCE_ID --http-method POST --authorization-type NONE --region $REGION
    
    aws apigateway put-integration --rest-api-id $API_ID --resource-id $VOTE_RESOURCE_ID --http-method POST --type AWS_PROXY --integration-http-method POST --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$VOTE_FUNCTION_ARN/invocations" --region $REGION
    
    # Grant API Gateway permission to invoke Lambda
    aws lambda add-permission --function-name vote --statement-id apigateway-invoke-vote-$(date +%s) --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:$REGION:*:$API_ID/*/POST/api/vote" --region $REGION 2>/dev/null || true
    echo "POST /api/vote configured"
else
    echo "POST method for /api/vote already exists"
fi

# Create GET method for /api/results
if ! aws apigateway get-method --rest-api-id $API_ID --resource-id $RESULTS_RESOURCE_ID --http-method GET --region $REGION 2>/dev/null; then
    echo "Creating GET method for /api/results..."
    aws apigateway put-method --rest-api-id $API_ID --resource-id $RESULTS_RESOURCE_ID --http-method GET --authorization-type NONE --region $REGION
    
    aws apigateway put-integration --rest-api-id $API_ID --resource-id $RESULTS_RESOURCE_ID --http-method GET --type AWS_PROXY --integration-http-method POST --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$RESULTS_FUNCTION_ARN/invocations" --region $REGION
    
    # Grant API Gateway permission to invoke Lambda
    aws lambda add-permission --function-name results --statement-id apigateway-invoke-results-$(date +%s) --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:$REGION:*:$API_ID/*/GET/api/results" --region $REGION 2>/dev/null || true
    echo "GET /api/results configured"
else
    echo "GET method for /api/results already exists"
fi

# Deploy API
echo "Deploying API Gateway..."
DEPLOYMENT_ID=$(aws apigateway create-deployment --rest-api-id $API_ID --stage-name prod --region $REGION --query 'id' --output text)
API_URL="https://$API_ID.execute-api.$REGION.amazonaws.com/prod"

echo ""
echo "=========================================="
echo "🚀 Deployment Complete!"
echo "=========================================="
echo "API Gateway URL: $API_URL"
echo ""
echo "Endpoints:"
echo "  POST $API_URL/api/vote"
echo "  GET  $API_URL/api/results"
echo ""
echo "Next step: Update VITE_API_BASE_URL in Amplify Console to: $API_URL"
echo "=========================================="

