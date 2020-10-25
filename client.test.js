import './node_modules/chai/chai.js';
import { initClient } from './client.js';
import { wsAutoMock } from './ws-automock.js';

const { expect } = window.chai;

// TODO: read from capture file
const recording = {
  messageList: [{ message: { cmd: 'connected' }, label: 'connected' }],
};

describe('client', function () {
  let screen;
  let wsMockController;

  beforeEach(function () {
    screen = document.querySelector('#fixture');
    wsMockController = wsAutoMock(recording);
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
    const ws = wsMockController.popConnection(); // TODO: pass recording here

    // when: server connects
    wsMockController.playUntil(ws, 'connected');

    // then: submit button is displayed
    expect(screen.querySelector('#submit-button').style.display).to.equal(
      'block'
    );
  });
});
