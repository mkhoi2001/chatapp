const mongoose = require('mongoose');
const groupmsgSchema = new mongoose.Schema({
    message: {
        type: Object,
        default: null
    },
    has_dropDown: {
        type: String,
        default: true
    },
    has_images: {
        type:Object,
        default: null
    },
    has_files: {
        type:Object,
        default: null
    },
    has_audio: {
        type:Object,
        default: null
    },
    is_replay: {
        type:String
    },
    replay_id: {
        type:String
    },
    location: {
        type:String,
        default: null
    },
    contacts_id: {
        type:Object,
        default: null
    },
    sender_id: {
        type: Object,
        required: true
    },
    group_id: {
        type: Object,
        required: true
    },
    unread: {
        type:Object,
        default: 0
    },
    flag: {
        type:String,
        default: 0
    },
},{
    timestamps: {
    }
})

const groupMsg = mongoose.model('group_message', groupmsgSchema);
module.exports = groupMsg;