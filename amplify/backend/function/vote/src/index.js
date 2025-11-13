import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

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

async function saveVotesToS3(votes) {
	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: VOTES_FILE_KEY,
		Body: JSON.stringify(votes, null, 2),
		ContentType: 'application/json'
	});
	await s3Client.send(command);
}

export const handler = async (event) => {
	// Handle CORS preflight
	if (event.httpMethod === 'OPTIONS') {
		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Content-Type',
				'Access-Control-Allow-Methods': 'POST, OPTIONS'
			},
			body: ''
		};
	}

	if (event.httpMethod !== 'POST') {
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
		const body = JSON.parse(event.body || '{}');
		const { option } = body;

		if (!option) {
			return {
				statusCode: 400,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ error: 'Option is required' })
			};
		}

		// Read existing votes from S3
		const votes = await getVotesFromS3();

		// Add new vote with timestamp
		votes.push({
			option,
			timestamp: Date.now()
		});

		// Save back to S3
		await saveVotesToS3(votes);

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ success: true, message: 'Vote recorded' })
		};
	} catch (error) {
		console.error('Error recording vote:', error);
		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ error: 'Failed to record vote' })
		};
	}
};

