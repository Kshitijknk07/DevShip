import { Server, Socket } from 'socket.io';

interface ProjectRoom {
  projectId: string;
  users: string[];
}

const projectRooms = new Map<string, ProjectRoom>();

export function setupSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Join project room
    socket.on('join-project', (data: { projectId: string; user: string }) => {
      const { projectId, user } = data;

      // Leave any existing project rooms
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });

      // Join the project room
      socket.join(projectId);

      // Update project room data
      if (!projectRooms.has(projectId)) {
        projectRooms.set(projectId, { projectId, users: [] });
      }

      const room = projectRooms.get(projectId)!;
      if (!room.users.includes(user)) {
        room.users.push(user);
      }

      // Notify others in the room
      socket.to(projectId).emit('user-joined', { user });

      // Send current online users to the new user
      socket.emit('online-users', room.users);

      console.log(`User ${user} joined project ${projectId}`);
    });

    // Handle code changes
    socket.on(
      'code-change',
      (data: { projectId: string; code: string; user: string }) => {
        const { projectId, code, user } = data;

        // Broadcast to all users in the project room (except sender)
        socket.to(projectId).emit('code-change', { code, user });
      },
    );

    // Handle chat messages
    socket.on(
      'send-message',
      (data: { projectId: string; message: string; user: string }) => {
        const { projectId, message, user } = data;

        // Broadcast to all users in the project room
        io.to(projectId).emit('chat-message', { message, user });
      },
    );

    // Handle typing indicators
    socket.on(
      'typing',
      (data: { projectId: string; user: string; isTyping: boolean }) => {
        const { projectId, user, isTyping } = data;

        // Broadcast to all users in the project room (except sender)
        socket.to(projectId).emit('typing', { user, isTyping });
      },
    );

    // Handle cursor movements
    socket.on(
      'cursor-move',
      (data: { projectId: string; user: string; position: any }) => {
        const { projectId, user, position } = data;

        // Broadcast to all users in the project room (except sender)
        socket.to(projectId).emit('cursor-move', { user, position });
      },
    );

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);

      // Remove user from all project rooms
      projectRooms.forEach((room, projectId) => {
        const userIndex = room.users.findIndex(
          (user) => socket.rooms.has(projectId) && socket.id === socket.id,
        );

        if (userIndex !== -1) {
          const user = room.users[userIndex];
          room.users.splice(userIndex, 1);

          // Notify others in the room
          socket.to(projectId).emit('user-left', { user });

          // Clean up empty rooms
          if (room.users.length === 0) {
            projectRooms.delete(projectId);
          }
        }
      });
    });

    // Legacy time broadcast (for backward compatibility)
    const interval = setInterval(() => {
      socket.emit('time', { time: new Date().toISOString() });
    }, 1000);

    socket.on('disconnect', () => {
      clearInterval(interval);
    });
  });
}
