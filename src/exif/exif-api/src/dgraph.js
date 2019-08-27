const dgraph = require("dgraph-js");
const grpc = require("grpc");
const {EXIF_DGRAPH_ENDPOINT} = require("./common/config");

console.log(EXIF_DGRAPH_ENDPOINT)
// Create a client stub.
function newClientStub() {
    return new dgraph.DgraphClientStub(EXIF_DGRAPH_ENDPOINT,grpc.credentials.createInsecure());
}

// Create a client.
function newClient(clientStub) {
    return new dgraph.DgraphClient(clientStub);
}

const dgraphClientStub = newClientStub();
const dgraphClient = newClient(dgraphClientStub);

// Drop All - discard all data and start from a clean slate.
async function dropAll(dgraphClient) {
    const op = new dgraph.Operation();
    op.setDropAll(true);
    await dgraphClient.alter(op);
}

// Set schema.
async function setSchema(dgraphClient) {
    const schema = `
        name: string @index(term) .
    `;
    const op = new dgraph.Operation();
    op.setSchema(schema);
    await dgraphClient.alter(op);
}

async function addPhoto(photoName, albumUID) {
    const query = [{
            "uid": "_:photo",
            "name": photoName
        },
        {
            "uid": albumUID,
            "photos": {
                "uid": "_:photo"
            }
        }];
    
    createData(query);
}

async function getPhotoUID(photoName) {
    const query = `query photo($a: string) {
        all(func: eq(name, $a)) {
            uid
        }
    }`; 
    const vars = { $a: photoName };
    const res = await dgraphClient.newTxn().queryWithVars(query, vars);
    const photoNode= res.getJson();

    console.log("Photonode: ", photoNode);
    const photoUID = photoNode.uid;

    return photoUID;
}

async function addExif(exif, photoUID) {
    const query = [{
        "uid": "_:exif",
        ...exif
    },
    {
        "uid": photoUID,
        "details": {
            "uid": "_:exif"
        }
    }]
    await createData(query);
}

// Create data using JSON.
async function createData(data) {
    // Create a new transaction.
    const txn = dgraphClient.newTxn();
    try {
        const p = data;
        // Run mutation.
        const mu = new dgraph.Mutation();
        mu.setSetJson(p);
        const assigned = await txn.mutate(mu);

        // Commit transaction.
        await txn.commit();

        // Get uid of the outermost object (person named "Alice").
        // Assigned#getUidsMap() returns a map from blank node names to uids.
        // For a json mutation, blank node names "blank-0", "blank-1", ... are used
        // for all the created nodes.
        console.log(`Created exif named "Alice" with uid = ${assigned.getUidsMap().get("blank-0")}\n`);

        console.log("All created nodes (map from blank node names to uids):");
        assigned.getUidsMap().forEach((uid, key) => console.log(`${key} => ${uid}`));
    } finally {
        // Clean up. Calling this after txn.commit() is a no-op
        // and hence safe.
        await txn.discard();
    }
}

// Query for data.
async function queryData(albumName) {
    // Run query.
    const query = `query all($a: string) {
        all(func: eq(name, $a)) {
            uid
            name
            photos {
                name
            }
        }
    }`;
    const vars = { $a: albumName };
    const res = await dgraphClient.newTxn().queryWithVars(query, vars);
    const ppl = res.getJson();

    // Print results.
    // console.log(`Number of people named "Alice": ${ppl.all.length}`);
    // ppl.all.forEach((person) => console.log(person));

    return ppl;
}

async function main() {
    // const dgraphClientStub = newClientStub();
    // const dgraphClient = newClient(dgraphClientStub);
    await dropAll(dgraphClient);
    await setSchema(dgraphClient);
    // await createData(dgraphClient);
    // await queryData(dgraphClient);

    // Close the client stub.
    // dgraphClientStub.close();
}

async function close() {
    // Close the client stub.
    dgraphClientStub.close();
}

main().then(() => {
    console.log("\nDONE!");
}).catch((e) => {
    console.log("ERROR: ", e);
});

module.exports = {
    createData, close, 
    queryData, addPhoto, 
    addExif, getPhotoUID
}