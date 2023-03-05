/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./src/utils/**/*.{js,ts,jsx,tsx}'
	],
	theme: {
		extend: {
			colors: {
				primary: '#5465ff',
				secondary: '#ffe900',
				slate: '#10100e',
				light: '#f5edf0',
				success: '#63ff52',
				dangerous: '#ff5263'
			}
		}
	},
	plugins: []
};
