const mongoose = require('mongoose');

const Projectschema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId, ref:'User'
    },
    title :{
        type: String,
        required: [true, "Mention Title"]
    },
    description: {
        type: String,
    },
    team: {
        type: String,
        required: [true, "Mention Team or Individual"]
    },
    address :{
        type: String,
        required: [true, "Mention project link"]
    }
}, {
    timestamps: true
});

const Project = mongoose.model('blog', Projectschema);

module.exports = Project;