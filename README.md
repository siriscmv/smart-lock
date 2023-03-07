# Smart Lock

- `apps/pi` is the "client" that runs on a raspberry pi, it is present inside the vehicle and controls the solenoid lock
- `apps/web` is a Next.JS frontend
- `apps/server` is a Deno backend, a WebSocket server for pi <-> server and web <-> server communication
