import http from 'http';
import cookieParser from 'cookie-parser';
import { prepareRequest, upgradeServerResponse } from './middlewares';
import BaseApp from './BaseApp';
import loger from './loger';

const log = loger.getLogger('Server');

class Server extends BaseApp {
  constructor(options = { name: 'test-app' }) {
    super(options);

    this.use(cookieParser());
    this.use(prepareRequest);
    this.use(upgradeServerResponse);
  }

  createServer(port) {
    log.debug(`starting to listen ${port} port`);

    return http
      .createServer((req, res) => this._next(req, res))
      .listen(port);
  }
}

export default Server;