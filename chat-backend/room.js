const rooms = {};

function createRoom(roomId) {
  if (!rooms[roomId]) {
    rooms[roomId] = { users: new Set(), userIds: {} }; // Set for users, Map for userIds (faster lookup)
  }
  return roomId;
}

function joinRoom(roomId, ws) {
  rooms[roomId].users.add(ws);
  rooms[roomId].userIds[userId] = ws; // Map userId to websocket connection
}


function leaveRoom(roomId, ws) {
  rooms[roomId].users.delete(ws);
  delete rooms[roomId].userIds[userId];
  // Optionally handle cases where a room becomes empty (remove it)
}

function broadcastToRoom(roomId, message) {
  for (const client of rooms[roomId].users) {
    client.send(JSON.stringify({ type: 'message', data: { message: message.message, user: message.user } }));
  }
}

function getRoomUsers(roomId) {
  // Return an array of userIds in the room (consider privacy concerns)
  return Array.from(rooms[roomId].userIds.keys());
}


module.exports = {
  createRoom,
  joinRoom,
  leaveRoom,
  broadcastToRoom,
  getRoomUsers
}