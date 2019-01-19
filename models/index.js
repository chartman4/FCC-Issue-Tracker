const mongoose = require("mongoose");
// show the mongo queries being run in the terminal
mongoose.set("debug", true);

// Making use of the actual native Promise that ES6 provides
// http://erikaybar.name/using-es6-promises-with-mongoosejs-queries/
mongoose.Promise = Promise;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

console.log("connect to db");
console.log(process.env.DB);

mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true, useCreateIndex: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("connected to db");
});

module.exports.Project = require("./project");