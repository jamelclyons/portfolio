"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataCollection = exports.getData = exports.postData = void 0;
const config_1 = require("../config");
const postData = async (collection, docID, data) => {
    try {
        const docSnap = await config_1.db.collection(collection).doc(docID);
        const res = await docSnap.set(data);
        return res.writeTime.toDate();
    }
    catch (error) {
        const err = error;
        throw new Error(err.message);
    }
};
exports.postData = postData;
const getData = async (collection, docID) => {
    try {
        const docSnap = await config_1.db.collection(collection).doc(docID).get();
        const data = await docSnap.data();
        if (data === null) {
            return null;
        }
        return data;
    }
    catch (error) {
        const err = error;
        throw new Error(err.message);
    }
};
exports.getData = getData;
const getDataCollection = async (collection) => {
    try {
        const snapshot = await config_1.db.collection(collection).get();
        const docs = await snapshot.docs;
        if (Array.isArray(docs) && docs.length > 0) {
            const collectionData = docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            return collectionData;
        }
        return null;
    }
    catch (error) {
        const err = error;
        throw new Error(err.message);
    }
};
exports.getDataCollection = getDataCollection;
