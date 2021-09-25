# ws-automock-sandbox

Demonstration of how to perform a recording of websocket communication with a server.

Later, the recording is used to auto-mock the websocket communication when testing the client.

Auto-mocking benefits include

- Much faster and robust test execution
- No need to have the server running

```shell
npm install
```

## Run server (terminal 1)

```shell
npm run start:server
```

## Capture test (terminal 2)

Create capture file for auto mocking in tests:

```shell
npm run test:capture
```

## Client and client test (terminal 3)

Server front-end:

```shell
npm run start:client
```

Run tests: open http://localhost:8080/mocha.html

Run client: http://localhost:8080/
