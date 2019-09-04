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

async function getPhotoUID(photoName) {
    const query = `query photo($a: string) {
        all(func: eq(name, $a)) {
            uid
        }
    }`; 
    const vars = { $a: photoName };
    const res = await newTransaction().queryWithVars(query, vars);
    const photoNode= res.getJson();

    console.log("Photonode: ", photoNode);
    const photoUID = photoNode.all[0].uid;

    return photoUID;
}

async function addTagNode(tagName, albumUID, photos) {
    const tagPhotoRel = await Promise.all(photos.map(async photo => {
        const photoUID = await getPhotoUID(photo);
        return {
            "uid": "_:tag", 
            "photos": {
                "uid": photoUID
            }
        }
    }));
    const query = [{
        "uid": "_:tag",
        "name": tagName
    },
    {
        "uid": albumUID,
        "tag": {
            "uid": "_:tag"
        }
    }, ...tagPhotoRel];
    console.log("Add tag node query", query);
    await createData(query);
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

async function getAlbumDetails(albumName) {
    const query = utils.getAlbumDetailsQuery();
    console.log(albumName);
    console.log(query);
    const vars = { $a: albumName };
    const res = await newTransaction().queryWithVars(query, vars);
    const albumNode= res.getJson();

    console.log("albumnode: ", albumNode);
    if(albumNode.all.length > 0) {
        return albumNode.all[0];
    }

    return ''; 
}

module.exports = {getAlbumDetails, addTagNode}