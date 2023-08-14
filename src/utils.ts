export const toArray = value => Array.isArray(value) ? value : [value];
export const isRpcAction = message => typeof message === 'object' && typeof message.server === 'object' && typeof message.server.action === 'string';

export const parseRabbitMessage = (message) => {
  if (!message) {
    return;
  }

  const content = message.content.toString();

  if (!content) {
    return;
  }

  let json;

  try {
    json = JSON.parse(content);
  } catch (err) {
    console.error('Cannot parse rabbit message', err);
  }

  return json;
};