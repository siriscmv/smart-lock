import { useState } from "react";
import Button from "./Button";

interface AuthProps {
    type: 'OWNER' | 'DRIVER';
}

const Auth = (props: AuthProps) => {
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    return (
        <div className="flex flex-col m-4 p-4 justify-between text-black bg-white rounded-md">
            <h2 className="font-bold text-center text-3xl uppercase">Login</h2>
            <div className="flex flex-col p-2 m-2">
                <div className="">
                    <div className="text-left font-semibold">Username</div>
                    <input onChange={(e) => setUsername(e.target.value)} placeholder="Enter username here" className="bg-black rounded-md text-white m-2 p-2" type={'text'} />
                </div>
                <div className="">
                    <div className="text-left font-semibold">Password</div>
                    <input onChange={(e) => setPassword(e.target.value)} placeholder="Enter password here" className="bg-black rounded-md text-white m-2 p-2" type={'password'} />
                </div>
            </div>
            <Button run={() => {
                fetch('/api/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        type: props.type,
                        username,
                        password
                    })
                })
            }} text='Login' />
        </div >
    )
}

export default Auth;