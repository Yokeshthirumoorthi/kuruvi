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

var amqp = require('amqplib/callback_api');
const {initWorkFlow} = require('./src/services');
const staticGen = require('./src/services/static-gen');
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
            if (message.albumName === '' && message.photoName === '') {
                staticGen.buildHugo();
            } else {
                initWorkFlow(message);
            }
        }, {
            noAck: true
        });
    });
});