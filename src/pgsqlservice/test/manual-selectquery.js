/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const dbquery = require('../src/dbquery');

async function run() {
    const photoDetails = await dbquery.getCompletePhotoDetails(1);
    console.log(photoDetails);
}

run();