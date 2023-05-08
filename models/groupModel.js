const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, 'Vui lòng điền tên!']
    },
    description: {
        type:String,
        required: [true, 'Vui lòng điền mô tả!']
    },
    user_id: {
        type: String,
        require: true
    },
})

const Groups = mongoose.model('groups', groupSchema);
module.exports = Groups;