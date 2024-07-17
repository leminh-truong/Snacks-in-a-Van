var mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10; // From the recommended values
const MIN_PASSWORD_LEN = 6;

// Basing model from https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1 (along with methods of password verification)
const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, index: {unique: true }},
    // select: false does not send password unless explicitly requested
    password: {type: String, minlength: MIN_PASSWORD_LEN, required: true, select: false },
})

// Will be done upon a DB save action
userSchema.pre("save", function(next) {
    var user = this;

    // check if the password hasn't been modified
    if (!user.isModified("password")) return next();

    // otherwise generate the salt
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return next(err);

        // now hash the password based on the salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            // throw error
            if (err) return next(err);

            // or write over the user's password value
            user.password = hash;
            next();
        })
    });

});

// Compares the given password to the one that is stored in the database
userSchema.methods.comparePassword = async function validatePassword(data) {    
    return bcrypt.compare(data, this.password);
};


module.exports = mongoose.model("user", userSchema);