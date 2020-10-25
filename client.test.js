import './node_modules/chai/chai.js';
import { initClient } from './client.js';
import { WebSocketMockController } from './ws-automock.js';

const { expect } = window.chai;

// TODO: read from capture file
const recording = {
  messageList: [
    { message: { cmd: 'connected' }, send: false, label: 'connected' },
    { message: { cmd: 'job-request', id: '4711' }, send: true },
  ],
};

describe('client', function () {
  let screen;
  let wsMockController;

  beforeEach(function () {
    screen = document.querySelector('#fixture');
    wsMockController = new WebSocketMockController(window);
  });

  afterEach(function () {
    wsMockController.restore();
  });

  it('scenario', function () {
    // when: initialized
    initClient(screen);

    // then: page is rendered
    expect(screen.querySelector('h1').textContent).to.equal('Job Runner');

    // then: no submit button
    expect(screen.querySelector('#submit-button').style.display).to.equal(
      'none'
    );

    // then: websocket connection initiated
    expect(screen.querySelector('#connection-indicator').textContent).to.equal(
      'Connecting...' // TODO: Connection initiated
    );
    const ws = wsMockController.popConnection(recording);

    // when: server connects
    ws.playUntil('connected');

    // then: submit button is displayed
    expect(screen.querySelector('#submit-button').style.display).to.equal(
      'block'
    );

    // then: no progress indicator
    expect(screen.querySelector('#progress-indicator').style.display).to.equal(
      'none'
    );

    // when: click submit
    screen.querySelector('#submit-button').click();

    // then: progress indicator displayed
    expect(screen.querySelector('#progress-indicator').style.display).to.equal(
      'block'
    );
    expect(screen.querySelector('#progress-value').textContent).to.equal('0%');
  });
});
