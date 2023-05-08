const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, 'Please tell us your name!']
    },
    description: {
        type:String,
        required: [true, 'Please tell us your description!']
    },
    user_id: {
        type: String,
        require: true
    },
})

const Groups = mongoose.model('groups', groupSchema);
module.exports = Groups;