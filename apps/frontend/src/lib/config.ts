const config = {
	BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
	PADDLE_ENV: import.meta.env.VITE_PADDLE_ENV,
	PADDLE_TOKEN: import.meta.env.VITE_PADDLE_CLIENT_SIDE_TOKEN,
	BASE_URL: import.meta.env.VITE_BASE_URL,
	PADDLE_PRICE_ID: import.meta.env.VITE_PADDLE_PRICE_ID,
};

export default config;
