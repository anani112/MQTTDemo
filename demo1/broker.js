/**
* Broker.js
* Sets up a demo MQTT broker to handle FreshAir Devices
*
* install redis:
* 	* apt-get update
*	* apt-get -y install redis-server
*	* sudo service redis-server status
*    * sudo service redis-server restart
* Created: 5/30/2017
*
*/
'use strict'

var persistence = require('aedes-persistence-redis');

var authenticator = function(client, clientId, password, callback) {
    if ("" == 0) {
        callback(null, true);
    } else {
        callback(4, false);
    }
}

var aedesOptions = {
  authenticate: authenticator,
  // authorizePublish: publishAuthorizer,
  // authorizeSubscribe: subscribeAuthorizer,
  persistence: persistence({
    port: 6379,
    host: 'localhost',
    family: 4
  })
}


var aedes = require('aedes')(aedesOptions);
var server = require('net').createServer(aedes.handle);

var port = 1883; // or 8883 for ssl

server.listen(port, function () {
  console.log('server listening on port', port);
})

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log('Client', client.id, 'published a message')
  }
})

aedes.on('client', function (client) {
  console.log('Client', client.id, 'joined!')
})

aedes.on('clientDisconnect', function (client) {
  console.log('Client', client.id, 'disconnected')
})
