<script>
	import { API_BASE_URL } from '$lib/config.js';
	
	let selectedOption = '';
	let submitted = false;
	let submitting = false;
	
	const options = [
		'Very cool',
		'Cool',
		'Somewhat cool',
		'Neutral',
		'Not cool',
		'Uncool',
		'Very uncool'
	];
	
	async function submitVote() {
		if (!selectedOption) return;
		
		submitting = true;
		try {
			const response = await fetch(`${API_BASE_URL}/api/vote`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ option: selectedOption })
			});
			
			if (response.ok) {
				submitted = true;
				selectedOption = '';
				setTimeout(() => {
					submitted = false;
				}, 3000);
			}
		} catch (error) {
			console.error('Error submitting vote:', error);
			alert('Failed to submit vote. Please try again.');
		} finally {
			submitting = false;
		}
	}
</script>

<div class="container">
	<div class="card">
		<h1>Is 67 Cool?</h1>
		<p class="subtitle">Share your opinion!</p>
		
		{#if submitted}
			<div class="success-message">
				✓ Thank you for your vote!
			</div>
		{/if}
		
		<form on:submit|preventDefault={submitVote}>
			<div class="options">
				{#each options as option}
					<label class="radio-option">
						<input
							type="radio"
							name="coolness"
							value={option}
							bind:group={selectedOption}
						/>
						<span>{option}</span>
					</label>
				{/each}
			</div>
			
			<button type="submit" disabled={!selectedOption || submitting}>
				{submitting ? 'Submitting...' : 'Submit Vote'}
			</button>
		</form>
		
		<a href="/results" class="results-link">View Results →</a>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 80vh;
	}
	
	.card {
		background: white;
		border-radius: 16px;
		padding: 3rem;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		max-width: 600px;
		width: 100%;
	}
	
	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: #333;
		text-align: center;
	}
	
	.subtitle {
		text-align: center;
		color: #666;
		margin-bottom: 2rem;
		font-size: 1.1rem;
	}
	
	.success-message {
		background: #10b981;
		color: white;
		padding: 1rem;
		border-radius: 8px;
		text-align: center;
		margin-bottom: 1.5rem;
		font-weight: 500;
	}
	
	.options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}
	
	.radio-option {
		display: flex;
		align-items: center;
		padding: 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.radio-option:hover {
		border-color: #667eea;
		background: #f3f4f6;
	}
	
	.radio-option input[type="radio"] {
		margin-right: 1rem;
		width: 20px;
		height: 20px;
		cursor: pointer;
	}
	
	.radio-option input[type="radio"]:checked + span {
		font-weight: 600;
		color: #667eea;
	}
	
	.radio-option:has(input[type="radio"]:checked) {
		border-color: #667eea;
		background: #eef2ff;
	}
	
	button {
		width: 100%;
		padding: 1rem;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}
	
	button:hover:not(:disabled) {
		background: #5568d3;
	}
	
	button:disabled {
		background: #9ca3af;
		cursor: not-allowed;
	}
	
	.results-link {
		display: block;
		text-align: center;
		margin-top: 1.5rem;
		color: #667eea;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}
	
	.results-link:hover {
		color: #5568d3;
		text-decoration: underline;
	}
</style>

