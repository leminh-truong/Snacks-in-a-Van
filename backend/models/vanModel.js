var mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10; // From the recommended values
const MIN_PASSWORD_LEN = 6;

const vanSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    // select: false does not send password unless explicitly requested
    password: {
        type: String, 
        select: false, 
        required: true, 
        minlength: MIN_PASSWORD_LEN
    },
    locationString: String,
    location: {
        type: {type: String, required: true, default: "Point"},
        coordinates: [Number]
    },
    isOpen: Boolean
})

// And similar to the userSchema, do these steps upon a DB save
vanSchema.pre("save", function(next) {
    var van = this;

    // check if the password hasn't been modified
    if (!van.isModified("password")) return next();

    // otherwise generate the salt
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return next(err);

        // now hash the password based on the salt
        bcrypt.hash(van.password, salt, function(err, hash) {
            // throw error
            if (err) return next(err);

            // or write over the user's password value
            van.password = hash;
            next();
        })
    });

});

// Compares the given password to the one that is stored in the database
vanSchema.methods.comparePassword = async function validatePassword(data) {
    return bcrypt.compare(data, this.password);
};

module.exports = mongoose.model("vans", vanSchema);
