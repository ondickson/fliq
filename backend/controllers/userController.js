// backend/controllers/userController.js
import User from '../models/User.js';
import Message from '../models/Message.js';

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.userId;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { email: { $regex: `^${query}$`, $options: 'i' } },
        { phone: { $regex: `^${query}$`, $options: 'i' } },
      ],
    }).select('-password');

    res.status(200).json(users);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUsersWithChatHistory = async (req, res) => {
  try {
    const currentUserId = req.userId;

    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    });

    const userIds = new Set();
    messages.forEach((msg) => {
      if (msg.senderId.toString() !== currentUserId)
        userIds.add(msg.senderId.toString());
      if (msg.receiverId.toString() !== currentUserId)
        userIds.add(msg.receiverId.toString());
    });

    const users = await User.find({ _id: { $in: [...userIds] } }).select(
      '-password',
    );
    res.status(200).json(users);
  } catch (err) {
    console.error('Fetch chat history users failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
