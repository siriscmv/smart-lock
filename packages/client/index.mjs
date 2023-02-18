import express from 'express';
import { Gpio } from 'onoff';
import { config } from 'dotenv';

config({ path: './../../.env', override: true });

const app = express();
const lock = new Gpio(parseInt(process.env.LOCK_PIN), 'out');

app.get('/ping', (_, res) => {
	res.status(200).send('pong');
});

app.use((req, res, next) => {
	if (req.headers.authorization !== process.env.CLIENT_API_AUTH) {
		return res.status(403).send('Invalid or missing credentials');
	} else next();
});

app.get('/lock', async (_, res) => {
	await lock.write(0);
	res.status(204).send();
});

app.get('/unlock', async (_, res) => {
	await lock.write(1);
	res.status(204).send();
});

app.listen(parseInt(process.env.CLIENT_API_PORT), () => {
	console.log(`Client API listening on port ${process.env.CLIENT_API_PORT}`);
});
