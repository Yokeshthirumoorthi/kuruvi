#!/usr/bin/env node
/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */


// if (require.main === module) {
//     // If this is run as a script, start a server on an unused port
//     console.log("Workflow started");
//     const message = {
//         albumName: 'test-album', 
//         photoName: 'bbt5.jpg'
//     }
//     initWorkFlow(message);
// }

var amqp = require('amqplib/callback_api');
const {initWorkFlow} = require('./src/services');
const {QUEUE_ENDPOINT} = require('./src/common/config');
const QUEUE_CONNECTION_STRING = `amqp://${QUEUE_ENDPOINT}`;

amqp.connect(QUEUE_CONNECTION_STRING, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'workflow_queue';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            const message = JSON.parse(msg.content);
            console.log(" [x] Received %s", message);
            initWorkFlow(message);
        }, {
            noAck: true
        });
    });
});