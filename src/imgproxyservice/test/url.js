const URL = require('../src/url');
const assert = require('assert');

describe('URL', function() {

    it('should return caddy url', function() {
        const photoFSDetails = {
            album: 'album1',
            photo: 'bbt1.jpg'
        };
        const expectedURL = 'http://caddy-fs:2015/album1/bbt1.jpg'; 
        assert.equal(URL.getCaddyURL(photoFSDetails), expectedURL);
    });

});
