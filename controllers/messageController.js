// Models
const Msg = require("../models/messageModel");
// Plugins
const catchAsync = require("./../utils/catchAsync");

exports.sendTextMessage = catchAsync(async (req, res) => {
  const { message, sender_id, receiver_id } = req.body;

  try {
    const newMessage = new Msg({
      message,
      sender_id,
      receiver_id
    });

    await newMessage.save();

    res.status(200).json({
      status:'success',
      message: "Gửi tin nhắn thành công",
      data: newMessage
    });
  } catch (error) {
    console.log("Error sending message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
});

exports.sendImageMessage = catchAsync(async (req, res) => {
  const { sender_id, receiver_id, has_images, contacts_id } = req.body;

  try {
    const newMessage = new Msg({
      sender_id,
      receiver_id,
      has_images
    });

    await newMessage.save();

    res.status(200).json({
      status: "success",
      message: "Gửi tin nhắn thành công",
      data: newMessage,
    });
  } catch (error) {
    console.log("Error sending message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
});

exports.getMessage = catchAsync(async (req, res) => {
  const {sender_id, receiver_id} = req.body;
  try {
    const allMessage = await Msg.find({$or: [
        { sender_id: sender_id, receiver_id: receiver_id },
        { sender_id: receiver_id, receiver_id: sender_id }
      ]
    });
    if (allMessage.length == 0) {
      return res.status(404).json({
        status: 'fail',
        message: "Không có tin nhắn nào"
    })
    }
    res.status(200).json({
      status: "success",
      message: "Lấy dữ liệu tin nhắn thành công",
      listMessage: allMessage
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Không tìm thấy dữ liệu tin nhắn"
})
}})

exports.getAllConversations = catchAsync(async (req, res) =>{
  const {myId} = req.body;
  try {
    const allConversations = await Msg.aggregate([
      {
        $match: {
          $or: [{ sender_id: myId }, { receiver_id: myId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender_id", myId] },
              "$receiver_id",
              "$sender_id",
            ],
          },
          conversation: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$conversation" },
      },
    ]);
    if (allConversations.length == 0) {
      return res.status(404).json({
        status: 'fail',
        message: "Không có cuộc trò chuyện nào"
    })
    }
    res.status(200).json({
      status: "success",
      message: "Lấy dữ liệu cuộc trò chuyện thành công",
      listMessage: allConversations
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Không tìm thấy dữ liệu"
})
  }
})