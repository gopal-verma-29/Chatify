import clodinary from "../lib/cloudinary.js";
import Message from "../models/message.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user.id; // Assuming you have the logged-in user's ID available in req.user.id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error("Error fetching getAllContacts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessagesByUserId = async (req, res) => {
    try {
        const loggedInUserId = req.user.id; // Assuming you have the logged-in user's ID available in req.user.id
        const { id: otherUserId } = req.params.id;

        const messages = await Message.find({
            $or: [
                { sender: loggedInUserId, reciverId: otherUserId },
                { sender: otherUserId, reciverId: loggedInUserId }
            ]
        }).sort({ createdAt: 1 }); // Sort messages by creation time in ascending order

        res.status(200).json(messages);

    } catch (error) {
        console.error("Error fetching messages by user ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id; // Assuming you have the logged-in user's ID available in req.user.id



        let imageUrl;
        if (image) {
            const result = await clodinary.uploader.upload(image);
            imageUrl = result.secure_url;
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        res.status(201).json(newMessage);

        //todo: send message in real time if user is online. Using socket.io

    } catch (error) {
        console.error("Error in sending message route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user.id; // Assuming you have the logged-in user's ID available in req.user.id

        // Find all messages where the logged-in user is either the sender or receiver
        const messages = await Message.find({
            $or: [{ sender: loggedInUserId }, { receiver: loggedInUserId }]
        });

        const chatPartnersIds = [...new Set(
            messages.map((msg) =>
                msg.sender.toString() === loggedInUserId
                    ? msg.receiver.toString()
                    : msg.sender.toString()
                )
            )
        ];
const charPartners = await User.find({ _id: { $in: chatPartnersIds}}).select("-password");

    res.status(200).json(charPartners);
        }catch(error){
            console.error("Error fetching chat partners:", error);
            res.status(500).json({ error: "Internal server error" });
        }
}