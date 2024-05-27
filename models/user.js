const { createHmac, randomBytes } = require('crypto');
const { Schema, model } = require("mongoose");
const {createTokenForUser} = require("../utils/authentication")

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "/image/default.png",
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"], //enum means -- we can not give the other value with 2 values
        default: "USER"
    }
}, {timestamps: true})


/*---------For SignUp----Save krne se phele this logic can be invoke-------------*/

userSchema.pre("save", function(next) {
    const user = this;

    if(!user.isModified("password")) return;

    /*----Now invoke this functin to password hash and salt with crypto node inbuilt package-----*/

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest('hex');

    /*--------This code can be convert with the use password to the Salt Password------*/
    this.salt = salt;
    this.password = hashedPassword,

    next()
})

/*---------For Login----Now we can match the user password with Hash-----------*/

userSchema.static("matchPasswordAndGenerateToken", async function(email, password){
    const user = await this.findOne({email}); //--Sbse phele hum user ko apne database me dhundege
    if(!user) throw new Error('User not Found'); //--agr user nahi milta he to hum use false return kar denge

    /* Agar user mil jata he to hum uske password ko match krenge*/

    const salt = user.salt;
    const hashedPassword = user.password;
    console.log(user)
    const userProvideHash = createHmac("sha256", salt).update(password).digest('hex');

    if(hashedPassword !== userProvideHash) throw new Error('Incorrect Password');   

    // return {...user._doc, password: undefined, salt: undefined};
    const token = createTokenForUser(user);
    return token;
    // return user;
});

const User = model("user", userSchema);
module.exports = User;