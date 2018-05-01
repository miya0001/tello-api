'use strict'

const http = require('http');

const PORT = 8889;
const HOST = '192.168.10.1';

const dgram = require('dgram');
const client = dgram.createSocket('udp4');

http.createServer((req, res) => {
  if ('POST' === req.method) {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      sendCommand(JSON.parse(Buffer.concat(body).toString()));
    });
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end('{"status": "OK"}');
}).listen(8080);

const sendCommand = (data) => {
  if (data.queryResult) {
    var n = 0;
    if (data.queryResult.parameters.number) {
      n = parseInt(data.queryResult.parameters.number);
    }
    switch (data.queryResult.intent.displayName) {
      case "takeoff":
        sendMessage('command');
        sendMessage('takeoff');
        break;
      case "land":
        sendMessage('land');
        break;
      case "up":
        sendMessage('up ' + n);
        break;
      case "down":
        sendMessage('down ' + n);
        break;
      case "cw":
        sendMessage('cw ' + n);
        break;
      case "ccw":
        sendMessage('ccw ' + n);
        break;
    }
  }
}

const sendMessage = (command) => {
  console.log(command);
  const message = new Buffer(command);
  client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
  });
}
