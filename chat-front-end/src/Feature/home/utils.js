import Cookie from "js-cookie";
export const setUserInfo = (chatId, userId, userName) => {
  // Try to get the cookie value
  const cookieValue = Cookie.get("userInfo");
  // Check if cookie exists and is valid JSON
  let userInfo;
  try {
    if (cookieValue) {
      userInfo = JSON.parse(cookieValue);
    }
  } catch (error) {
    console.warn("Error parsing cookie userInfo:", error);
  }

  // If cookie doesn't exist or is invalid, create a new object
  if (!userInfo) {
    userInfo = {};
  }

  // Check if chatId exists in userInfo
  if (userInfo[chatId]) {
    // Merge user details only if chatId exists (assuming userId and userName are defined)
    userInfo[chatId].push({ userId, userName });
  } else {
    // If chatId doesn't exist, create a new chatId object
    userInfo[chatId] = [{ userId, userName }];
  }

  debugger;
  // Set the cookie with the updated userInfo
  Cookie.set("userInfo", JSON.stringify(userInfo));

  return userInfo;
};

export const updateUserInfo = (chatId, updatedUsers) => {
  // Try to get the cookie value
  const cookieValue = Cookie.get("userInfo");
  // Check if cookie exists and is valid JSON
  let userInfo;
  try {
    if (cookieValue) {
      userInfo = JSON.parse(cookieValue);
    }
  } catch (error) {
    console.warn("Error parsing cookie userInfo:", error);
  }
  // If cookie doesn't exist or is invalid, create a new object
  if (!userInfo) {
    userInfo = {};
  }

  // Check if chatId exists in userInfo
  if (userInfo[chatId]) {
    // Merge user details only if chatId exists (assuming userId and userName are defined)
    userInfo[chatId] = updatedUsers[chatId];
  } else {
    // If chatId doesn't exist, create a new chatId object
    userInfo[chatId] = updatedUsers[chatId];
  }
  Cookie.set("userInfo", JSON.stringify(updatedUsers));
};

export const removeUserFromChat = (userId, chatId) => {
  // Try to get the cookie value
  const cookieValue = Cookie.get("userInfo");

  // Check if cookie exists and is valid JSON
  let userInfo;
  try {
    if (cookieValue) {
      userInfo = JSON.parse(cookieValue);
    }
  } catch (error) {
    console.warn("Error parsing cookie userInfo:", error);
    return; // Handle error, potentially return null or indicate failure
  }

  // Check if chatId and userInfo exist
  if (!userInfo || !userInfo[chatId]) {
    return; // No userInfo or chatId doesn't exist, nothing to remove
  }

  const userIndex = userInfo[chatId].findIndex(
    (user) => user.userId === userId,
  );
  if (userIndex !== -1) {
    // User found in chat list, remove it
    userInfo[chatId].splice(userIndex, 1);
  }

  // If chat list is empty after removal, consider deleting the chatId property
  if (userInfo[chatId].length === 0) {
    delete userInfo[chatId];
  }

  // Set the cookie with the updated userInfo
  Cookie.set("userInfo", JSON.stringify(userInfo));
};

export const getChatInfo = (chatId) => {
  const cookieValue = Cookie.get("userInfo");
  // Check if cookie exists and is valid JSON
  let userInfo;
  try {
    if (cookieValue) {
      userInfo = JSON.parse(cookieValue);
    }
  } catch (error) {
    console.warn("Error parsing cookie userInfo:", error);
  }

  // If cookie doesn't exist or is invalid, create a new object
  if (!userInfo) {
    return {};
  }

  // Check if chatId exists in userInfo
  if (userInfo[chatId]) {
    // Merge user details only if chatId exists (assuming userId and userName are defined)
    return userInfo[chatId];
  }
};
