import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const VOTES_FILE = path.join(__dirname, 'votes.json');

app.use(cors());
app.use(express.json());

// Initialize votes.json if it doesn't exist
if (!fs.existsSync(VOTES_FILE)) {
	fs.writeFileSync(VOTES_FILE, JSON.stringify([], null, 2));
}

// POST endpoint to submit a vote
app.post('/api/vote', (req, res) => {
	try {
		const { option } = req.body;
		
		if (!option) {
			return res.status(400).json({ error: 'Option is required' });
		}

		// Read existing votes
		const votes = JSON.parse(fs.readFileSync(VOTES_FILE, 'utf8'));
		
		// Add new vote with timestamp
		votes.push({
			option,
			timestamp: Date.now()
		});
		
		// Write back to file
		fs.writeFileSync(VOTES_FILE, JSON.stringify(votes, null, 2));
		
		res.json({ success: true, message: 'Vote recorded' });
	} catch (error) {
		console.error('Error recording vote:', error);
		res.status(500).json({ error: 'Failed to record vote' });
	}
});

// GET endpoint to retrieve aggregated results
app.get('/api/results', (req, res) => {
	try {
		const votes = JSON.parse(fs.readFileSync(VOTES_FILE, 'utf8'));
		
		// Aggregate votes by option
		const counts = {};
		votes.forEach(vote => {
			counts[vote.option] = (counts[vote.option] || 0) + 1;
		});
		
		res.json({
			total: votes.length,
			counts
		});
	} catch (error) {
		console.error('Error retrieving results:', error);
		res.status(500).json({ error: 'Failed to retrieve results' });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

