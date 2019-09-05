/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const {newTransaction} = require('./dbClient');

// Query for data.
async function queryData(albumName) {
    // Run query.
    const query = `query all($a: string) {
        all(func: eq(name, $a)) {
            uid
            name
            photos {
                name
                exif {
                    expand(_all_)
                }
            }
            tag {
                name
                photos {
                    uid
                    name
                }
            }
        }
    }`;
    const vars = { $a: albumName };
    const res = await newTransaction().queryWithVars(query, vars);
    const ppl = res.getJson();
    console.log("Dgraph result: ", ppl);
    return ppl;
}

module.exports = {queryData}