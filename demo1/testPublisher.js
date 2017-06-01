/**
 * Tests broker for core functionalities
 */
var mqtt = require('mqtt');
var myId = '2001';

var connOptions = {
	port: 1883,
	host: 'localhost',
	keepalive: 10,
	clean: true,
	username: myId,
	clientId: myId,
    password: 'mySuperSecurePassword',
    will: { // last will testament
        topic: 'V1/HOME/' + myId + '/STATUS',
        payload: new Buffer('I lost connection :\'(')
    }
};

var client = mqtt.connect(connOptions);
var pubInterval;
var count = 0;

client.on('connect', function() {
	console.log('Client connected');
    if (pubInterval) {
        clearInterval(pubInterval);
    }
    pubInterval = setInterval(function(){
        count++;

        console.log('Publishing data', count)
        client.publish(
            'V1/HOME/' + myId + '/DATA/TEMP',
            new Buffer('My count ' + count),
            {
                qos : 1,
                retain: false
            }
        );
    }, 2000);
})

client.on('offline', function() {
	console.log('Client went offline');
    if (pubInterval) {
        clearInterval(pubInterval);
    }
})
