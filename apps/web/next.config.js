const withPWA = require('next-pwa')({
	dest: 'public',
	register: true,
	skipWaiting: true
});

const removeImports = require('next-remove-imports')();

const nextConfig = removeImports(
	withPWA({
		reactStrictMode: true
	})
);

module.exports = nextConfig;
