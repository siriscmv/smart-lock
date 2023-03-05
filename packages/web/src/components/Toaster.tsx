import { Toaster as HotToast } from 'react-hot-toast';

export default function Toaster() {
    return (
        <HotToast
            position='top-center'
            reverseOrder={true}
            toastOptions={{
                duration: 6_000,
                className: 'text-center',
                success: {
                    style: {
                        background: '#0A4205',
                        color: '#66F359'
                    }
                },
                error: {
                    style: {
                        background: '#42050A',
                        color: '#f35966'
                    }
                }
            }}
        />
    )
}