const mongoose = require("mongoose");

const roomChatSchema = new mongoose.Schema(
    {
        title:String,
        avatar: String,
        typeRoom: String,
        status: String,
        // theme 
        users: [
            {
                user_id: String,
                role: String,
            }
        ],
        deleted: {
            type:Boolean,
            default: false
        },
        deletedAt: Date,
    }, 
    {
        timestamps: true
    }
)

const RoomChat = mongoose.model('RoomChat', roomChatSchema, "Rooms-chat");

module.exports = RoomChat