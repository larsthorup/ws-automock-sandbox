import './node_modules/chai/chai.js';
import { initClient } from './client.js';
import { WebSocketMockController } from './ws-automock.js';

const { expect } = window.chai;

describe('client', function () {
  let recording;
  let screen;
  let wsMockController;

  beforeEach(async function () {
    recording = await (await fetch('/output/recording.json')).json();
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
    const wsMock = wsMockController.popConnection(recording);

    // when: server connects
    wsMock.playUntil('connected');

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

    // when: server reports progress
    wsMock.playUntil('progress');

    // then: progress indicator display updated
    expect(screen.querySelector('#progress-value').textContent).to.equal('0%');

    // TODO: wsMock.playNext();
    // TODO: increasing progress value

    // when: server reports result
    wsMock.playUntil('result');

    // then: progress indicator not displayed
    expect(screen.querySelector('#progress-indicator').style.display).to.equal(
      'none'
    );

    // then: result is displayed
    expect(screen.querySelector('#result-indicator').style.display).to.equal(
      'block'
    );
    expect(screen.querySelector('#result-value').textContent).to.equal('42');
  });
});
