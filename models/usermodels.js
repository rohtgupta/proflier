const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail, isDate,  isStrongPassword} = require('validator');

const Userschema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Missing Name"]
    },
    dob:{
        type: Date,
        required:[true, "Missing DOB"],
        validate: [isDate, "Invalid Date"]
    },
    email:{
        type: String,
        unique: true,
        required:[true, "Need an email"],
        validate:[isEmail, "email not a valid one"]
    },
    username:{
        type: String,
        unique: true,
        lowercase:[true, "only lowercase"],
        required:[true, "Need a user name"]
    },
    password:{
        type: String,
        minlength: [8, "Minimum password length is 8"],
        required:[true, "Need a password"],
        //validate: [isStrongPassword, "Not a strong password"]
    },

    active:{
        type: Boolean,
        default:true
    }

    }, {
        timestamps: true
    }
)

Userschema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//static method to log user in

Userschema.statics.login = async function(username, password){
    let user;
    if (username.includes('@')){
        user = await this.findOne({email:username});
    }       
    else{
        user = await this.findOne({username});
    }
        
    if (user){
        const log = await bcrypt.compare(password, user.password);

        if (log){
            return user;
        }
        throw Error('Incorrect password!');
    }
    throw Error('Incorrect username or email!');
}

const User = mongoose.model('user', Userschema);

module.exports = User;