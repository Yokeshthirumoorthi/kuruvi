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

    it('should return imgproxy url', function() {
        const caddyURL = 'http://caddy-fs:2015/album1/bbt1.jpg'; 
        const expectedURL = 'http://imgproxy:8080/m59fe9lQDYTGgWSVCqlMlFfxw7d43Q4nvL1ZjXCbk_g/fill/300/300/no/1/aHR0cDovL2NhZGR5LWZzOjIwMTUvYWxidW0xL2JidDEuanBn.png';
        assert.equal(URL.getImgProxyPhotoResizeURL(caddyURL), expectedURL);
    });
});
