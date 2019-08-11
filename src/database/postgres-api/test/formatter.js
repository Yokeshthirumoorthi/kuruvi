/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const formatter = require('../src/formatter');
const assert = require('assert');

describe('Formatter', function () {
    it('should return album row', function () {
        const albumRow = {
            name: 'test_album',
            path: 'test_path'
        };
        const actual = formatter.getAlbumRowValues(albumRow);
        const expected = ['test_album', 'test_path'];
        assert.deepEqual(actual, expected);
    });
    it('should return bounding boxes rows', function () {
        const photoDetail = {
            photo: {
                id: 1,
                name: 'test.png'
            },
            boundingBoxes: [{ x: 986.0000000000001, y: 84, width: 125, height: 125 },
            { x: 202, y: 133, width: 116, height: 116 },
            { x: 465.00000000000006, y: 150, width: 113, height: 113 },
            { x: 717, y: 134, width: 111, height: 111 }]
        }
       const actual = formatter.generateBoundingBoxesRows(photoDetail);
       const expected = [{ photoId: 1, x: 986.0000000000001, y: 84, width: 125, height: 125 },
            { photoId: 1, x:202, y: 133, width: 116, height: 116 },
            { photoId: 1, x: 465.00000000000006, y: 150, width: 113, height: 113 },
            { photoId: 1, x: 717, y: 134, width: 111, height: 111 }] 
        assert.deepEqual(actual, expected);
    })
});