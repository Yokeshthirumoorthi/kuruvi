/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const {initWorkFlow} = require('./src/services');


if (require.main === module) {
    // If this is run as a script, start a server on an unused port
    console.log("Workflow started");
    const message = {
        albumName: 'test-album', 
        photoName: 'bbt5.jpg'
    }
    initWorkFlow(message);
}