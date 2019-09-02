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
const {STORAGE_QUEUE_ENDPOINT} = require('./common/config');
const services = require('./services');
const QUEUE_CONNECTION_STRING = `amqp://${STORAGE_QUEUE_ENDPOINT}`;

function runServices(message, sendAckToQueue) {
    console.log(" [x] Received %s", message);
    services.savePhoto(message, sendAckToQueue)
}

/**
 * Consume each message in queue and 
 * do the grpc call to extract exif
 * and save it in database.
 * @param {*} albumName The queue name
 */
function consumeQueue(albumName, callback) {
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
    
            channel.consume(queue, async function(msg) {
                const message = JSON.parse(msg.content);
                if (message.albumName === '' && message.photoName === '') {
                    callback(null, () => {});
                } else {
                    const sendAckToQueue = () => channel.ack(msg);
                    runServices(message, sendAckToQueue)
                }
            }, {
                noAck: false
            });
        });
    });
}

/**
 * 
 * Add each message to the queue
 * @param {*} albumName the queue name
 * @param {*} msgs list of photoname along with albumname as json array
 */
function sendToQueue(albumName, msgs) {
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

            msgs.map(msg => {
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
                    persistent: true
                });
                console.log(" [x] Sent %s", msg);
            })

         });
    });
}

/**
 * With the given album and the list of photos in it,
 * this function adds each photoname (with albumname)
 * to the queue. Also, it starts the queue consumer
 * logic. The queue consumer treats each message one
 * after the other and ensures exif if extracted for
 * all the photos in the album
 * @param {*} call Json object with albumname and list of photonames in it
 */
function runSaveFolderDetailsUsingQueue(call, callback) {
    console.log("Inside save folder details using queue",call.request);
    const requestMessage = call.request;
    const albumName = requestMessage.albumName;
    var msgs = requestMessage.photos.map(
        photoName => {
            return {
                albumName: albumName,
                photoName: photoName
            }
        }
    );
    const endMessage = {
        albumName: '',
        photoName: ''
    };
    sendToQueue(albumName, [...msgs, endMessage]);
    consumeQueue(albumName, callback);
}


module.exports = {runSaveFolderDetailsUsingQueue}
