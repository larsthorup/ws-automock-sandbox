import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8081 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(payload) {
    const message = JSON.parse(payload);
    console.log('received', message);
    switch (message.cmd) {
      case 'job-request':
        onJobRequest(ws, message);
        break;
    }
  });
  console.log('client connected');
  ws.send(JSON.stringify({ cmd: 'connected' }));
});

const onJobRequest = (ws, { id }) => {
  calculate(ws, id, 0);
};

const calculate = (ws, id, fraction) => {
  if (fraction < 1) {
    ws.send(JSON.stringify({ cmd: 'job-progress', id, fraction }));
    setTimeout(() => calculate(ws, id, fraction + 0.1), 400);
  } else {
    ws.send(JSON.stringify({ cmd: 'job-result', id, result: 42 }));
  }
};

console.log('listening');
