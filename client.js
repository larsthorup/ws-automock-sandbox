let ws;

const jobId = '4711'; // Note: eventually a UUID

export const initClient = (rootElement) => {
  rootElement.innerHTML = `
    <h1>Job Runner</h1>
    <p id="connection-indicator">Connecting...</p>
    <button id="submit-button">Submit</button>
    <p id="progress-indicator">Progress: <span id="progress-value"></span></p>
    <p id="result-indicator">Result: <span id="result-value"></span></p>
  `;
  document.querySelector('#submit-button').style.display = 'none';
  document.querySelector('#progress-indicator').style.display = 'none';
  document.querySelector('#result-indicator').style.display = 'none';
  document.querySelector('#submit-button').addEventListener('click', onSubmit);
  ws = new window.WebSocket('ws://localhost:8081');
  ws.onerror = () => {
    setConnectionStatus('Connection error');
  };
  ws.onopen = () => {
    setConnectionStatus('Connection initiated');
  };
  ws.onclose = () => {
    setConnectionStatus('Disconnected');
    ws = null;
  };
  ws.onmessage = ({ data }) => {
    console.log('client: received:', data);
    const message = JSON.parse(data);
    switch (message.cmd) {
      case 'connected':
        setConnectionStatus('Connected');
        document.querySelector('#submit-button').style.display = 'block';
        break;
      case 'job-progress':
        setProgressValue(message.fraction);
        break;
      case 'job-result':
        document.querySelector('#progress-indicator').style.display = 'none';
        document.querySelector('#result-indicator').style.display = 'block';
        document.querySelector(
          '#result-value'
        ).textContent = message.result.toString();
        break;
    }
  };
};

const setConnectionStatus = (textContent) => {
  console.log('connection status', textContent);
  document.querySelector('#connection-indicator').textContent = textContent;
};

const setProgressValue = (fraction) => {
  console.log('progress', fraction);
  document.querySelector('#progress-value').textContent = `${Math.trunc(
    fraction * 100
  )}%`;
};

const onSubmit = () => {
  setProgressValue(0);
  document.querySelector('#progress-indicator').style.display = 'block';
  ws.send(JSON.stringify({ cmd: 'job-request', id: jobId }));
};
