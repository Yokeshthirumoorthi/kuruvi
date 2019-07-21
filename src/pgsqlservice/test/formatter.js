/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const formatter= require('../src/formatter');
const assert = require('assert');

describe('Formatter', function() {
    it('should return album row', function() {
        const albumRow = {
            name: 'test_album',
            path: 'test_path'
        };
        const actual = formatter.getAlbumRowValues(albumRow);
        const expected = ['test_album', 'test_path']; 
        assert.deepEqual(actual, expected);
    });
});