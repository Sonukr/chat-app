const WebSocket = require('ws');

const { rooms, joinRoom, createRoom, leaveRoom, broadcastToRoom, getRoomUsers } = require('./room');

function startWebSocketServer(port) {
  const wss = new WebSocket.Server({ port: port });
  
  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
      const data = JSON.parse(message); // Assume JSON data format
      if (data.type === 'join') {
        const roomId = createRoom(data.roomId || uuid.v4());
        const userId = data.userId; // Assuming userId is sent along with the join command
        joinRoom(roomId, ws, userId);
        console.log(`Client (user ${userId}) joined room: ${roomId}`);
        ws.send(JSON.stringify({ type: 'joined', roomId, users: getRoomUsers(roomId) })); // Send confirmation and current users
        const messageData = { type: 'newUser', message: `${userId} has joined.`, user: data.user }; // User data can be sent here
        broadcastToRoom(roomId, messageData);
      } else if (data.type === 'message') {
        const roomId = data.roomId;
        if (rooms[roomId]) {
          const messageData = { message: data.message, user: data.userId }; // User data can be sent here
          broadcastToRoom(roomId, messageData);
        } else {
          console.warn(`Client tried to send message to non-existent room: ${roomId}`);
          // Optionally send an error message back to the client
          ws.send(JSON.stringify({ message: `No room found for the roomId: ${roomId}` }))
        }
      } else {
        console.warn(`Invalid message type: ${data.type}`);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected', ws);
      // Remove client from any room they were in (implement leaveRoom logic here)
      const userId = ''/* Get user ID associated with the connection (from userIds map) */;
      // for (const roomId in rooms) {
      //   if (rooms[roomId].userIds[userId]) {
      //     leaveRoom(roomId, rooms[roomId].userIds[userId], userId);
      //     break; // Assuming user can only be in one room at a time
      //   }
      // }
    });
  });
  console.log(`WebSocket server listening on port  ${port}`);
}

module.exports = startWebSocketServer;
