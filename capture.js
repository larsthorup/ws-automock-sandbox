import fs from 'fs';
import WebSocket from 'ws';
import { WebSocketRecorder } from './ws-automock.js';

const capturing = async () => {
  const ws = new WebSocket('ws://localhost:8081');
  try {
    const wsRecorder = new WebSocketRecorder(ws);
    await wsRecorder.waitFor({ cmd: 'connected' }, 'connected');
    wsRecorder.send(JSON.stringify({ cmd: 'job-request', id: '4711' }));
    await wsRecorder.waitFor({ cmd: 'job-progress' }, 'progress');
    await wsRecorder.waitFor({ cmd: 'job-result' }, 'result');
    fs.mkdirSync('output', { recursive: true });
    fs.writeFileSync('output/recording.json', wsRecorder.getRecording());
  } catch (ex) {
    console.error(ex);
  } finally {
    ws.close();
  }
};

capturing().catch(console.error);
