const User = require("../../models/user.model")
const RoomChat = require("../../models/rooms-chat.model")

module.exports = (res) => {
    _io.once('connection', (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id; // Id cua A

            // Them id cua A vao acceptFriends cua B
            const existIdAInB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId,
            });
            if (!existIdAInB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: { acceptFriends: myUserId }
                })
            }

            // Them id cua B vao requestFriends cua A
            const existIdBInA = await User.findOne({
                _id: myUserId,
                requestFriends: userId,
            });
            if (!existIdBInA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: { requestFriends: userId }
                })
            }

            // Lay ra do di cua AcceptFriends cua B va tra ve cho B
            const infoUserB = await User.findOne({
                _id: userId,
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS",{
                userId : userId,
                lengthAcceptFriends: lengthAcceptFriends
            });

            // Lay info cua A tra ve cho B
            const infoUserA = await User.findOne({
                _id : myUserId
            }).select("id avatar fullName");
            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIENDS",{
                userId : userId,
                infoUserA: infoUserA
            });

        });

        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id; // Id cua A

            // xoa id cua A vao acceptFriends cua B
            const existIdAInB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId,
            });
            if (existIdAInB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $pull: { acceptFriends: myUserId }
                })
            }

            // xoa id cua B vao requestFriends cua A
            const existIdBInA = await User.findOne({
                _id: myUserId,
                requestFriends: userId,
            });
            if (existIdBInA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $pull: { requestFriends: userId }
                })
            }
            // Lay ra do di cua AcceptFriends cua B va tra ve cho B
            const infoUserB = await User.findOne({
                _id: userId,
            });
            const lengthAcceptFriends = infoUserB.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS",{
                userId : userId,
                lengthAcceptFriends: lengthAcceptFriends
            });
            // Lay id cua A tra ve cho B
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIENDS",{
                userIdB : userId,
                userIdA: myUserId
            });
        });

        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id; // Id cua B

            // xoa id cua A vao acceptFriends cua B
            const existIdAInB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId,
            });
            if (existIdAInB) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $pull: { acceptFriends: userId }
                })
            }

            // xoa id cua B vao requestFriends cua A
            const existIdBInA = await User.findOne({
                _id: userId,
                requestFriends: myUserId,
            });
            if (existIdBInA) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $pull: { requestFriends: myUserId }
                })
            }
        });

        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id; // Id cua B
            const existIdAInB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId,
            });
            const existIdBInA = await User.findOne({
                _id: userId,
                requestFriends: myUserId,
            });
            // Tao phong chat chung 
            let roomChat;
            if(existIdAInB && existIdBInA) {
                const dataRoom = {
                    typeRoom: "friend",
                    users: [
                        {
                            user_id: userId,
                            role: "superAdmin"
                        },
                        {
                            user_id: myUserId,
                            role: "superAdmin"
                        }
                    ]
                };
                roomChat = new RoomChat(dataRoom);
                await roomChat.save();
            }
            // Them {user_id, room_chat_id} cua A vao friendsList cua B
            // xoa id cua A vao acceptFriends cua B

            if (existIdAInB) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: roomChat.id,
                        },
                    },
                    $pull: { acceptFriends: userId }
                })
            }

            // Them {user_id, room_chat_id} cua B vao friendsList cua A
            // xoa id cua B vao requestFriends cua A
            
            if (existIdBInA) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: roomChat.id,
                        },
                    },
                    $pull: { requestFriends: myUserId }
                })
            }
        });
    });
}