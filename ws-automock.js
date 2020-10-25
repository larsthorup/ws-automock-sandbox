const wsList = [];

class WebSocketMock {
  constructor(url) {
    wsList.push(this);
    this.nextMessageIndex = 0;
  }
  playUntil(expectedLabel) {
    while (this.nextMessageIndex < this.recording.messageList.length) {
      const { label, message, send } = this.recording.messageList[
        this.nextMessageIndex
      ];
      const data = JSON.stringify(message);
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
      const { message, send } = this.recording.messageList[
        this.nextMessageIndex
      ];
      const expectedData = JSON.stringify(message);
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
