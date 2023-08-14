import RabbitApp from './RabbitApp';
import Server from './Server';
import { parseRabbitMessage } from './utils';
import { nanoid } from 'nanoid';
import loger from './loger';

const log = loger.getLogger('Gateway');

class Gateway extends Server {
  _requests: any;
  _microservices: any;
  _consumersStarting: any;
  _consumersReady: any;

  constructor(options) {
    super({
      requests: {
        timeout: 10000,
      },
      ...options,
    });

    this._requests = new Map();
    this._microservices = options.microservices.reduce((object, name) => ({
      ...object,
      [name]: new RabbitApp({
        rabbit: options.rabbit,
        name,
      }),
    }), {});
  }

  async _startConsumers() {
    if (this._consumersStarting) {
      return;
    }

    this._consumersStarting = true;

    const connection = await this.createConnection();

    await Promise.all(
      Object.values(this._microservices).map(async (microservice: any) => {
        // reuse gateway connection for microservices
        microservice.connection = connection;

        const [channel] = await Promise.all([
          microservice.createChannelByPid({
            autoDelete: true,
          }),

          // prepare requests channel for delegate method
          microservice.createRequestsChannel(),
        ]);

        log.debug(`Gateway : starting to consume ${microservice.queuePidName}`);

        channel.consume(microservice.queuePidName, async (message) => {
          const json = parseRabbitMessage(message);

          if (!json) {
            channel.ack(message);

            return;
          }

          let { statusCode, response } = json;

          const { headers, requestId } = json;
          const request = this._requests.get(requestId);

          if (!request || !response) {
            channel.ack(message);

            return;
          }

          const { timer, res, resolve } = request;

          clearTimeout(timer);

          res.writeHead(statusCode, headers);
          res.end(typeof response === 'object' ? JSON.stringify(response) : response);

          log.debug(`Gateway : sending response to client: ${statusCode} ${typeof response === 'object' ? JSON.stringify(response) : response}`);

          resolve();
          channel.ack(message);

          this._requests.delete(requestId);
        });
      }),
    );

    this._consumersReady = true;
  }

  async delegate(name, req, res) {
      if (!this._consumersReady) {
        await this._startConsumers();
      }

      const microservice = this._microservices[name];

      if (!microservice) {
        const error = new Error(`Microservice ${name} not found`);
        log.error('Gateway : Error', error);
        throw error;
      }

      let resolve;

      const requestsChannel = await microservice.createRequestsChannel();
      const promise = new Promise(r => (resolve = r));

      const message = {
        path: (req.originalUrl || req.url).split('?')[0],
        method: req.method.toLowerCase(),
        params: req.params,
        query: req.query,
        body: req.body,
        headers: req.headers,
        cookies: req.cookies,
        session: req.session,
        connection: {
          connecting: req.connection.connecting,
          destroyed: req.connection.destroyed,
          localAddress: req.connection.localAddress,
          localPort: req.connection.localPort,
          pending: req.connection.pending,
          remoteAddress: req.connection.remoteAddress,
          remoteFamily: req.connection.remoteFamily,
          remotePort: req.connection.remotePort,
        },
        requestId: nanoid(),
        queue: microservice.queuePidName,
      };

      this._requests.set(message.requestId, {
        timer: setTimeout(() => {
          res.writeHead(408, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Timed out',
          }));

          this._requests.delete(message.requestId);
        }, this.options.requests.timeout),
        res,
        resolve,
      });

      log.debug(`Gateway : sending request to ${microservice.requestsQueueName}: ${JSON.stringify(message)}`);

      requestsChannel.sendToQueue(microservice.requestsQueueName, Buffer.from(JSON.stringify(message)));

      return promise;
    };


  async listen(port) {
    if (!this._consumersReady) {
      await this._startConsumers();
    }

    this.createServer(port);
  }
}

export default Gateway;