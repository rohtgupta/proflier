const mongoose = require('mongoose');

const Infoschema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId, ref:'User'
    },
    
    instituteName :{
        type: String,
        required: [true, "Mention Institute Name"]
    },

    university: {
        type: String,
        required: [true, "Mention University Name"]
    },

    degName:{
        type: String,
        required: [true, "Enter Degree Name"]
    },

    grade: {
        type: Number,
        required: [true, "Enter CPI or Percentage"]
    }
}, 
);

const Info = mongoose.model('academicInfo', Infoschema);

module.exports = Info;