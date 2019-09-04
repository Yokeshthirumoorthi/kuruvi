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
const {STORAGE_DGRAPH_ENDPOINT} = require("../common/config");

console.log(STORAGE_DGRAPH_ENDPOINT);

// Create a client stub.
function newClientStub() {
    return new dgraph.DgraphClientStub(STORAGE_DGRAPH_ENDPOINT,grpc.credentials.createInsecure());
}

// Create a client.
function newClient(clientStub) {
    return new dgraph.DgraphClient(clientStub);
}

function newOperation() {
    return new dgraph.Operation();
}

function newMutation() {
    return new dgraph.Mutation();
}

function newTransaction() {
    const dgraphClientStub = newClientStub();
    const dgraphClient = newClient(dgraphClientStub);
    return dgraphClient.newTxn();
}

module.exports = {newTransaction, newOperation, newMutation}