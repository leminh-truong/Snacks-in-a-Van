require('dotenv').config()
var mongoose = require('mongoose');

var gracefulShutdown;
var testShutdown;

// Will get the appropriate URI from either the .env in ../.env or the
// configuration from Heroku.
var dbURI = process.env.MONGODB_URI;

// And connect to the database
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, dbName: 'Snacks-in-a-Van' }).catch(error => {
    handleError(error);
    console.log("error connecting to database!");
    done();
});
console.log("Connected to database!");

// Shutdown function used only for testing purposes
testShutdown = function() { mongoose.connection.close()};

// Adapted from "Getting MEAN with Mongo, Express, Angular, and Node"
// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app termination', function() {
        process.exit(0);
    });
});

// export shutdown function for testing purposes
module.exports = testShutdown