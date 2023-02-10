import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className='flex h-screen justify-center items-center'>
      <Component {...pageProps} />
    </div>
  );
}
