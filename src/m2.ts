import MicroService from './MicroService'
import loger from './loger';

const log = loger.getLogger('M2');

const app = new MicroService({
  name: 'data',
  rabbit: {
    url: process.env.RABBIT_URL,
  },
});

app.all('/status', (req, res) => {
  res.json({
    text: 'Thinking...',
  });
});

log.info('M2 : start');

app.start();
