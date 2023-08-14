import { processenv } from 'processenv';
import express from 'express';
import Gateway from './Gateway';
import loger from './loger';

const log = loger.getLogger('M1');

const app = express();

const gateway = new Gateway({
  microservices: ['data'],
  rabbit: {
    url: process.env.RABBIT_URL,
  },
});

app.get('/status', async (req, res) => {
  await gateway.delegate('data', req, res);
});

const port = processenv('PORT');

log.info('M1 : listen port :', port);

app.listen(port);
