const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
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
    contacts_id: {
        type:Object,
        default: null
    },
    sender_id: {
        type: Object,
        required: true
    },
    receiver_id: {
        type: Object,
        required: true
    },
    unread: {
        type:Object,
        default: '0'
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
    voice_recoder: {
        type:String,
        default: null
    },
    flag: {
        type:String,
        default: 0
    },
},{
    timestamps: {
    }
})

const Msg = mongoose.model('message', msgSchema);
module.exports = Msg;