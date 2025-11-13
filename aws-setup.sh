#!/bin/bash

# AWS Setup Script for 67 Cool Survey App
# This script helps set up the S3 bucket for vote storage

set -e

echo "AWS Setup for 67 Cool Survey App"
echo "================================"
echo ""

# Get bucket name from user
read -p "Enter a unique S3 bucket name (e.g., 67coolapp-votes-username-12345): " BUCKET_NAME

if [ -z "$BUCKET_NAME" ]; then
    echo "Error: Bucket name cannot be empty"
    exit 1
fi

# Get AWS region
read -p "Enter AWS region (default: us-east-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

echo ""
echo "Creating S3 bucket: $BUCKET_NAME in region: $AWS_REGION"
echo ""

# Create bucket
aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION

# Create initial votes.json file
echo "Creating initial votes.json file..."
echo '[]' | aws s3 cp - s3://$BUCKET_NAME/votes.json --content-type application/json

# Set bucket versioning (optional but recommended)
echo "Enabling bucket versioning..."
aws s3api put-bucket-versioning \
    --bucket $BUCKET_NAME \
    --versioning-configuration Status=Enabled

echo ""
echo "✓ S3 bucket created successfully!"
echo ""
echo "Next steps:"
echo "1. Note your bucket name: $BUCKET_NAME"
echo "2. In AWS Amplify Console, set the environment variable:"
echo "   VOTES_BUCKET_NAME=$BUCKET_NAME"
echo "3. Configure your Lambda functions to use this bucket name"
echo ""

