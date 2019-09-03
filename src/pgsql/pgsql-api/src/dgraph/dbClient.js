/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */
const dgraph = require("dgraph-js");
const grpc = require("grpc");
const {PGSQL_DGRAPH_ENDPOINT} = require("../common/config");

console.log(PGSQL_DGRAPH_ENDPOINT);

// Create a client stub.
function newClientStub() {
    return new dgraph.DgraphClientStub(PGSQL_DGRAPH_ENDPOINT,grpc.credentials.createInsecure());
}

// Create a client.
function newClient(clientStub) {
    return new dgraph.DgraphClient(clientStub);
}

function newOperation() {
    return new dgraph.Operation();
}

// // Set schema.
// async function setSchema() {
//     const schema = `
//         name: string @index(term) .
//     `;
//     const op = newOperation();
//     op.setSchema(schema);
//     const dgraphClientStub = newClientStub();
//     const dgraphClient = newClient(dgraphClientStub);
//     await dgraphClient.alter(op);
// }

function newMutation() {
    return new dgraph.Mutation();
}

function newTransaction() {
    const dgraphClientStub = newClientStub();
    const dgraphClient = newClient(dgraphClientStub);
    return dgraphClient.newTxn();
}

// setSchema()

module.exports = {newTransaction, newOperation, newMutation}