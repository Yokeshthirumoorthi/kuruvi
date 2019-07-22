/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const rpc = require('../src/rpc');

const boundingBoxRow = {
    photoId: 2,
    x: 1,
    y: 2,
    width: 12345,
    height: 12345
}

const photoDetail = {
    photo: {
        id: 1,
        name: 'test.png'
    },
    boundingBoxes: [ { x: 986, y: 84, width: 125, height: 125 },
                    { x: 202, y: 133, width: 116, height: 116 },
                    { x: 465, y: 150, width: 113, height: 113 },
                    { x: 717, y: 134, width: 111, height: 111 } ] 
}

function run() {
    const call = {
        request: photoDetail
    };
    const callback = (err, res) => console.log(res);
    rpc.saveBoundingBoxes(call, callback);
}

run();