import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
export const getUsersForSidebar = async(req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");      
        res.status(200).json({ users: filteredUsers });
    } catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Server error fetching users" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id : userToChatId} = req.params; // Renaming id as userToChatId for clarity
        const myId  = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });
        res.status(200).json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Server error fetching messages" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id : receiverId} = req.params; // Renaming id as receiverId for clarity
        const senderId = req.user._id;

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text, 
            image: imageUrl
        });
        console.log(newMessage);
        await newMessage.save();
        // todo: add socket event here
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({ newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server error sending message" });
    }
}