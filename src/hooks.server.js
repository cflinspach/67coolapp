/** @type {import('@sveltejs/kit').HandleServerError} */
export async function handleError({ error, event }) {
	console.error('Server error:', error);
	return {
		message: 'An error occurred'
	};
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	return await resolve(event);
}

