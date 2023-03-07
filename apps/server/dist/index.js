import { wss } from './utils/connections.js';
console.log(`Started WebSocket server at port ${wss.options.port}`);
process.on('unhandledException', console.error);
process.on('unhandledRejection', console.error);
