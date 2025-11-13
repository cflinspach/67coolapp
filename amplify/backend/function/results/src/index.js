import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: 'us-east-1' });
const BUCKET_NAME = process.env.VOTES_BUCKET_NAME;
const VOTES_FILE_KEY = 'votes.json';

async function getVotesFromS3() {
	try {
		const command = new GetObjectCommand({
			Bucket: BUCKET_NAME,
			Key: VOTES_FILE_KEY
		});
		const response = await s3Client.send(command);
		const bodyString = await response.Body.transformToString();
		return JSON.parse(bodyString);
	} catch (error) {
		if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
			// File doesn't exist, return empty array
			return [];
		}
		throw error;
	}
}

export const handler = async (event) => {
	// Handle CORS preflight
	if (event.httpMethod === 'OPTIONS') {
		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Content-Type',
				'Access-Control-Allow-Methods': 'GET, OPTIONS'
			},
			body: ''
		};
	}

	if (event.httpMethod !== 'GET') {
		return {
			statusCode: 405,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ error: 'Method not allowed' })
		};
	}

	try {
		const votes = await getVotesFromS3();

		// Aggregate votes by option
		const counts = {};
		votes.forEach(vote => {
			counts[vote.option] = (counts[vote.option] || 0) + 1;
		});

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				total: votes.length,
				counts
			})
		};
	} catch (error) {
		console.error('Error retrieving results:', error);
		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ error: 'Failed to retrieve results' })
		};
	}
};

