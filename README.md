# Smart Lock

- `apps/pi` is the "client" that runs on a raspberry pi, it is present inside the vehicle and controls the solenoid lock
- `apps/web` is a NextJS frontend, with dashboards for drivers and owners
- `apps/server` is a NodeJS backend, a WebSocket server for pi <-> server and web <-> server communication
