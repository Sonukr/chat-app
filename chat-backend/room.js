const rooms = {};

function createRoom(roomId) {
  if (!rooms[roomId]) {
    rooms[roomId] = { users: new Set(), userIds: {}, typingUsers: new Set() }; // Set for users, Map for userIds (faster lookup)
  }
  return roomId;
}

function joinRoom(roomId, ws, userId) {
  rooms[roomId].users.add(ws);
  rooms[roomId].userIds[userId] = ws; // Map userId to websocket connection
}


function leaveRoom(roomId, ws, userId) {
  // Broadcast message about user leaving (optional)
  const leaveMessage ={ type: 'userLeft', roomId, user: userId };
  broadcastToRoom(roomId, leaveMessage);

  rooms[roomId].users.delete(ws);
  rooms[roomId].typingUsers.delete(ws);
  delete rooms[roomId].userIds[userId];
  
  // Optionally handle cases where a room becomes empty (remove it)
  
}

function startTyping(roomId, ws) {
  rooms[roomId].typingUsers.add(ws);
  broadcastTyping(roomId); // Broadcast typing indicator to all users
}

function stopTyping(roomId, ws) {
  rooms[roomId].typingUsers.delete(ws);
  broadcastTyping(roomId); // Broadcast typing indicator update
}

function broadcastTyping(roomId) {
  const isSomeoneTyping = rooms[roomId].typingUsers.size > 0;
  const message = JSON.stringify({ type: 'typing', isSomeoneTyping });
  for (const client of rooms[roomId].users) {
    client.send(message);
  }
}
function broadcastToRoom(roomId, message) {
  console.log(message)
  for (const client of rooms[roomId].users) {
    client.send(JSON.stringify({ type: message.type || 'message', data: { message: message.message, user: message.user, timestamp: new Date()} }));
  }
}

function getRoomUsers(roomId) {
  // Return an array of userIds in the room (consider privacy concerns)
  return Object.keys(rooms[roomId].userIds);
  
}


module.exports = {
  rooms,
  createRoom,
  joinRoom,
  leaveRoom,
  startTyping,
  stopTyping,
  broadcastTyping,
  broadcastToRoom,
  getRoomUsers
}