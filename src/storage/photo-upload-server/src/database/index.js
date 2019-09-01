/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const utils = require('./utils');
const {newTransaction, newMutation} = require('./dbClient');

async function addPhoto(photoName, albumUID) {
    const query = utils.getAddPhotoQuery(photoName, albumUID);
    await createData(query);
}

async function getAlbumUID(albumName) {
    const query = utils.getAlbumUIDQuery();
    console.log(query);
    const vars = { $a: albumName };
    const res = await newTransaction().queryWithVars(query, vars);
    const albumNode= res.getJson();

    console.log("albumnode: ", albumNode);
    const albumUID = albumNode.all[0].uid;

    return albumUID;
}

// Create data using JSON.
async function createData(data) {
    // Create a new transaction.
    const txn = newTransaction();
    try {
        // Run mutation.
        const mu = newMutation();
        mu.setSetJson(data);
        const assigned = await txn.mutate(mu);

        // Commit transaction.
        await txn.commit();

        assigned.getUidsMap().forEach((uid, key) => console.log(`${key} => ${uid}`));
    } finally {
        // Clean up. Calling this after txn.commit() is a no-op
        // and hence safe.
        await txn.discard();
    }
}

module.exports = {addPhoto, getAlbumUID}