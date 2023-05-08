const mongoose = require('mongoose');
const callSchema = new mongoose.Schema({
    sender_id: {
        type: String
    },
    receiver_id: {
        type: String
    },
    type: {
        type: String,
        default: null
    },
    is_type: {
        type: String,
        default: 0
    },
    time: {
        type: String,
        default: "0:0"
    }
},{
    timestamps: {
    }
})

const CallLog = mongoose.model('callLog', callSchema);
module.exports = CallLog;