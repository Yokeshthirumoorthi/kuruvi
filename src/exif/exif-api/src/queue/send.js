#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

const {EXIF_QUEUE_ENDPOINT} = require('../common/config');

const QUEUE_CONNECTION_STRING = `amqp://${EXIF_QUEUE_ENDPOINT}`;

function createQueue(exififyAlbumRequest) {
    amqp.connect(QUEUE_CONNECTION_STRING, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
    
            var queue = exififyAlbumRequest.albumName;
            var msgs = exififyAlbumRequest.photos;
    
            channel.assertQueue(queue, {
                durable: true,
                autoDelete: true
            });

            msgs.map(msg => {
                channel.sendToQueue(queue, Buffer.from(msg), {
                    persistent: true
                });
                console.log(" [x] Sent %s", msg);
            })
            
        });
        // setTimeout(function() {
        //     connection.close();
        //     process.exit(0);
        // }, 5000);
    });
}

module.exports = {createQueue}