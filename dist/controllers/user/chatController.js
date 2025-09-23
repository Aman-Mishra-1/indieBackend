"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markMessageAsRead = exports.initializeChat = exports.getConversations = void 0;
const conversationModel_1 = __importDefault(require("../../models/user/conversationModel"));
const messageModel_1 = __importDefault(require("../../models/user/messageModel"));
const contractModel_1 = __importDefault(require("../../models/client/contractModel"));
// Get all conversations for a user
const getConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const conversations = yield conversationModel_1.default.find({
            $or: [{ clientId: userId }, { freelancerId: userId }]
        }).sort({ updatedAt: -1 });
        const conversationsWithDetails = yield Promise.all(conversations.map((conv) => __awaiter(void 0, void 0, void 0, function* () {
            const unreadCount = yield messageModel_1.default.countDocuments({
                conversationId: conv._id,
                receiverId: userId,
                isRead: false
            });
            const otherUserId = conv.clientId.toString() === userId
                ? conv.freelancerId
                : conv.clientId;
            return Object.assign(Object.assign({}, conv.toObject()), { unreadCount,
                otherUserId });
        })));
        res.json(conversationsWithDetails);
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getConversations = getConversations;
// Initialize a chat (creates conversation if contract exists)
const initializeChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId, freelancerId } = req.params;
    try {
        const contract = yield contractModel_1.default.findOne({
            clientId,
            freelancerId,
            isDeleted: false,
            $or: [
                { status: 'Pending' },
                { status: 'Started' },
                { status: 'Ongoing' }
            ]
        });
        if (!contract) {
            return res.status(403).json({ message: 'No active contract exists between these users' });
        }
        let conversation = yield conversationModel_1.default.findOne({ clientId, freelancerId });
        if (!conversation) {
            conversation = new conversationModel_1.default({
                clientId,
                freelancerId,
                lastMessage: ''
            });
            yield conversation.save();
        }
        const messages = yield messageModel_1.default.find({ conversationId: conversation._id })
            .sort({ createdAt: 1 })
            .limit(50);
        res.json({
            conversationId: conversation._id,
            messages
        });
    }
    catch (error) {
        console.error('Error initializing chat:', error);
        res.status(500).json({ message: 'Failed to initialize chat' });
    }
});
exports.initializeChat = initializeChat;
// Mark a message as read
const markMessageAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId, userId } = req.params;
    try {
        const message = yield messageModel_1.default.findById(messageId);
        if (message && message.receiverId.toString() === userId) {
            message.isRead = true;
            message.readAt = new Date();
            yield message.save();
            return res.json({ success: true, messageId, readAt: message.readAt });
        }
        res.status(403).json({ message: 'Not authorized to mark this message as read' });
    }
    catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.markMessageAsRead = markMessageAsRead;
