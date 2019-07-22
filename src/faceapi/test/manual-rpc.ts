/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

import * as RPC from '../src/rpc';

async function getBoundingBoxes() {
    const photoDetails = {
        album: {
            name: 'album1',
            path: './images'
        },
        photo: {
            name: 'bbt1.jpg',
            albumId: 1
        }
    };
    const newPhotoDetails = await RPC.getBoundingBoxes(photoDetails);
    console.log(newPhotoDetails);
}

getBoundingBoxes();