<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { API_BASE_URL } from '$lib/config.js';
	
	let Chart, Pie, Bar;
	let chartLoaded = false;
	
	// Load Chart.js only on client side to avoid SSR issues
	onMount(async () => {
		if (browser) {
			try {
				const chartModule = await import('chart.js');
				const svelteChartModule = await import('svelte-chartjs');
				
				Chart = chartModule.Chart;
				Pie = svelteChartModule.Pie;
				Bar = svelteChartModule.Bar;
				
				const { CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } = chartModule;
				Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);
				
				chartLoaded = true;
				console.log('Chart.js loaded successfully');
			} catch (error) {
				console.error('Error loading Chart.js:', error);
			}
		}
	});
	
	let results = { total: 0, counts: {} };
	let loading = true;
	
	const options = [
		'Very cool',
		'Cool',
		'Somewhat cool',
		'Neutral',
		'Not cool',
		'Uncool',
		'Very uncool'
	];
	
	onMount(async () => {
		await fetchResults();
		// Refresh results every 5 seconds
		const interval = setInterval(fetchResults, 5000);
		return () => clearInterval(interval);
	});
	
	async function fetchResults() {
		try {
			const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/results` : '/api/results';
			console.log('Fetching results from:', apiUrl);
			const response = await fetch(apiUrl);
			console.log('Response status:', response.status);
			
			if (response.ok) {
				const data = await response.json();
				console.log('Results received:', data);
				results = data;
				loading = false;
			} else {
				console.error('Failed to fetch results. Status:', response.status);
				const errorText = await response.text();
				console.error('Error response:', errorText);
				loading = false;
			}
		} catch (error) {
			console.error('Error fetching results:', error);
			const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/results` : '/api/results';
			console.error('Error details:', {
				message: error.message,
				stack: error.stack,
				apiUrl: apiUrl
			});
			loading = false;
		}
	}
	
	$: chartData = {
		labels: options,
		datasets: [{
			label: 'Votes',
			data: options.map(opt => results.counts[opt] || 0),
			backgroundColor: [
				'#10b981',
				'#3b82f6',
				'#8b5cf6',
				'#f59e0b',
				'#ef4444',
				'#f97316',
				'#dc2626'
			]
		}]
	};
	
	$: chartOptions = {
		responsive: true,
		maintainAspectRatio: true,
		plugins: {
			legend: {
				position: 'bottom'
			}
		}
	};
</script>

<div class="container">
	<div class="card">
		<h1>Survey Results</h1>
		<p class="subtitle">Is 67 Cool? - Live Results</p>
		
		{#if loading}
			<div class="loading">Loading results...</div>
		{:else}
			<div class="total-votes">
				Total Votes: <strong>{results.total}</strong>
			</div>
			
			{#if chartLoaded && Pie && Bar}
				<div class="charts-container">
					<div class="chart-wrapper">
						<h2>Pie Chart</h2>
						<div class="chart">
							<svelte:component this={Pie} data={chartData} options={chartOptions} />
						</div>
					</div>
					
					<div class="chart-wrapper">
						<h2>Bar Chart</h2>
						<div class="chart">
							<svelte:component this={Bar} data={chartData} options={chartOptions} />
						</div>
					</div>
				</div>
			{:else}
				<div class="chart-loading">Loading charts...</div>
			{/if}
			
			<div class="breakdown">
				<h2>Vote Breakdown</h2>
				<div class="breakdown-list">
					{#each options as option}
						<div class="breakdown-item">
							<span class="option-name">{option}</span>
							<span class="vote-count">{results.counts[option] || 0} votes</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
		
		<div class="info-message">
			<p>This was put together without writing any code. If you want to know more there's a young mens group that meets every Wednesday!</p>
		</div>
		
		<a href="/" class="back-link">← Back to Survey</a>
	</div>
</div>

<style>
	.container {
		padding: 2rem 0;
	}
	
	.card {
		background: white;
		border-radius: 16px;
		padding: 3rem;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
	
	.loading {
		text-align: center;
		padding: 3rem;
		color: #666;
		font-size: 1.2rem;
	}
	
	.total-votes {
		text-align: center;
		font-size: 1.5rem;
		margin-bottom: 2rem;
		color: #333;
	}
	
	.total-votes strong {
		color: #667eea;
		font-size: 2rem;
	}
	
	.charts-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 2rem;
		margin-bottom: 3rem;
	}
	
	.chart-wrapper {
		background: #f9fafb;
		padding: 1.5rem;
		border-radius: 12px;
	}
	
	.chart-wrapper h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: #333;
		text-align: center;
	}
	
	.chart {
		position: relative;
		height: 300px;
	}
	
	.chart-loading {
		text-align: center;
		padding: 3rem;
		color: #666;
		font-size: 1.2rem;
	}
	
	.breakdown {
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 2px solid #e5e7eb;
	}
	
	.breakdown h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: #333;
	}
	
	.breakdown-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.breakdown-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: #f9fafb;
		border-radius: 8px;
	}
	
	.option-name {
		font-weight: 500;
		color: #333;
	}
	
	.vote-count {
		color: #667eea;
		font-weight: 600;
	}
	
	.info-message {
		margin-top: 3rem;
		padding: 1.5rem;
		background: #f0f9ff;
		border-left: 4px solid #667eea;
		border-radius: 8px;
		text-align: center;
	}
	
	.info-message p {
		margin: 0;
		color: #1e40af;
		font-size: 1rem;
		line-height: 1.6;
	}
	
	.back-link {
		display: block;
		text-align: center;
		margin-top: 2rem;
		color: #667eea;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}
	
	.back-link:hover {
		color: #5568d3;
		text-decoration: underline;
	}
	
	@media (max-width: 768px) {
		.charts-container {
			grid-template-columns: 1fr;
		}
		
		.card {
			padding: 2rem;
		}
	}
</style>

