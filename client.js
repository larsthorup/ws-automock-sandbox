let ws;

const jobId = '4711'; // Note: eventually a UUID

const init = () => {
  document.querySelector('#submit-button').style.display = 'none';
  document.querySelector('#progress-indicator').style.display = 'none';
  document.querySelector('#result-indicator').style.display = 'none';
  document.querySelector('#submit-button').addEventListener('click', onSubmit);
  ws = new WebSocket('ws://localhost:8081');
  ws.onerror = () => {
    setConnectionStatus('Connection error');
  };
  ws.onopen = () => {
    setConnectionStatus('Connection being negotiated');
  };
  ws.onclose = () => {
    setConnectionStatus('Disconnected');
    ws = null;
  };
  ws.onmessage = ({ data }) => {
    console.log(data);
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

init();
