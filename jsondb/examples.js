const data = { name: 'John', age: 30 };
db.insert(data, (err, newDoc) => {
    if (err) {
        console.error(err);
    } else {
        console.log(newDoc);
    }
});


db.find({ age: { $gt: 20 } }, (err, docs) => {
    if (err) {
        console.error(err);
    } else {
        console.log(docs);
    }
});


const query = { name: 'John' };
const update = { $set: { age: 35 } };
const options = { multi: false };
db.update(query, update, options, (err, numAffected) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`${numAffected} document(s) updated`);
    }
});


const query = { name: 'John' };
const options = { multi: false };
db.remove(query, options, (err, numRemoved) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`${numRemoved} document(s) removed`);
    }
});
