const wsList = [];

class WebSocketMock {
  constructor(url) {
    wsList.push(this);
  }
}

class WebSocketMockController {
  constructor(theWindow, recording) {
    this.saved = {
      WebSocket: theWindow.WebSocket,
    };
    this.recording = recording;
    this.nextMessageIndex = 0;
    theWindow.WebSocket = WebSocketMock;
    console.log('wsAutoMock: WebSocket: mocked');
  }
  restore() {
    window.WebSocket = this.saved.WebSocket;
    console.log('wsAutoMock: WebSocket: restored');
  }
  popConnection() {
    return wsList.pop();
  }
  playUntil(ws, expectedLabel) {
    console.log(this.recording);
    while (this.nextMessageIndex < this.recording.messageList.length) {
      const { label, message } = this.recording.messageList[
        this.nextMessageIndex
      ];
      const data = JSON.stringify(message);
      console.log('wsAutoMock: play: ', data);
      ws.onmessage({ data });
      if (label === expectedLabel) break;
      ++this.nextMessageIndex;
    }
  }
}

export const wsAutoMock = (recording) => {
  return new WebSocketMockController(window, recording);
};
