const mongoose = require("mongoose")
const generate = require("../helpers/ganerate")

const userSchema = new mongoose.Schema(
    {
      fullName: String,
      email: String,
      password: String,
      tokenUser: {
        type: String,
        default: generate.generateRandomString(20)
      },
      phone: String,
      avatar: String,
      status: {
        type: String,
        default: "active"
      },
      requestFriends: Array, // Loi moi da gui
      acceptFriends: Array, // Loi moi da nhan
      friendList: [ // Danh sach ban be
        {
          user_id: String,
          room_chat_id: String,
        }
      ],
      statusOnline: String,
      deleted: {
        type: Boolean,
        default: false
      },
      deletedAt: Date
    },
    {
      timestamps: true
    }
)

const User = mongoose.model('User', userSchema, "Users");

module.exports = User