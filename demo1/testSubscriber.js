/**
 * Tests broker for core functionalities
 */
var mqtt = require('mqtt');
var myId = '2002';

var connOptions = {
	port: 1883,
	host: 'localhost',
	keepalive: 10,
	clean: true,
	username: myId,
	clientId: myId,
    password: 'mySuperSecurePassword'
};

var client = mqtt.connect(connOptions);
var QOS = 1; // receive at most once

client.on('connect', function() {
	console.log('Client connected. Subcribing to topics..');
    client.subscribe(
        ['V1/HOME/+/DATA/TEMP', 'V1/HOME/+/CMD/#', 'V1/HOME/+/STATUS'],
        function(err, granted){
            if (err) {
                console.log('Failed to subscribe')
            } else {
                console.log('Waiting for data..')
            }
        }
        //'V1/HOME/+/TEMPERATURE'
    );
})

client.on('offline', function() {
	console.log('Client went offline');
})

client.on('message', function(topic, message, packet) {
	console.log('Received message on topic:', topic, 'message:', message.toString('utf8'));
})
