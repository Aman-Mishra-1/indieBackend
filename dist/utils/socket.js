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
exports.io = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const contractModel_1 = __importDefault(require("../models/client/contractModel"));
const conversationModel_1 = __importDefault(require("../models/user/conversationModel"));
const messageModel_1 = __importDefault(require("../models/user/messageModel"));
const env_config_1 = require("../config/env.config");
const notificationModel_1 = __importDefault(require("../models/user/notificationModel"));
const activeUsers = new Map();
let io;
const initSocket = (server) => {
    console.log("⚡ Initializing Socket.IO...");
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: env_config_1.env.CLIENT_URL,
            methods: ['GET', 'POST'],
            credentials: true
        },
        transports: ['websocket', 'polling'],
    });
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('authenticate', (userId) => __awaiter(void 0, void 0, void 0, function* () {
            activeUsers.set(userId, socket.id);
            console.log(`User ${userId} authenticated with socket ${socket.id}`);
            socket.broadcast.emit('userStatus', { userId, status: 'online' });
        }));
        socket.on('initializeChat', (_a) => __awaiter(void 0, [_a], void 0, function* ({ clientId, freelancerId }) {
            // console.log('Recieved client id in initializeChat', clientId);
            // console.log('Recieved freelancer id in initializeChat', clientId);
            try {
                const contract = yield contractModel_1.default.findOne({
                    clientId,
                    freelancerId,
                    isDeleted: false,
                });
                // console.log(`Contract found between ${freelancerId} and ${clientId} = ${contract}`)
                if (!contract) {
                    socket.emit('chatError', { message: 'No active contract exists between these users' });
                    return;
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
                socket.emit('chatInitialized', {
                    conversationId: conversation._id,
                    messages
                });
            }
            catch (error) {
                console.error('Error initializing chat:', error);
                socket.emit('chatError', { message: 'Failed to initialize chat' });
            }
        }));
        socket.on('sendMessage', (_a) => __awaiter(void 0, [_a], void 0, function* ({ conversationId, senderId, receiverId, message, mediaType, mediaUrl }) {
            try {
                const conversation = yield conversationModel_1.default.findById(conversationId);
                if (!conversation) {
                    socket.emit('messageError', { message: 'Conversation not found' });
                    return;
                }
                if (conversation.clientId.toString() !== senderId &&
                    conversation.freelancerId.toString() !== senderId) {
                    socket.emit('messageError', { message: 'Unauthorized to send message in this conversation' });
                    return;
                }
                const newMessage = new messageModel_1.default({
                    conversationId,
                    senderId,
                    receiverId,
                    message,
                    mediaType,
                    mediaUrl,
                    isRead: false
                });
                yield newMessage.save();
                conversation.lastMessage = mediaType ? `Sent ${mediaType}` : message;
                conversation.lastMessageAt = new Date();
                yield conversation.save();
                socket.emit('messageSent', newMessage);
                const receiverSocketId = activeUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('newMessage', newMessage);
                }
            }
            catch (error) {
                console.error('Error sending message:', error);
                socket.emit('messageError', { message: 'Failed to send message' });
            }
        }));
        socket.on('markAsRead', (_a) => __awaiter(void 0, [_a], void 0, function* ({ messageId, userId }) {
            try {
                const message = yield messageModel_1.default.findById(messageId);
                if (message && message.receiverId.toString() === userId) {
                    message.isRead = true;
                    message.readAt = new Date();
                    yield message.save();
                    const senderSocketId = activeUsers.get(message.senderId.toString());
                    if (senderSocketId) {
                        io.to(senderSocketId).emit('messageRead', { messageId, readAt: message.readAt });
                    }
                }
            }
            catch (error) {
                console.error('Error marking message as read:', error);
            }
        }));
        socket.on('getConversations', (userId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const conversations = yield conversationModel_1.default.find({
                    $or: [
                        { clientId: userId },
                        { freelancerId: userId }
                    ]
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
                socket.emit('conversations', conversationsWithDetails);
            }
            catch (error) {
                console.error('Error fetching conversations:', error);
                socket.emit('conversationError', { message: 'Failed to fetch conversations' });
            }
        }));
        socket.on('getUnreadCount', (userId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const conversations = yield conversationModel_1.default.find({
                    $or: [
                        { clientId: userId },
                        { freelancerId: userId }
                    ]
                });
                const unreadCounts = yield Promise.all(conversations.map((conv) => __awaiter(void 0, void 0, void 0, function* () {
                    const count = yield messageModel_1.default.countDocuments({
                        conversationId: conv._id,
                        receiverId: userId,
                        isRead: false
                    });
                    return {
                        conversationId: conv._id,
                        otherUserId: conv.clientId.toString() === userId ?
                            conv.freelancerId.toString() :
                            conv.clientId.toString(),
                        count
                    };
                })));
                socket.emit('unreadCounts', unreadCounts);
            }
            catch (error) {
                console.error('Error getting unread counts:', error);
                socket.emit('unreadCountError', { message: 'Failed to get unread counts' });
            }
        }));
        socket.on('deleteMessage', (_a) => __awaiter(void 0, [_a], void 0, function* ({ messageId, userId }) {
            try {
                const message = yield messageModel_1.default.findById(messageId);
                if (!message) {
                    return socket.emit('messageError', { message: 'Message not found' });
                }
                const conversation = yield conversationModel_1.default.findById(message.conversationId);
                if (!conversation) {
                    return socket.emit('messageError', { message: 'Conversation not found' });
                }
                if (message.senderId.toString() !== userId) {
                    return socket.emit('messageError', { message: 'Unauthorized to delete this message' });
                }
                message.message = 'This message was deleted';
                message.mediaUrl = '';
                message.mediaType = null;
                yield message.save();
                conversation.lastMessage = 'This message was deleted';
                yield conversation.save();
                const receiverSocketId = activeUsers.get(message.receiverId.toString());
                const senderSocketId = activeUsers.get(message.senderId.toString());
                const payload = {
                    messageId: message._id,
                    message: message.message,
                };
                if (senderSocketId) {
                    io.to(senderSocketId).emit('messageDeleted', payload);
                }
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('messageDeleted', payload);
                }
            }
            catch (error) {
                console.error('Error deleting message:', error);
                socket.emit('messageError', { message: 'Failed to delete message' });
            }
        }));
        // Notifications
        socket.on('getNotifications', (userId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const notifications = yield notificationModel_1.default.find({ userId })
                    .sort({ createdAt: -1 })
                    .limit(5);
                socket.emit('notifications', notifications);
            }
            catch (error) {
                console.error('Error fetching notifications:', error);
                socket.emit('notificationError', { message: 'Failed to fetch notifications' });
            }
        }));
        socket.on('addNotification', (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, message, role, type }) {
            try {
                const newNotification = new notificationModel_1.default({
                    userId,
                    message,
                    role,
                    type,
                    read: false,
                });
                yield newNotification.save();
                const receiverSocketId = activeUsers.get(userId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('newNotification', newNotification);
                }
            }
            catch (error) {
                console.error('Error adding notification:', error);
                socket.emit('notificationError', { message: 'Failed to add notification' });
            }
        }));
        socket.on('markNotificationAsRead', (notificationId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const notification = yield notificationModel_1.default.findById(notificationId);
                if (!notification) {
                    return socket.emit('notificationError', { message: 'Notification not found' });
                }
                notification.read = true;
                yield notification.save();
                socket.emit('notificationRead', { notificationId });
            }
            catch (error) {
                console.error('Error marking notification as read:', error);
                socket.emit('notificationError', { message: 'Failed to mark notification as read' });
            }
        }));
        socket.on('disconnect', () => {
            for (const [userId, socketId] of activeUsers.entries()) {
                if (socketId === socket.id) {
                    activeUsers.delete(userId);
                    socket.broadcast.emit('userStatus', { userId, status: 'offline' });
                    break;
                }
            }
            console.log('User disconnected:', socket.id);
        });
    });
};
exports.initSocket = initSocket;
