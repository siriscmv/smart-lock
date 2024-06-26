import '../styles/globals.css';
import '../styles/nprogress.css';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import Font from 'next/font/local';
import NProgress from 'nprogress';
import Toaster from '@components/Toaster';
import { useEffect } from 'react';
import { listen } from 'src/utils/listner';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const font = Font({ src: '../styles/fonts/Satoshi-Variable.woff2' });

export default function App({ Component, pageProps }: AppProps) {
	useEffect(() => {
		if (!window.ws) window.ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
	}, []);

	useEffect(() => {
		listen((msg) => {
			const d = JSON.parse(msg.data);
			if (d.op === 'ALERT') window.alert(d.msg);
		});
	}, []);

	return (
		<main style={font.style} className='flex bg-slate text-light min-h-screen py-8 justify-center items-center'>
			<Toaster />
			<Component {...pageProps} />
		</main>
	);
}
