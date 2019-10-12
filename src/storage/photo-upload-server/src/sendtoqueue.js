#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const {QUEUE_ENDPOINT} = require('./common/config');
const QUEUE_CONNECTION_STRING = `amqp://${QUEUE_ENDPOINT}`;

function initWorkFlow(message) {
    amqp.connect(QUEUE_CONNECTION_STRING, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'workflow_queue';
            // const msg = {
            //     albumName: 'test-album', 
            //     photoName: 'bbt5.jpg'
            // }
            var msgs = message.photos.map(
                photoName => {
                    return {
                        albumName: message.albumName,
                        photoName: photoName
                    }
                }
            );

            channel.assertQueue(queue, {
                durable: false
            });

            msgs.map(msg => {
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));

                console.log(" [x] Sent %s", msg);
            });
        });
    })
}

module.exports = {initWorkFlow}