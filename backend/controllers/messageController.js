import Message from '../models/Message.js';

export const getChatMessages = async (req, res) => {
  const currentUserId = req.userId;
  const otherUserId = req.params.otherUserId;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error('Fetch chat messages failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
