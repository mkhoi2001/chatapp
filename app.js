const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cloudinary = require("./middleware/cloudinary");

// Connect App file
const app = require("./auth");

// Connect Dotenv file
const dotenv = require("dotenv");
dotenv.config({ path: `./config.env` });

// Server Connection
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT;
app.use(express.static(__dirname + "/public"));

// Models
const Contact = require("./models/contactModel");
const Message = require("./models/messageModel");
const CallLog = require("./models/callLogModel");

const users = {};
// Connect Query file
const {
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
  contactMessageGet,
  commonGroup,
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
  callsGet,
} = require("./utils/query");

// Database Connection
const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connection!!"));

mongoose.connection.on("error", (err) => {
  console.log("Database Connection failed: ${error.message}");
});

let vausers = [];
function findUser(username) {
  for (let i = 0; i < vausers.length; i++) {
    if (vausers[i].username == username) return vausers[i];
  }
}

// Socket Connection
io.on("connection", (socket) => {
  console.log("Socket Connected...");

  // User Joined
  socket.on("new-user-joined", (userId, username) => {
    users[socket.id] = userId;
    socket.broadcast.emit("user-connected", userId, username);
    io.to(socket.id).emit("m-online-user-list", users);
  });

  // Current Info Get
  socket.on("currentUserInfo", (userId) => {
    current_user_data(userId).then((user) => {
      io.to(socket.id).emit("currentInfo", {
        user: user,
      });
    });
  });

  // User Disconnect
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", (user = users[socket.id]));
    io.emit("m-online-user-list", users[socket.id]);
    delete users[socket.id];
  });

  // User Last Seen Update
  socket.on("userLastSeen", function ({ id, last_seen_date }) {
    userLastSeenUpdate(id, last_seen_date).then((userInfo) => {});
  });

  // User Privacy Profile update
  socket.on("userisprofile", function ({ userid, is_profile, profile }) {
    io.emit("profileUpdate", { userid, profile, is_profile });
    userPrivacyProfileUpdate(userid, is_profile).then((userInfo) => {});
  });

  // User Privacy Status update
  socket.on("userisstatus", function ({ id, is_status }) {
    userPrivacyStatusUpdate(id, is_status).then((userInfo) => {});
  });

  // User online/offline Status get
  socket.on("userStatus", function ({ id }) {
    var status = [];
    userStatusId(id).then((userInfo) => {
      status = userInfo.last_seen_date;
      for (const key in users) {
        if (id == users[key]) {
          status = "Online";
        }
      }
      io.to(socket.id).emit("userStatus", { id, status });
    });
  });

  /**
   * Contacts Section
   */
  //--------------------- Contact Create -----------------------------//
  socket.on("contactCreate", function ({ name, email, created_by, userEmail }) {
    UserEmailMatch(email).then((userData) => {
      if (userData != null) {
        if (userData.email != userEmail) {
          contactEmail(email, created_by).then((contactData) => {
            if (contactData == null) {
              io.to(socket.id).emit("Success", { msg: "Thêm thành công" });
              const user_id = userData._id;
              const contact = new Contact({ name, email, user_id, created_by });
              contact.save().then(() => {
                contactsIdGet(contact._id).then((contact) => {
                  io.to(socket.id).emit("singleContact", {
                    contacts: contact,
                  });
                });
              });
            } else {
              io.to(socket.id).emit("contactsError", {
                msg: "Email đã tồn tại",
              });
            }
          });
        } else {
          io.to(socket.id).emit("contactsError", {
            msg: "Email không tồn tại",
          });
        }
      } else {
        io.to(socket.id).emit("contactsError", { msg: "Vui lòng điền email" });
      }
    });
  });

  //--------------------- Contact Get -------------------------------//
  socket.on("contactData", ({ userId }) => {
    contactsGet(userId).then((contacts) => {
      io.to(socket.id).emit("contactsLists", {
        contacts: contacts,
      });
    });
  });

  //--------------------- Contact Message send ---------------------//
  socket.on(
    "send_msg",
    async function ({
      message,
      sender_id,
      receiver_id,
      has_dropDown,
      has_files,
      has_images,
      has_audio,
      is_replay,
      replay_id,
      location,
      voice_recoder,
      userId,
      userEmail,
      userName,
      userLocation,
      profile,
      is_profile,
    }) {
      const contact_message = new Message({
        message,
        sender_id,
        receiver_id,
        has_dropDown,
        has_files,
        has_images,
        has_audio,
        is_replay,
        replay_id,
        location,
        voice_recoder,
      });
      var contact_list = await Contact.findOne({
        user_id: sender_id,
        created_by: receiver_id,
      });
      contact_message.save().then(async () => {
        id = contact_message._id;
        createdAt = contact_message.createdAt;
        has_dropDown = contact_message.has_dropDown;
        location = contact_message.location;
        let myid;
        myid = receiver_id;
        if (contact_list != null) {
          contact_name = contact_list.name;
        } else {
          contact_name = "";
        }
        contactsUserIdGet(receiver_id, userId).then((contact) => {
          receiver_name = contact.name;
          receiver_profile = contact.user_id
            ? contact.user_id.profile
            : contact.profile;
          io.to(socket.id).emit("get_msg_res", {
            id,
            message,
            sender_id,
            receiver_id,
            receiver_name,
            receiver_profile,
            has_dropDown,
            has_files,
            has_images,
            has_audio,
            createdAt,
            is_replay,
            replay_id,
            location,
            is_profile,
          });
          for (const key in users) {
            if (receiver_id == users[key]) {
              myid = sender_id;
              io.to(key).emit("get_msg", {
                id,
                message,
                sender_id,
                receiver_id,
                receiver_name,
                receiver_profile,
                has_dropDown,
                has_files,
                has_images,
                has_audio,
                createdAt,
                is_replay,
                replay_id,
                location,
                contact_name,
                userEmail,
                userId,
                userName,
                userLocation,
                profile,
                is_profile,
              });
            }
          }
        });
      });
    }
  );

  // -------------------- Contact Message Update -----------------//
  socket.on(
    "update_msg",
    async function ({
      message,
      sender_id,
      receiver_id,
      has_dropDown,
      has_files,
      has_images,
      has_audio,
      is_replay,
      replay_id,
      flag,
      messageId,
      location,
      voice_recoder,
      userId,
      userEmail,
      userName,
      userLocation,
      profile,
      is_profile,
    }) {
      messageUpdate(messageId, message, flag).then((message) => {});
      for (const key in users) {
        if (receiver_id == users[key]) {
          io.to(key).emit("message_update", {
            messageId,
            message,
            receiver_id,
            sender_id,
            flag,
          });
        }
      }
    }
  );

  //------------------- Contacts Message send --------------------//
  socket.on(
    "contacts_message_create",
    async function ({ sender_id, receiver_id, contactsIds, profile }) {
      contactsIds.forEach(async (contacts_id) => {
        var contactsMsg = await Message.create({
          sender_id,
          receiver_id,
          contacts_id,
          profile,
        });
        id = contactsMsg._id;
        message = contactsMsg.message;
        sender_id = contactsMsg.sender_id;
        receiver_id = contactsMsg.receiver_id;
        has_files = contactsMsg.has_files;
        has_images = contactsMsg.has_images;
        has_audio = contactsMsg.has_audio;
        contacts_id = contactsMsg.contacts_id;
        createdAt = contactsMsg.createdAt;
        is_replay = null;
        replay_id = null;
        currentContactsWithUserId(contacts_id, sender_id).then((contact) => {
          contact_name = contact.name;
          contact_profile = contact.user_id.profile;
          contact_email = contact.user_id.email;
          io.to(socket.id).emit("get_msg_res", {
            id,
            message,
            sender_id,
            receiver_id,
            has_files,
            has_images,
            has_audio,
            createdAt,
            is_replay,
            replay_id,
            contacts_id,
            contact_name,
            contact_profile,
          });
          for (const key in users) {
            if (receiver_id == users[key]) {
              myid = sender_id;
              io.to(key).emit("get_msg", {
                id,
                message,
                sender_id,
                receiver_id,
                has_files,
                has_images,
                has_audio,
                createdAt,
                is_replay,
                replay_id,
                contacts_id,
                contact_name,
                contact_profile,
                contact_email,
                profile,
              });
            }
          }
        });
      });
    }
  );

  //--------------------- Onclick Contact Message Get ---------------//
  socket.on("userClick", async ({ receiverId, userId, startm }) => {
    // Contact Click Event
    contactsUserIdGet(receiverId, userId).then((contact) => {
      io.to(socket.id).emit("contactClickEvent", {
        contacts: contact,
      });
    });

    // Common group List Get
    commonGroup(receiverId, userId).then((commGroups) => {
      io.to(socket.id).emit("commonGroupLists", { commGroups: commGroups });
    });

    // Contact Click Wise Msg Get
    let cnt = await Message.find({
      $or: [{ sender_id: receiverId }, { receiver_id: receiverId }],
    }).count();
    var unread = 1;
    updateUnreadMsg(receiverId, unread).then((message) => {});
    if (startm == 0) {
      contactMessageGet(userId, receiverId, startm, cnt).then((message) => {
        io.to(socket.id).emit("contactMessage", {
          msgno: cnt,
          contactMsgs: message,
        });
      });
    } else {
      contactMessageGet(userId, receiverId, startm).then((message) => {
        io.to(socket.id).emit("chat-pg", {
          contactMsgs: message,
        });
      });
    }
  });

  //-------------------- Unread Msg Update -----------------------//
  socket.on("unreadMsgUpdate", async ({ receiverId, unread }) => {
    updateUnreadMsg(receiverId, unread).then((message) => {});
  });

  //Msg Search
  socket.on("messageSearchValue", ({ filter, userId, receiverId }) => {
    messageSearchData(filter, userId, receiverId).then((message) => {
      io.to(socket.id).emit("contactMessage", {
        contactMsgs: message,
      });
    });
  });

  //------------------- File Upload ------------------//
  // Attached File Upload
  app.post("/fileUploads", (req, res) => {
    if (req.files) {
      const targetFile = req.files.file;
      let uploadDir;
      uploadDir = path.join(
        __dirname,
        "/public/assets/images/attached",
        req.body.fnm
      );
      targetFile.mv(uploadDir, (err) => {
        if (err) return res.status(500).send(err);
        res.send("File uploaded!");
      });
    }
  });

  // Images File Upload
  app.post("/imageUploads", (req, res) => {
    if (req.files) {
      const targetFile = req.files.file;
      let uploadDir = path.join(
        __dirname,
        "/public/assets/images/image",
        req.body.fnm
      );
      targetFile.mv(uploadDir, (err) => {
        if (err) return res.status(500).send(err);
        cloudinary.uploader.upload(
          uploadDir,
          { folder: "images/userProfile" },
          (error, result) => {
            if (error) {
              res.status(500).send("Image upload failed.");
              console.log(error);
            } else {
              const profile = result.secure_url;
              console.log(`Image uploaded successfully. URL: ${profile}`);
            }
          }
        );
        res.send("File uploaded!");
      });
    } else {
      console.log("File uploaded fail!");
    }
  });

  // Audio File Upload
  app.post("/audioUploads", (req, res) => {
    if (req.files) {
      const targetFile = req.files.file;
      let uploadDir = path.join(
        __dirname,
        "/public/assets/images/audio",
        req.body.fnm
      );
      targetFile.mv(uploadDir, (err) => {
        if (err) return res.status(500).send(err);
        res.send("File uploaded!");
      });
    }
  });

  // Profile Upload
  app.post("/profileUpdate", (req, res) => {
    if (req.files) {
      const targetFile = req.files.file;
      const userid = req.body.user_id;
      const is_profile = req.body.is_profile;
      const fileName = targetFile.name;
      let uploadDir = path.join(
        __dirname,
        "/public/assets/images/users",
        fileName
      );
      targetFile.mv(uploadDir, (err) => {
        if (err) return res.status(500).send(err);
        cloudinary.uploader.upload(
          uploadDir,
          { folder: "images/userProfile" },
          (error, result) => {
            if (error) {
              res.status(500).send("Image upload failed.");
              console.log(error);
            } else {
              const profile = result.secure_url;
              io.emit("profileUpdate", { userid, profile, is_profile });
              profileUpdate(req.body.user_id, profile).then((message) => {});
              console.log(`Image uploaded successfully. URL: ${profile}`);
            }
          }
        );
        res.send("File uploaded!");
      });
    } else {
      console.log("File uploaded!");
    }
  });

  // Background Update Upload
  app.post("/bgUpdate", (req, res) => {
    if (req.files) {
      const targetFile = req.files.file;
      let uploadDir = path.join(
        __dirname,
        "/public/assets/images/small",
        targetFile.name
      );
      targetFile.mv(uploadDir, (err) => {
        if (err) return res.status(500).send(err);
        cloudinary.uploader.upload(
          uploadDir,
          { folder: "images/userBackground" },
          (error, result) => {
            if (error) {
              res.status(500).send("Image upload failed.");
              console.log(error);
            } else {
              const backgroundImage = result.secure_url;
              bgUpdate(req.body.user_id, backgroundImage).then((message) => {});
              console.log(
                `Background uploaded successfully. URL: ${backgroundImage}`
              );
            }
          }
        );
      });
    }
  });

  //---------------------------- Contact Message DroupDown --------------------------//

  // Contact Delete
  socket.on("contact_delete", ({ contact_id, receiverId, userId }) => {
    contactDelete(receiverId, userId).then((message) => {});
  });

  // Contact name update
  socket.on("updateContactName", function ({ userId, receiverId, name }) {
    contactNameUpdate(userId, receiverId, name).then((userInfo) => {});
  });

  // Contact All Message Delete
  socket.on("all_Message_delete", ({ conversation, receiverId, userId }) => {
    allMessageDelete(receiverId, userId).then((message) => {});
    io.to(socket.id).emit("all_Message_delete", {
      conversation,
      receiver_Id: receiverId,
      user_Id: userId,
    });
    for (const key in users) {
      if (receiverId == users[key]) {
        io.to(key).emit("all_Message_delete", {
          conversation,
          receiver_Id: receiverId,
          user_Id: userId,
        });
      }
    }
  });

  // Single Message Delete
  socket.on("message_delete", ({ message_id, receiverId, userId, flag }) => {
    messageDelete(message_id, flag).then((message) => {});
    io.to(socket.id).emit("message_delete", {
      message_id,
      receiverId,
      userId,
      flag,
    });
    for (const key in users) {
      if (receiverId == users[key]) {
        io.to(key).emit("message_delete", {
          message_id,
          receiverId,
          userId,
          flag,
        });
      }
    }
  });

  // Single message forward
  socket.on(
    "message_forward",
    ({
      message,
      has_images,
      location,
      contacts_id,
      sender_id,
      receiver_id,
      has_dropDown,
      userId,
      flag,
      userEmail,
      userName,
      userLocation,
      profile,
    }) => {
      const fmessage = new Message({
        message,
        has_images,
        location,
        contacts_id,
        sender_id,
        receiver_id,
        has_dropDown,
        flag,
      });
      fmessage.save().then(() => {
        id = fmessage._id;
        createdAt = fmessage.createdAt;
        let myid;
        myid = receiver_id;
        has_dropDown = fmessage.has_dropDown;
        ids = contacts_id != undefined ? contacts_id : receiver_id;
        contactsUserIdGet(ids, userId).then((contact) => {
          contact_email = contact.user_id.email;
          receiver_name = contact_name = contact.name;
          receiver_profile = contact_profile = contact.user_id
            ? contact.user_id.profile
            : contact.profile;
          io.to(socket.id).emit("get_msg_res", {
            flag,
            id,
            message,
            sender_id,
            receiver_id,
            receiver_name,
            receiver_profile,
            has_dropDown,
            has_images,
            createdAt,
            location,
            contacts_id,
            contact_name,
            contact_profile,
          });
          for (const key in users) {
            if (receiver_id == users[key]) {
              myid = sender_id;
              io.to(key).emit("get_msg", {
                flag,
                id,
                message,
                sender_id,
                receiver_id,
                receiver_name,
                receiver_profile,
                has_dropDown,
                has_images,
                createdAt,
                location,
                contacts_id,
                contact_name,
                contact_profile,
              });
            }
          }
        });
      });
    }
  );

  // Favourite Update
  socket.on(
    "favourityContactUpdate",
    ({ user_id, created_by, is_favourite }) => {
      favouriteUpdate(user_id, created_by, is_favourite).then((message) => {});
    }
  );

  /**
   * Single Chats
   */
  socket.on("contactData", ({ userId }) => {
    directContactGet(userId).then((contacts) => {
      io.to(socket.id).emit("directLists", {
        directMsg: contacts,
      });
    });
  });

  // Contact Reply id wise contact data get
  socket.on("reply_Contact", async ({ receiverId, replayId, userId }) => {
    contactsUserIdGet(replayId, userId).then((contact) => {
      io.to(socket.id).emit("reply_Contact", { contact });
    });
  });

  /**
   * Setting
   */
  // User Name Update
  socket.on("updateUserName", function ({ userId, name }) {
    userNameUpdate(userId, name).then((userInfo) => {});
  });

  // User Status Update
  socket.on("updateUserStatus", function ({ userId, status }) {
    userStatusUpdate(userId, status).then((userInfo) => {});
  });

  // Themes Color set
  socket.on("add_theme_color", ({ user_id, theme_color }) => {
    themeColorUpdate(user_id, theme_color).then((message) => {});
  });

  // Themes Image set
  socket.on("add_theme_image", ({ user_id, theme_image }) => {
    themeImageUpdate(user_id, theme_image).then((message) => {});
  });

  // lastseen security
  socket.on("userLastSeen", ({ user_id, lastseen }) => {
    lastseenUpdate(user_id, lastseen).then((message) => {});
  });

  // notification security
  socket.on("userNotification", ({ user_id, notification }) => {
    notificationUpdate(user_id, notification).then((message) => {});
  });

  // notification muted security
  socket.on("userMutedNotification", ({ user_id, is_muted }) => {
    notificationMutedUpdate(user_id, is_muted).then((message) => {});
  });

  //-------------------- Typing set ---------------------------//
  // Single Message Typing Set
  socket.on("typing", function (data) {
    for (const key in users) {
      if (data.receiverId == users[key]) {
        io.to(key).emit("typing", data);
      }
    }
  });

  // Group Typing Set
  socket.on("group_typing", function (data) {
    groupById(data.groupId).then((group) => {
      group.forEach((gu) => {
        for (const key in users) {
          if (gu.user_id == users[key]) {
            if (key != socket.id) {
              io.to(key).emit("group_typing", data);
            }
          }
        }
      });
    });
  });

  //------------------------------- Audio Call ---------------------------//
  socket.on("ringcall", (receiverId, userId, name, image, ctype) => {
    for (const key in users) {
      if (receiverId == users[key]) {
        io.to(key).emit("ringcalling", receiverId, userId, name, image, ctype);
      }
    }
  });

  //---------------------------- Audio Call Cut ---------------------------//
  socket.on("cutphone", (receiverId) => {
    for (const key in users) {
      if (receiverId == users[key]) {
        io.to(key).emit("cutphoness");
      }
    }
  });

  //------------------------- Receiver call cancel ---------------------//
  socket.on(
    "cutanswerd",
    async ({ sender_id, receiver_id, type, is_type, time }) => {
      await CallLog.create({ sender_id, receiver_id, type, is_type, time });
      for (const key in users) {
        if (sender_id == users[key]) {
          io.to(key).emit("cutpeeranswer");
        }
      }
    }
  );

  //------------------------- Bussy Persan -----------------------//
  socket.on("isbusy", (rid) => {
    for (const key in users) {
      if (rid == users[key]) {
        io.to(key).emit("itbusy");
      }
    }
  });

  //---------------------- Audio Call Attend -----------------------//
  socket.on("answerd", (receiver_id, ctype) => {
    for (const key in users) {
      if (receiver_id == users[key]) {
        io.to(key).emit("answered", receiver_id, ctype);
      }
    }
  });

  //--------------------- Receiver Call Cut ---------------//
  socket.on("closevc", async ({ sender_id, receiver_id, type, is_type }) => {
    await CallLog.create({ sender_id, receiver_id, type, is_type });
    for (const key in users) {
      if (sender_id == users[key]) {
        io.to(key).emit("cutvc");
      }
    }
    vausers.forEach((user) => {
      if (user.conn == socket.id) {
        vausers.splice(vausers.indexOf(user), 1);
        return;
      }
    });
  });

  // **************** * / video call functionality ************************
  //------------ Audio Recoder -----------------//
  socket.on("vccallmsg", (message) => {
    const data = JSON.parse(message);
    const user = findUser(data.username);
    switch (data.type) {
      case "store_user":
        if (user != null) {
          return;
        }
        const newUser = {
          conn: socket.id,
          username: data.username,
        };
        vausers.push(newUser);
        break;
      case "store_offer":
        if (user == null) return;
        user.offer = data.offer;
        break;
      case "store_candidate":
        if (user == null) {
          return;
        }
        if (user.candidates == null) user.candidates = [];
        user.candidates.push(data.candidate);
        break;
      case "send_answer":
        if (user == null) {
          return;
        }
        sendData(
          {
            type: "answer",
            answer: data.answer,
          },
          user.conn
        );
        break;
      case "send_candidate":
        if (user == null) {
          return;
        }
        sendData(
          {
            type: "candidate",
            candidate: data.candidate,
          },
          user.conn
        );
        break;
      case "join_call":
        if (user == null) {
          return;
        }

        sendData(
          {
            type: "offer",
            offer: user.offer,
          },
          socket.id
        );
        user.candidates.forEach((candidate) => {
          sendData(
            {
              type: "candidate",
              candidate: candidate,
            },
            socket.id
          );
        });
        break;
    }
  });
  function sendData(data, conn) {
    io.to(conn).emit("getingonmsgs", JSON.stringify(data));
  }

  //========== Calls Section =============//
  //--------------------- Contact Get -------------------------------//
  socket.on("callsData", ({ userId }) => {
    callsGet(userId).then((calls) => {
      io.to(socket.id).emit("callsLists", {
        callList: calls,
      });
    });
  });
});

// Server Connection
server.listen(port, () => {
  console.log(`App running on port ${port}`);
});
