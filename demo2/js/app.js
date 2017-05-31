var hostname = "iot.eclipse.org";
var port = 443;
var clientId = "Demo112358";
var path = "/ws";
var tls = true;
var cleanSession = true;

var client = new Paho.MQTT.Client(hostname, Number(port), path, clientId);

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

$("#connection-status").hide();

// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Connected to broker!");
    $("#disconnect-button").toggleClass("disabled");

    var topic1 = "V1/HOME/1001/DATA/+";

    console.info('Subscribing to: Topic: ', topic1);
    client.subscribe(topic1, {qos: 1});

    var topic2 = "V1/HOME/1001/STATUS/+";
    client.subscribe(topic2, {qos: 1});
}

function onFail() {
    console.log("failed to connect")
    $("#connect-button").toggleClass("disabled");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    $("#connect-button").toggleClass("disabled");
    $("#disconnect-button").toggleClass("disabled");
    console.log("onConnectionLost:"+responseObject.errorMessage);
}

function arrayToUint32(array) {
    return array[0] + array[1]*256 + array[2]*65536 + array[3] * 16777216;
}
function celciusToFahrenheit(vc) {
    return Math.round((vc*9/5 + 32));
}
// called when a message arrives
function onMessageArrived(message) {
    console.log('Message Recieved: Topic: ', message.destinationName, '. Payload: ', message.payloadBytes);
    if (message.destinationName.indexOf("TEMP") >= 0) {
        var temp =  celciusToFahrenheit(arrayToUint32(message.payloadBytes)/100);
        console.log("Temp message: " + temp)
        $("#temperature").text(temp + "");
        if ( $("#connection-status").is(":visible") ){
            console.log("Hiding element")
            $("#connection-status").hide("slow");
        }

    } else if (message.destinationName.indexOf("NICOTINE") >= 0) {
        var nicotine = Math.round(arrayToUint32(message.payloadBytes)/10)
        console.log("Nicotine message: " + nicotine)
        $("#nicotine-level").text(nicotine + "");
    } else if (message.destinationName.indexOf("OFFLINE") >= 0) {
        console.log("Lost connection to device")
        $("#connection-status").show("slow");
        $("#temperature").text("---");
        $("#nicotine-level").text("---");
    }
}

$("#connect-button").click(function() {
    // setup connection options
    var options = {
        invocationContext: {host : hostname, port: port, path: client.path, clientId: clientId},
        keepAliveInterval: 60,
        cleanSession: cleanSession,
        useSSL: tls,
        onSuccess: onConnect,
        onFailure: onFail
    };

    // connect the client
    client.connect(options);
    $("#connect-button").toggleClass("disabled");
})

$("#disconnect-button").click(function() {
    // disconnect the client
    client.disconnect();
})

$("#red-led-button").click(function() {
    // send command
    var topic = "V1/HOME/1001/LED/RED";

    var message = new Paho.MQTT.Message("");
    message.destinationName = topic;
    message.qos = 1;
    message.retained = false;
    client.send(message);
})


$("#blue-led-button").click(function() {
    // send command
    var topic = "V1/HOME/1001/LED/BLUE";

    var message = new Paho.MQTT.Message("");
    message.destinationName = topic;
    message.qos = 1;
    message.retained = false;
    client.send(message);
})

$("#green-led-button").click(function() {
    // send command
    var topic = "V1/HOME/1001/LED/GREEN";

    var message = new Paho.MQTT.Message("");
    message.destinationName = topic;
    message.qos = 1;
    message.retained = false;
    client.send(message);
})
