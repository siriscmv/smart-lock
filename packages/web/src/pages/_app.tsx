import '../styles/globals.css';
import '../styles/nprogress.css';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import Font from 'next/font/local';
import NProgress from 'nprogress';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const font = Font({ src: '../styles/fonts/Satoshi-Variable.woff2' });

export default function App({ Component, pageProps }: AppProps) {
	return (
		<main style={font.style} className='flex bg-slate text-light h-screen justify-center items-center'>
			<Component {...pageProps} />
		</main>
	);
}