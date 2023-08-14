import methods from 'methods';
import { pathToRegexp } from 'path-to-regexp';
import RabbitApp from './RabbitApp';
import { toArray } from './utils';

class BaseApp extends RabbitApp {
  _handlers: any;
  _middlewares: any;

  constructor(options) {
    super(options);

    this._handlers = new Map();
    this._middlewares = [];
  }

  _next(req, res, idx = -1) {
    if (this._middlewares.length > idx + 1) {
      const { match, fn } = this._middlewares[idx + 1];

      return match(req)
        ? fn(req, res)
        : this._next(req, res, idx + 1);
    }
  }

  _createEndpoint(path, method, ...middlewares) {
    const paths = path && toArray(path).map((path) => {
      const keys = [];

      return {
        regex: pathToRegexp(path, keys),
        keys,
      };
    });

    middlewares.forEach((middleware) => {
      const idx = this._middlewares.length;

      this._middlewares.push({
        match: (req) => {
          const pathMatch = !paths || paths.find(path => path.regex.test(req.path));
          const methodMatch = !method || req.method === method;

          if (typeof pathMatch === 'object') {
            req.params = {
              ...req.params,
              ...req.path.match(pathMatch.regex).slice(1).reduce((object, value, index) => {
                const { name } = pathMatch.keys[index];

                return name ? { ...object, [name]: value } : object;
              }, {}),
            };
          }

          return pathMatch && methodMatch;
        },
        fn: (req, res) => middleware(req, res, () => this._next(req, res, idx)),
      });
    });
  }

  on(event, handler) {
    this._handlers.set(event, handler);

    return this;
  }

  emit(event, ...args) {
    const handler = this._handlers.get(event);

    if (!handler) {
      console.error(`Emitting on not found handler was ignored (${event})`);

      return;
    }

    handler(...args);

    return this;
  }

  use(...middlewares) {
    this._createEndpoint(undefined, undefined, ...middlewares);

    return this;
  }

  all(path, ...middlewares) {
    this._createEndpoint(path, undefined, ...middlewares);

    return this;
  }
}

methods.forEach((method) => {
  BaseApp.prototype[method] = function(path, ...middlewares) {
    this._createEndpoint(path, method, ...middlewares);

    return this;
  };
});

export default BaseApp;