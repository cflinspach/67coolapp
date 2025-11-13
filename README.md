# Survey App: Is 67 Cool?

A survey application built with SvelteKit frontend and Node.js/Express backend to collect votes on whether 67 is cool.

## Features

- Survey form with 7 range options (Very cool to Very uncool)
- Real-time results page with pie chart and bar chart
- JSON file storage for votes (local) or S3 storage (AWS deployment)
- No vote restrictions - users can vote unlimited times
- AWS Amplify deployment ready

## Local Development Setup

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Start the development server (runs both frontend and backend):
```bash
npm start
```

Or run them separately:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

3. Open your browser to `http://localhost:5173` (or the port shown in the terminal)

## AWS Deployment

This app is configured for deployment to AWS Amplify with Lambda functions and S3 storage.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deployment steps:
1. Create S3 bucket for vote storage (use `aws-setup.sh` script)
2. Connect GitHub repository to AWS Amplify
3. Configure environment variables in Amplify Console
4. Deploy!

## Project Structure

- `server.js` - Express backend server with API endpoints (local development)
- `votes.json` - JSON file storing all votes (created automatically, local only)
- `src/routes/+page.svelte` - Survey form page
- `src/routes/results/+page.svelte` - Results page with charts
- `amplify/backend/function/` - Lambda functions for AWS deployment
- `amplify.yml` - Amplify build configuration

## API Endpoints

- `POST /api/vote` - Submit a vote (body: `{ option: string }`)
- `GET /api/results` - Get aggregated vote results

## Environment Variables

- `VITE_API_BASE_URL` - API base URL (defaults to `http://localhost:3001` for local dev)
- `VOTES_BUCKET_NAME` - S3 bucket name for vote storage (AWS deployment only)

