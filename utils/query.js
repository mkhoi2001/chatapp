const User = require("./../models/userModel");
const Contact = require("./../models/contactModel");
const Message = require("../models/messageModel");
const Group = require("../models/groupModel");
const GroupMember = require("../models/groupMemberModel");
const GroupMessage = require("../models/groupMessageModel");
const CallLog = require('../models/callLogModel');

/**
 * Contacts Section
 */
// Current Info
function current_user_data(id) {
    const user = User.findById(id);
    return user;
}

// user last seend update
function userLastSeenUpdate(id, last_seen_date) {
  const user_lastseen = User.findByIdAndUpdate(id, { last_seen_date });
  return user_lastseen;
}

// User Privacy Status update
function userPrivacyProfileUpdate(id, is_profile) {
  const user_status = User.findByIdAndUpdate(id, { is_profile });
  return user_status;
}

// User Privacy Status update
function userPrivacyStatusUpdate(id, is_status) {
  const user_status = User.findByIdAndUpdate(id, { is_status });
  return user_status;
}

// Current Info
function userStatusId(id) {
  const user = User.findById(id);
  return user;
}

//--------------- Contact Create -----------------//
// Email Match
function UserEmailMatch(email, created_by) {
    const contact = User.findOne({ email: email });
    return contact;
}

// Contact Match
function contactEmail(email, created_by) {
    const contact = Contact.findOne({ email: email, created_by: created_by });
    return contact;
}

// Contact id wise data get
function contactsIdGet(id) {
    const contact = Contact.findById(id).populate('user_id');
    return contact;
}

// Contact user id wise data get
async function contactsUserIdGet(id,userId) {
  var fm = await Contact.findOne({user_id:id,created_by:userId}).populate('user_id');  
  if(!fm){
    fm = await User.findById(id);
  }
  return fm;
}

// Receiver data get
async function receiverDataGet(id,userId) {
  var receiverData = await Contact.findOne({user_id:id,created_by:userId});  
  return receiverData;
}


// Contact user id with current user id wise data get
function currentContactsWithUserId(id,userId) {
  const contact = Contact.findOne({user_id:id,created_by:userId}).populate('user_id');
  return contact;
}

// Get All Contact User wise
async function contactsGet(userId) {
  // const users = Contact.aggregate([
  //   {
  //     $lookup: {
  //       from: "users",
  //       let: { userId: "$user_id" },
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: { $eq: ["$_id", { $toObjectId: "$$userId" }] },
  //           },
  //         },
  //       ],
  //       as: "user",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "messages",
  //       let: { userId: "$user_id" },
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: { $eq: ["$receiver_id", "$$userId"] },
  //           },
  //         },
  //         { $sort: { _id: -1 } },
  //         { $limit: 1 },
  //       ],
  //       as: "message",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "messages",
  //       let: { userId: "$user_id" },
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: { $eq: ["$receiver_id", "$$userId"] },
  //           },
  //         },
  //       ],
  //       as: "msg",
  //     },
  //   },
  //   { $sort: { name: 1 } },
  //   { $match: { created_by: userId } },
  //   {
  //     $project: {
  //       name: "$name",
  //       email: "$email",
  //       user_id: "$user_id",
  //       created_by: "$created_by",
  //       is_favourite: "$is_favourite",
  //       userImg: "$user.image",
  //       createdAt: "$user.createdAt",
  //       location: "$user.location",
  //       profile: "$user.profile",
  //       message: "$message.message",
  //       unread: "$msg.unread",
  //       file_upload: "$message.file_upload",
  //       created_at: "$message.createdAt",

  //     },
  //   },
  // ]);
  const users = await User.find({});
  console.log(users);
  return users;
}

// Message Update
async function messageUpdate(id, message, flag) {
  const message_update = await Message.findByIdAndUpdate(id, { message, flag });
  return message_update;
}

// Group Message Update
async function messageGroupUpdate(id, message, flag) {
  const message_update = await GroupMessage.findByIdAndUpdate(id, { message, flag });
  return message_update;
}

//Contact Message Search
function messageSearchData(name, user_id, receiverId) {
  const message = Message.aggregate([
    {
      $lookup: {
        from: "users",
        let: { senderId: "$sender_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$senderId" }] },
            },
          },
        ],
        as: "users",
      },
    },
    {
      $lookup: {
        from: "contacts",
        let: { receiver_id: "$receiver_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$user_id", "$$receiver_id"] },
            },
          },
        ],
        as: "contacts",
      },
    },
    {
      $lookup: {
        from: "users",
        let: { contacts_id: "$contacts_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$contacts_id" }] },
            },
          },
        ],
        as: "user",
      },
    },
    {
      $lookup: {
        from: "contacts",
        let: { contacts_id: "$contacts_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$user_id", "$$contacts_id"] },
            },
          },
        ],
        as: "contact",
      },
    },
    {
      $match: {
        $and: [{ $or: [{ receiver_id: receiverId }, { sender_id: receiverId }] }],
      },
    },
    {  
        $match: {
          $expr: { $ne: ["$flag", "2"] },
        },
    },
    {
      $match: {
        $and: [{ $or: [{ receiver_id: user_id }, { sender_id: user_id }] }],
      },
    },
    { $match: { message: new RegExp(name) } },
    { $sort: { _id: -1 } },
    { $limit: 10 },
    {
      $project: {
        message: "$message",
        sender_id: "$sender_id",
        receiver_id: "$receiver_id",
        has_dropDown: "$has_dropDown",
        has_images: "$has_images",
        has_files: "$has_files",
        has_audio: "$has_audio",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt",
        user_id: "$users._id",
        name: "$users.name",
        profile: "$users.profile",
        contactName: "$contacts.name",
        mcontactProfile: "$user.profile",
        mcontact_name: '$contact.name',
        mcontact_email: '$contact.email',
      },
    },
  ]);
  return message;
}

// contact wise sender and receiver message
function contactMessageGet(user_id, receiverId, startm) {
  const message = Message.aggregate([
    {
      $lookup: {
        from: "users",
        let: { senderId: "$sender_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$senderId" }] },
            },
          },
        ],
        as: "users",
      },
    },
    {
      $lookup: {
        from: "contacts",
        let: { receiver_id: "$sender_id" },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{$eq: ["$user_id", "$$receiver_id"]},{$eq: ["$created_by", user_id]}] },
            },
          },
        ],
        as: "contacts",
      },
    },
    {
      $lookup: {
        from: "users",
        let: { contacts_id: "$contacts_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$contacts_id" }] },
            },
          },
        ],
        as: "user",
      },
    },
    {
      $lookup: {
        from: "contacts",
        let: { contacts_id: "$contacts_id", sender_id: "$sender_id" },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{$eq: ["$user_id", "$$contacts_id"]},{$eq: ["$created_by", "$$sender_id"]}] },
            },
          },
        ],
        as: "contact",
      },
    },
    {
      $match: {
        $and: [{ $or: [{ receiver_id: receiverId }, { sender_id: receiverId }] }],
      },
    },
    {
      $match: {
        $and: [{ $or: [{ receiver_id: user_id }, { sender_id: user_id }] }],
      },
    },
    { $sort: { _id: -1 } },
    {$skip: startm},
    { $limit: 10 },
    {
      $project: {
        message: "$message",
        sender_id: "$sender_id",
        receiver_id: "$receiver_id",
        has_dropDown: "$has_dropDown",
        has_images: "$has_images",
        has_files: "$has_files",
        has_audio: "$has_audio",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt",
        is_replay: "$is_replay",
        replay_id: "$replay_id",
        location: "$location",
        contacts_id: "$contacts_id",
        user_id: "$users._id",
        voice_recoder:"$voice_recoder",
        name: "$users.name",
        profile: "$users.profile",
        is_profile: "$users.is_profile",
        contactName: "$contacts.name",
        mcontactProfile: "$user.profile",
        mcontact_name: '$contact.name',
        mcontact_email: '$contact.email',
        flag: '$flag',
      },
    },
  ]);
  return message;
}

// Common Group List
function commonGroup(receiverId, userId) {
  const contactList = GroupMember.aggregate([
    {
      $lookup: {
        from: "groups",
        let: { group_id: "$group_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$group_id" }] },
            }
          },
        ],
        as: "groups",
      },
    },
    { $match: { "groups.user_id": userId } },
    { $match: { user_id: receiverId } },
    {
      $project: {
        gid: "$group_id",
        group_name: "$groups.name"
      },
    },
  ]);
  return contactList;
};

// Unread Message Update
function updateUnreadMsg(receiver_id, unread) {
  const message_update = Message.updateMany(
    { sender_id: receiver_id },
    { unread }
  );
  return message_update;
}

//Contact Delete
function contactDelete(receiverId,userId) {
  const contact_delete = Contact.deleteMany({"user_id":receiverId}, {"created_by":userId});
  return contact_delete;
}

// Contact name edit
function contactNameUpdate(userId, receiverId, name) {
  const contact_name_update = Contact.updateOne({"created_by":userId,"user_id":receiverId}, { name });
  return contact_name_update;
}

// All Message Delete
function allMessageDelete(id,uid) {
  const message_delete = Message.deleteMany({ $or: [{ $and: [{ receiver_id: id }, { sender_id: uid }] }, { $and: [{ sender_id: id }, { receiver_id: uid }] }] });
  return message_delete;
}

// Single Message Delete
function messageDelete(id,flag) {
  const message_delete = Message.findByIdAndUpdate(id, { flag });
  return message_delete;
}

// Favourite Update 
function favouriteUpdate(user_id, created_by, is_favourite) {
  const message_update = Contact.updateOne({"user_id":user_id,"created_by":created_by}, { is_favourite });
  return message_update;
}


/**
 * Single Chat 
 */
// Direct Contact Get
function directContactGet(user_id) {
  const messages = Message.aggregate([
    { $match: {$or:[{ sender_id:user_id},{receiver_id:user_id}] }},
    {
        $group:{
            _id:{
                sender_id:{ $cond: {
                    if: { $lt: ["$sender_id","$receiver_id"]},
                    then: "$sender_id",
                    else: "$receiver_id"
                }},
                receiver_id:{ $cond: {
                    if: { $gt: ["$sender_id","$receiver_id"]},
                    then: "$sender_id",
                    else: "$receiver_id"
                }},
            },
            unread: {$sum: {$cond: [{$and:[{$eq: [ "$receiver_id", user_id ]}, { $eq: [ "$unread", "0" ]}] }, 1, 0 ]} },
        },
    },
    {
        $set:{
            ids:{ 
                $cond: {
                    if: {$eq: ["$_id.receiver_id",user_id]},
                    then: "$_id.sender_id",
                    else: "$_id.receiver_id"
                }
            }
        }
    },
    {$lookup: {
            from: "users",
            let: { id: "$ids" },
            pipeline: [{
            $match: {
                $expr: { $eq: ["$_id", { $toObjectId: "$$id" }] },
            },
            }],
            as: "users"
        }
    },
    {
      $lookup: {
      from: "contacts",
      let: { id: "$ids" },
      pipeline: [{
      $match: {
          $expr: { $and: [{$eq: ["$user_id", "$$id"]},{$eq: ["$created_by", user_id]}] },
      },
      }],
      as: "contacts"
      }
    },
    {
        $sort: {
            createdAt: 1,
        },
    },
    { $project : {
      _id:1,
      unread:1,
      message1:"$message.message",
      uid:"$users._id",
      email:"$users.email",
      user_name:"$users.name",
      location:"$users.location",
      profile:"$users.profile",
      is_profile:"$users.is_profile",
      name:"$contacts.name",
      favourite:"$contacts.is_favourite",
      ids:1
    }}
  ])
  return messages;
}


/**
 * Setting
 */
// Profile Upload
function profileUpdate(id, profile) {
    const message_update = User.findByIdAndUpdate(id, { profile });
    return message_update;
}

// Background Upload
function bgUpdate(id, bg_image) {
    const message_update = User.findByIdAndUpdate(id, { bg_image });
    return message_update;
}

 // current user name edit
 function userNameUpdate(userId, name) {
    const contact_name_update = User.updateOne({"_id":userId}, { name });
    return contact_name_update;
  }

  // current user status edit
 function userStatusUpdate(userId, status) {
  const contact_name_update = User.updateOne({"_id":userId}, { status });
  return contact_name_update;
}

// Theme color add
function themeColorUpdate(id, theme_color) {
  const message_update = User.findByIdAndUpdate(id, { theme_color });
  return message_update;
}

// Theme color add
function themeImageUpdate(id, theme_image) {
  const message_update = User.findByIdAndUpdate(id, { theme_image });
  return message_update;
}

// Lastseen security 
function lastseenUpdate(id, is_lastseen) {
  const message_update = User.findByIdAndUpdate(id, { is_lastseen });
  return message_update;
}

// notification security 
function notificationUpdate(id, is_notification) {
  const message_update = User.findByIdAndUpdate(id, { is_notification });
  return message_update;
}

// notification muted security 
function notificationMutedUpdate(id, is_muted) {
  const message_update = User.findByIdAndUpdate(id, { is_muted });
  return message_update;
}

/**
 * Group Section Query
 */
// Single Message Typing Set
function groupById(groupsId) {
  const contactList = GroupMember.aggregate([
    {
      $lookup: {
        from: "users",
        let: { id: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$id" }] },
            },
          },
        ],
        as: "user",
      },
    },
    {
      $lookup: {
        from: "contacts",
        let: { id: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$user_id", "$$id"] },
            },
          },
        ],
        as: "contacts",
      },
    },
    { $match: { group_id: groupsId } },
    {
      $project: {
        unread: "$unread",
        is_admin: "$is_admin",
        user_id: "$user_id",
        group_id: "$group_id",
        name: "$user.name",
        contactName: "$contacts.name"
      },
    },
  ]);
  return contactList;
}

// Single Message Typing Set
function groupContactsList(groupsId, userId) {
  const contactList = GroupMember.aggregate([
    {
      $lookup: {
        from: "users",
        let: { id: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$id" }] },
            },
          },
        ],
        as: "user",
      },
    },
    {
      $lookup: {
        from: "contacts",
        let: { id: "$user_id" },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{$eq: ["$user_id", "$$id"]},{$eq: ["$created_by", userId]}] },
            },
          },
        ],
        as: "contacts",
      },
    },
    { $match: { group_id: groupsId } },
    {
      $project: {
        unread: "$unread",
        is_admin: "$is_admin",
        user_id: "$user_id",
        group_id: "$group_id",
        name: "$user.name",
        contactName: "$contacts.name"
      },
    },
  ]);
  return contactList;
}

// group id wise data get
function groupData(id) {
  const group_data = Group.findById(id);
  return group_data;
}

// Group List Get
function groupGet(userId) {
  const contactList = GroupMember.aggregate([
    {
      $lookup: {
        from: "groups",
        let: { id: "$group_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$id" }] },
            },
          },
        ],
        as: "group",
      },
    },
    { $match: { user_id: userId } },
    {
      $project: {
        userId: "$user_id",
        name: "$group.name",
        description: "$group.description",
        userId: "$group.userId",
        group_id: "$group._id",
        unread: "$unread",
        contact_id: "$contact_id",
      },
    },
  ]);
  return contactList;
}

// Group message Search
function groupMessageSearchData(name,groupId) {
  const message = GroupMessage.aggregate([
    {
      $lookup: {
        from: "users",
        let: { senderId: "$sender_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$senderId" }] },
            },
          },
        ],
        as: "users",
      },
    },
    {
      $lookup: {
        from: "contacts",
        let: { replay_id: "$replay_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$user_id", "$$replay_id"] },
            },
          },
        ],
        as: "contacts",
      },
    },
    {
      $lookup: {
        from: "users",
        let: { contacts_id: "$contacts_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$contacts_id" }] },
            },
          },
        ],
        as: "user",
      },
    },
    {
      $lookup: {
        from: "contacts",
        let: { contacts_id: "$contacts_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$user_id", "$$contacts_id"] },
            },
          },
        ],
        as: "contact",
      },
    },
    {  
      $match: {
        $expr: { $ne: ["$flag", "2"] },
      },
    },
    { $match: { group_id: groupId } },
    {$match: { message: new RegExp(name) } },
    { $sort: { _id: -1 } },
    { $limit: 10 },
    {
      $project: {
        message: "$message",
        sender_id: "$sender_id",
        group_id: "$group_id",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt",
        user_id: "$users._id",
        name: "$users.name",
        profile: "$users.profile",
        has_dropDown: "$has_dropDown",
        has_images: "$has_images",
        has_files: "$has_files",
        has_audio: "$has_audio",
        is_replay: "$is_replay",
        replay_id: "$replay_id",
        contacts_id: "$contacts_id",
        contactName: "$contacts.name",
        mcontactProfile: "$user.profile",
        mcontact_name: '$contact.name',
        mcontact_email: '$contact.email',
      },
    },
  ]);
  return message;
}

// Group wise sender and receiver message
function groupMessageGet(groupId, userId, startm=0) {
  const message = GroupMessage.aggregate([
    {
      $lookup: {
        from: "users",
        let: { senderId: "$sender_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$senderId" }] },
            },
          },
        ],
        as: "users",
      },
    },
    {
      $lookup: {
        from: "contacts",
        let: { replay_id: "$replay_id" },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{$eq: ["$user_id", "$$replay_id"]},{$eq: ["$created_by", userId]}] },
            },
          },
        ],
        as: "contacts",
      },
    },
    {
      $lookup: {
        from: "users",
        let: { contacts_id: "$contacts_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$contacts_id" }] },
            },
          },
        ],
        as: "user",
      },
    },
    {
      $lookup: {
        from: "contacts",
        let: { contacts_id: "$contacts_id", sender_id: "$sender_id" },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{$eq: ["$user_id", "$$contacts_id"]},{$eq: ["$created_by", "$$sender_id"]}] },
            },
          },
        ],
        as: "contact",
      },
    }, 
    {
      $lookup: {
        from: "contacts",
        let: { sender_id: "$sender_id" },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{$eq: ["$user_id", "$$sender_id"]},{$eq: ["$created_by", userId]}] },
            },
          },
        ],
        as: "receiver",
      },
    },
    {
      $lookup: {
        from: "users",
        let: { senderId: "$replay_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", { $toObjectId: "$$senderId" }] },
            },
          },
        ],
        as: "useres",
      },
    },
    { $match: { group_id: groupId } },
    { $sort: { _id: -1 } },
    {$skip: startm},
    { $limit: 10 },
    {
      $project: {
        message: "$message",
        flag: "$flag",
        sender_id: "$sender_id",
        group_id: "$group_id",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt",
        user_id: "$users._id",
        name: "$users.name",
        profile: "$users.profile",
        is_profile: "$users.is_profile",
        has_dropDown: "$has_dropDown",
        has_images: "$has_images",
        has_files: "$has_files",
        has_audio: "$has_audio",
        is_replay: "$is_replay",
        replay_id: "$replay_id",
        location: "$location",
        contacts_id: "$contacts_id",
        contactName: "$receiver.name",
        mcontactProfile: "$user.profile",
        mcontact_name: '$contact.name',
        mcontact_email: '$contact.email',
      },
    },
  ]);
  return message;
}

// Group User Delete
function deleteGroupUser(id, group_id) {
  const group_user_delete = GroupMember.deleteOne({
    user_id: id,
    group_id: group_id,
  });
  return group_user_delete;
}

// Unread Group Member list Get
function unreadGroupUser(groupsId) {
  const unread_user = GroupMember.find({ group_id: groupsId });
  return unread_user;
}

// Update Unread Message in group member
function updateUnreadGroupUser(groupsId, userId, unread) {
  const message_update = GroupMember.updateMany(
    { group_id: groupsId, user_id: userId },
    { unread }
  );
  return message_update;
}

// Update All Unread Message Update
function updateUnreadGroupMessage(groupsId, userId, unread) {
  const message_update = GroupMember.updateMany(
    { group_id: groupsId, user_id: userId },
    { unread }
  );
  return message_update;
}

// Group Message Delete
function groupMessageDelete(id, flag) {
  const message_delete = GroupMessage.findByIdAndUpdate(id, { flag });
  return message_delete;
}

// All Group Message Delete
function allGroupMessageDelete(id) {
  const message_delete = GroupMessage.deleteMany({ group_id: id });
  return message_delete;
}

// Group name edit
function groupNameUpdate(id, name) {
  const message_update = Group.findByIdAndUpdate(id, { name });
  return message_update;
}

// Group Delete
function groupDelete(id) {
  const group_delete = Group.findByIdAndDelete(id);
  return group_delete;
}

// Group All Member Delete
function groupMemberDelete(id) {
  const group_delete = GroupMember.deleteMany({ group_id: id });
  return group_delete;
}

// Group All Message Delete
function groupMsgDelete(id) {
  const group_delete = GroupMessage.deleteMany({ group_id: id });
  return group_delete;
}

// Exit Group Member
function groupExitMember(id, group_id) {
  const group_delete = GroupMember.deleteOne({ user_id: id,group_id: group_id });
  return group_delete;
}

//================ Calls Section ================//
function callsGet(userId) {
  const calls = CallLog.aggregate([
    { $match: {$or:[{ sender_id:userId},{receiver_id:userId}] }},
    {$lookup: {
            from: "users",
            let: { id: {
               $cond: {
                if: { $eq: [userId,"$receiver_id"]},
                then: "$sender_id",
                else: "$receiver_id"
            },
            } },
            pipeline: [{
            $match: {
                $expr: { $eq: ["$_id", { $toObjectId: "$$id" }] },
            },
            }],
            as: "users"
        }
    },
    { $project : {
        sender_id:"$sender_id",
        type:"$type",
        is_type:"$is_type",
        time:"$time",
        createdAt:"$createdAt",
        userName:"$users.name",
        userProfile:"$users.profile"
    }}
  ])
  return calls;
}

module.exports = {
    current_user_data,
    userLastSeenUpdate,
    userPrivacyProfileUpdate,
    userPrivacyStatusUpdate,
    userStatusId,
    UserEmailMatch,
    contactEmail,
    contactsIdGet,
    contactsUserIdGet,
    receiverDataGet,
    currentContactsWithUserId,
    contactsGet,
    messageUpdate,
    messageGroupUpdate,
    messageSearchData,
    commonGroup,
    contactMessageGet,
    updateUnreadMsg,
    contactDelete,
    contactNameUpdate,
    allMessageDelete,
    messageDelete,
    directContactGet,
    favouriteUpdate,
    profileUpdate,
    bgUpdate,
    userNameUpdate,
    userStatusUpdate,
    themeColorUpdate,
    themeImageUpdate,
    lastseenUpdate,
    notificationUpdate,
    notificationMutedUpdate,
    groupById,
    groupContactsList,
    groupData,
    groupGet,
    groupMessageSearchData,
    groupMessageGet,
    deleteGroupUser,
    unreadGroupUser,
    updateUnreadGroupUser,
    updateUnreadGroupMessage,
    groupMessageDelete,
    allGroupMessageDelete,
    groupNameUpdate,
    groupDelete,
    groupMemberDelete,
    groupMsgDelete,
    groupExitMember,
    callsGet
};