#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const {EXIF_QUEUE_ENDPOINT} = require('../common/config');

const QUEUE_CONNECTION_STRING = `amqp://${EXIF_QUEUE_ENDPOINT}`;

function runQueueForAlbum(albumName) {
    amqp.connect(QUEUE_CONNECTION_STRING, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
    
            var queue = albumName;
    
            channel.assertQueue(queue, {
                durable: true,
                autoDelete: true
            });
    
            channel.prefetch(1);

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    
            channel.consume(queue, function(msg) {
                console.log(" [x] Received %s", msg.content.toString());
                setTimeout(function() {
                    console.log(" [x] Done");
                    channel.ack(msg);
                }, 1000);
            }, {
                noAck: false
            });
        });
    });
}

module.exports = {runQueueForAlbum}
