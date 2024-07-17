// setup Express
const express = require('express')
const passport = require('passport');

const app = express()
const port = process.env.PORT || 5000
var cors = require('cors')
var path = require('path')

const expressSession = require('express-session')({
    secret: 'mmm a nice fresh coffee',
    resave: false,
    saveUninitialized: true,
});

app.use(cors({
    credentials: true,
    origin: ["https://devdogs.herokuapp.com", "http://localhost:3000"]
}));
app.use(express.json())  // replaces body-parser

// For the session
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});
    
const frontendStatic = express.static(path.join(__dirname, '../frontend/build'));
app.use(frontendStatic);

require("./controllers/dbController");

const apiRouter = require("./routes/apiRouter");

// Because my app on Safari wouldn't work without this.

// So there's no confusion with possible routes on the frontend side
app.use("/api", apiRouter);


// app.use('/api', (req, res) => {
//     res.sendFile(path.join(__dirname,'../backend','index.html'))
// })

// // and send all other requests to frontend built stuff
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});


// start the server listening
server = app.listen(port, () => {
    console.log(`server is listening on port`, port)
})

//export app.js for testing
module.exports = server