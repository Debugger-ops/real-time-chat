import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { getToken } from 'next-auth/jwt';
import prisma from './db';

export type NextApiResponseWithSocket = {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

// This function initializes a Socket.IO server if it doesn't exist
export const initSocketServer = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');
    
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
    });
    
    // Middleware for authentication
    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        const userId = socket.handshake.auth.userId;
        
        if (!userId) {
          return next(new Error('User ID is required'));
        }
        
        // Verify user exists
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        
        if (!user) {
          return next(new Error('User not found'));
        }
        
        // Attach user to socket
        socket.data.userId = userId;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });
    
    // Handle connections
    io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id} - User: ${socket.data.userId}`);
      
      // Update user status to online
      updateUserStatus(socket.data.userId, 'online');
      
      // Handle joining a chat room
      socket.on('join-chat', async ({ chatId }) => {
        if (!chatId) return;
        
        // Check if user is member of the chat
        const chatUser = await prisma.chatUser.findUnique({
          where: {
            chatId_userId: {
              chatId,
              userId: socket.data.userId,
            },
          },
        });
        
        if (!chatUser) {
          socket.emit('error', { message: 'Not authorized to join this chat' });
          return;
        }
        
        // Join the room
        socket.join(chatId);
        console.log(`User ${socket.data.userId} joined chat ${chatId}`);
        
        // Notify others in the chat
        socket.to(chatId).emit('user-join', {
          userId: socket.data.userId,
          chatId,
        });
      });
      
      // Handle leaving a chat room
      socket.on('leave-chat', ({ chatId }) => {
        if (!chatId) return;
        
        socket.leave(chatId);
        console.log(`User ${socket.data.userId} left chat ${chatId}`);
        
        // Notify others in the chat
        socket.to(chatId).emit('user-leave', {
          userId: socket.data.userId,
          chatId,
        });
      });
      
      // Handle new message
      socket.on('send-message', async (message) => {
        if (!message || !message.chatId || !message.content) return;
        
        try {
          // Save message to database
          const newMessage = await prisma.message.create({
            data: {
              content: message.content,
              chatId: message.chatId,
              senderId: socket.data.userId,
              ...(message.attachments && {
                attachments: {
                  createMany: {
                    data: message.attachments,
                  },
                },
              }),
            },
            include: {
              sender: true,
              attachments: true,
            },
          });
          
          // Update chat's updatedAt
          await prisma.chat.update({
            where: { id: message.chatId },
            data: { updatedAt: new Date() },
          });
          
          // Broadcast to all users in the chat
          io.to(message.chatId).emit('new-message', newMessage);
        } catch (error) {
          console.error('Error sending message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });
      
      // Handle typing status
      socket.on('typing', ({ chatId, isTyping }) => {
        if (!chatId) return;
        
        socket.to(chatId).emit('user-typing', {
          userId: socket.data.userId,
          chatId,
          isTyping,
        });
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
        updateUserStatus(socket.data.userId, 'offline');
      });
    });
    
    res.socket.server.io = io;
  }
  
  return res.socket.server.io;
};

// Update user status in the database
async function updateUserStatus(userId: string, status: 'online' | 'offline' | 'away') {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        status,
        lastSeen: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to update user status:', error);
  }
}