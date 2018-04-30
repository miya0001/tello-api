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

function sendCommand(data) {
  switch (data.queryResult.intent.displayName) {
    case "takeoff":
      sendMessage('command');
      sendMessage('takeoff');
      break;
    case "land":
      sendMessage('land');
      break;
  }
}

function sendMessage(command) {
	const message = new Buffer(command);
	client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
		if (err) throw err;
	});
}
