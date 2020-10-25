const WebSocket = require('ws');

let expector;

const ws = new WebSocket('ws://localhost:8081');

ws.onmessage = ({ data }) => {
  const message = JSON.parse(data);
  console.log(message);
  if (message.cmd === expector.messageSubset.cmd) {
    console.log('match', expector.label);
    expector.resolve();
  }
};

const waitFor = async (messageSubset, label) => {
  return new Promise((resolve) => {
    expector = { messageSubset: messageSubset, label, resolve };
  });
};

const capturing = async () => {
  await waitFor({ cmd: 'connected' }, 'connected');
  ws.send(JSON.stringify({ cmd: 'job-request', id: '4711' }));
  await waitFor({ cmd: 'job-progress' }, 'progress');
  await waitFor({ cmd: 'job-result' }, 'result');
};

capturing()
  .catch(console.error)
  .finally(() => {
    ws.close();
  });
