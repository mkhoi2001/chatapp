const mongoose = require('mongoose');
const groupUserSchema = new mongoose.Schema({
    user_id: {
        type: String
    },
    group_id: {
        type: String
    },
    unread: {
        type:Object,
        default: 0
    },
    is_admin: {
        type:Object,
        default: 0
    }
},{
    timestamps: {
    }
})

const GroupMember = mongoose.model('group_member', groupUserSchema);
module.exports = GroupMember;