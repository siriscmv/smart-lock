# Smart Lock

- `packages/pi` is the "client" that runs on a raspberry pi (connected to the lock)
- `packages/server` is a Next.JS Application that includes both the main backend and frontend

## Websocket Protocol

- Basic payload structure

```json
{
    "op": int, // opcode
    "d": json_serializable_object? // data

}
```

- Opcodes:

```md
0: Identify (client -> server) - Client sends its details
1: IdentifyAck (server -> client) - Server acknowledges the client and imposes a heartbeat interval
2: Heartbeat (client -> server) - Client sends a heartbeat to the server, along with current location
3: HeartbeatAck (server -> client) - Server acknowledges the heartbeat
4: Lock (server -> client) - Server instructs the client to lock the lock
5: Unlock (server -> client) - Server instructs the client to unlock the lock
```
