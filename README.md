# Smart Lock

 - A IoT project that tackles unauthorized vehicle access during transit by enabling automatic locking and unlocking based on pre-authorized vehicle positions. It supports one-time passwords for unfamiliar locations, integrating Bluetooth and GPS for dual-layer security before automatically unlocking.

- `apps/pi` is the "client" that runs on a raspberry pi, it is present inside the vehicle and controls the solenoid lock
- `apps/web` is a NextJS frontend, with dashboards for drivers and owners
- `apps/server` is a NodeJS backend, a WebSocket server for pi <-> server and web <-> server communication

- Instructions to run individual services can be found in the respective folder's README
