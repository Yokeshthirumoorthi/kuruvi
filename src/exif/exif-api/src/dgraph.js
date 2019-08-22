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
        make: string @index(exact) .
        model: string .
        create_on: datetime .
        width: int .
        height: int .
    `;
    const op = new dgraph.Operation();
    op.setSchema(schema);
    await dgraphClient.alter(op);
}

// Create data using JSON.
async function createData(data) {
    // Create a new transaction.
    const txn = dgraphClient.newTxn();
    try {
        // Create data.
        // const p = {
        //     name: "Alice",
        //     age: 26,
        //     married: true,
        //     loc: {
        //         type: "Point",
        //         coordinates: [1.1, 2],
        //     },
        //     dob: new Date(1980, 1, 1, 23, 0, 0, 0),
        //     friend: [
        //         {
        //             name: "Bob",
        //             age: 24,
        //         },
        //         {
        //             name: "Charlie",
        //             age: 29,
        //         }
        //     ],
        //     school: [
        //         {
        //             name: "Crown Public School",
        //         }
        //     ]
        // };
        // const p = {
        //     make: "Canon",
        //     model: "80 D",
        //     create_on: new Date(1980, 1, 1, 23, 0, 0, 0),
        //     width: 3600,
        //     height: 1000,
        //     exif_of: [
        //         {
        //             name: "bbt1.jpg",
        //             photo_of: [{
        //                 name: "album2"
        //             }]
        //         }
        //     ]
        // }

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
        console.log();
    } finally {
        // Clean up. Calling this after txn.commit() is a no-op
        // and hence safe.
        await txn.discard();
    }
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

module.exports = {createData, close}