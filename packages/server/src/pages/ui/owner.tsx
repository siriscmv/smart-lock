import * as ws from '@utils/ws';

export async function getServerSideProps() {
    return {
        props: { ids: Array.from(ws.connections.keys()) },
    }
}

export default function Owner(props: any) {
    return (
        <div className='flex flex-col text-center'>
            <h1 className='text-3xl font-bold mb-12'>Smart Lock</h1>
            <div className='flex flex-row'>
                {props.ids}
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                >
                    Lock
                </button>
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                >
                    Unlock
                </button>
            </div>
        </div>
    );
}