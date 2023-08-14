import amqplib from 'amqplib';
import loger from './loger';

const log = loger.getLogger('RabbitApp');

class RabbitApp {
  options: any;
  requestsQueueName: any;
  responsesQueueName: any;
  _connection: any;
  responsesChannel: any;
  requestsChannel: any;
  pidChannel: any;

  constructor(options) {
    this.options = options;

    this.requestsQueueName = `${this.options.name}:requests`;
    this.responsesQueueName = `${this.options.name}:responses`;
  }

  set connection(connection) {
    this._connection = connection;
  }

  get connection() {
    return this._connection;
  }

  get queuePidName() {
    return `${this.responsesQueueName}-${process.pid}`;
  }

  async createConnection() {
    if (!this.connection) {
      log.debug('RabbitApp : creating connection');

      this.connection = await amqplib.connect(this.options.rabbit.url);

      ['error', 'close'].forEach((event) => {
        this.connection.on(event, () => {
          this.connection = null;
          this.createConnection();
        });
      });
    }

    return this.connection;
  }

  async createChannel(queueName) {
    const connection = await this.createConnection();
    const channel = await connection.createChannel();

    log.debug(`RabbitApp : creating channel and asserting to ${queueName} queue`);

    if (queueName) {
      await channel.assertQueue(queueName, this.options);
    }

    return channel;
  }

  async createResponsesChannel() {
    if (!this.responsesChannel) {
      this.responsesChannel = await this.createChannel(this.responsesQueueName);
    }

    return this.responsesChannel;
  }

  async createRequestsChannel() {
    if (!this.requestsChannel) {
      this.requestsChannel = await this.createChannel(this.requestsQueueName);
    }

    return this.requestsChannel;
  }

  async createChannelByPid() {
    if (!this.pidChannel) {
      this.pidChannel = await this.createChannel(this.queuePidName);
    }

    return this.pidChannel;
  }
}

export default RabbitApp;