# ws-automock-sandbox

Demonstration of how to perform a recording of websocket communication with a server.

Later, the recording is used to auto-mock the websocket communication when testing the client.

Auto-mocking benefits include

- Much faster and robust test execution
- No need to have the server running

```shell
npm install
```

## Terminal window 1

```shell
npm run start:server
```

## Terminal window 2

Create capture file for auto mocking in tests:

```shell
npm run test:capture
```

Run tests: open http://localhost:8080/mocha.html

## Terminal window 3

Run client:

```shell
npm run start:client
```
