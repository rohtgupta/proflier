const mongoose = require('mongoose');

const Expschema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId, ref:'User'
    },
    
    organisation:{
        type: String,
        required: [true, "Mention Organisation Name"]
    },

    role: {
        type: String,
        required: [true, "Mention Role Name"]
    },

    span:{
        type: Number,
        required: [true, "Enter Workspan in Years"]
    },

    description: {
        type: String,
        required: [true, "Enter Description"]
    }
}, 
);

const Exp = mongoose.model('expInfo', Expschema);

module.exports = Exp;