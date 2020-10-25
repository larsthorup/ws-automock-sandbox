const wsList = [];

class WebSocketMock {
  constructor(url) {
    wsList.push(this);
    this.nextMessageIndex = 0;
  }
  playUntil(expectedLabel) {
    while (this.nextMessageIndex < this.recording.messageList.length) {
      const { label, data, send } = this.recording.messageList[
        this.nextMessageIndex
      ];
      if (!send) {
        console.log('wsAutoMock: WebSocketMock: play: ', data);
        this.onmessage({ data });
        ++this.nextMessageIndex;
        if (label === expectedLabel) break;
      } else {
        throw new Error(
          `Expected send("${data}") but got playUntil("${expectedLabel}")`
        );
      }
    }
  }
  send(data) {
    if (this.nextMessageIndex < this.recording.messageList.length) {
      const { data: expectedData, send } = this.recording.messageList[
        this.nextMessageIndex
      ];
      if (send) {
        // TODO: deep equality
        if (expectedData === data) {
          console.log('wsAutoMock: WebSocketMock: send', data);
          ++this.nextMessageIndex;
        } else {
          throw new Error(
            `Expected send("${expectedData}") but got send("${data}")`
          );
        }
      } else {
        throw new Error(
          `Expected play("${expectedData}"), but got send("${data}")`
        );
      }
    } else {
      throw new Error(`Expected no more calls, but got send("${data}")`);
    }
  }
}

export class WebSocketMockController {
  constructor(theWindow) {
    this.saved = {
      WebSocket: theWindow.WebSocket,
    };
    theWindow.WebSocket = WebSocketMock;
    console.log('wsAutoMock: WebSocket: mocked');
  }
  restore() {
    window.WebSocket = this.saved.WebSocket;
    console.log('wsAutoMock: WebSocket: restored');
  }
  popConnection(recording) {
    const wsMock = wsList.pop();
    wsMock.recording = recording;
    return wsMock;
  }
}

export class WebSocketRecorder {
  constructor(ws) {
    this.ws = ws;
    this.messageList = [];
    ws.onmessage = ({ data }) => {
      const { expector, messageList } = this;
      const { messageSubset, label, resolve } = expector;
      console.log('receiving', data);
      const message = JSON.parse(data);
      if (message.cmd === messageSubset.cmd) {
        console.log('match', label);
        messageList.push({ data, send: false, label });
        resolve();
      } else {
        messageList.push({ data, send: false });
      }
    };
  }

  send(data) {
    const { messageList, ws } = this;
    console.log('sending', data);
    messageList.push({ data, send: true });
    ws.send(data);
  }

  getRecording() {
    const { messageList } = this;
    return JSON.stringify({ messageList }, null, 2);
  }

  async waitFor(messageSubset, label) {
    return new Promise((resolve) => {
      this.expector = { messageSubset: messageSubset, label, resolve };
    });
  }
}
