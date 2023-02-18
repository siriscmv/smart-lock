import express from 'express';
import { Gpio } from 'onoff';
import * as dotenv from 'dotenv';
dotenv.config({ path: './../../.env' });

const app = express();
const lock = new Gpio(parseInt(process.env.LOCK_PIN), 'out');

app.use((req, res, next) => {
	if (req.headers.authorization !== process.env.CLIENT_API_AUTH) {
		return res.status(403).json({ error: 'Invalid or missing credentials' });
	}
	next();
});

app.get('/ping', (_, res) => {
	res.send('pong');
});

app.post('/lock', async (_, res) => {
	await lock.write(0);
	res.status(204).send();
});

app.post('/unlock', async (_, res) => {
	await lock.write(1);
	res.status(204).send();
});

app.listen(parseInt(process.env.CLIENT_API_PORT), () => {
	console.log(`Client API listening on port ${process.env.CLIENT_API_PORT}`);
});
