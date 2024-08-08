import React, { useState, useEffect } from "react";
import "./style.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { uniq, isEmpty } from "lodash";
import {
  Button,
  Layout,
  Menu,
  theme,
  Input,
  Tag,
  message,
  Dropdown,
} from "antd";
import { isMobile } from "react-device-detect";
import { useNavigate, useParams } from "react-router-dom";
import { getChatInfo, updateUserInfo } from "../home/utils";
import { isProduction, webSocketUrl } from "../../utils/config";
import { checkServerHealth } from "../../utils/utils";
import Loader from "../../Components/Loader";

const { Header, Sider, Content } = Layout;

const Chat = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [inputValue, setInputValues] = useState("");
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const { id: chatRoomId, userId } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [isServerUp, setIsserverUp] = useState(false);
  const [baseChatDetails, setbaseChatDetails] = useState({});
  const [usersTyping, setUsersTyping] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!ws) {
      pingServer();
      const protocol = window.location.protocol.includes("https")
        ? "wss"
        : "ws";
      const url = isProduction()
        ? webSocketUrl
        : `${window.location.hostname}:9699`;
      const newWs = new WebSocket(`${protocol}://${url}`);
      // Handle connection events here (ws.onopen, ws.onmessage, ws.onclose)
      setWs(newWs);
    }
    // Cleanup function to close the connection on unmount
    return () => ws && ws.close();
  }, [ws]);

  useEffect(() => {
    if (userId && chatRoomId) {
      if (ws && ws.readyState === 1) {
        handleJoin();
      }
    }
  }, [chatRoomId, userId, ws]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  if (ws) {
    ws.onopen = function (event) {
      console.log("WebSocket connection opened!");
      if (userId && chatRoomId) {
        if (ws && ws.readyState === 1) {
          handleJoin();
        }
      }
      // You can send initial messages to the server after connection
    };

    ws.onmessage = function (event) {
      console.log("Message received from server:", event.data);
      const messageData = JSON.parse(event.data);
      handleMessages(messageData);
      setMessages([...messages, messageData]);
      // Process messages received from the server (update UI, etc.)
    };

    ws.onclose = function (event) {
      console.log("WebSocket connection closed!", event);
      // Handle disconnection (reconnect logic, etc.)
      reconnectWebsocket();
    };
  }

  const handleMessages = (messageData) => {
    handleInitialAndNewJoinEvents(messageData);
    handleTypingUsersEvents(messageData);
    handleNewUserAddedEvents(messageData);
  };

  const handleInitialAndNewJoinEvents = (messageData) => {
    if (messageData.type === "joined") {
      const resp = {
        ...baseChatDetails,
        [messageData.data.roomId]: messageData.data.users,
      };
      setbaseChatDetails(resp);
      updateUserInfo(messageData.data.roomId, resp);
      console.log(resp, "Joined");
    } else if (messageData.type === "newUser") {
    }
  };

  const handleTypingUsersEvents = (messageData) => {
    const {
      type,
      data: { user: userId },
    } = messageData;
    if (type === "typing") {
      const chatDetails =
        baseChatDetails[chatRoomId] || getChatInfo(chatRoomId) || [];
      const { userName } =
        chatDetails.find((item) => item.userId === userId) || {};
      const updatedTypingUsers = [
        ...usersTyping,
        {
          userId,
          userName,
        },
      ];
      setUsersTyping(updatedTypingUsers);
    } else if (type === "typingStopped") {
      const updatedTypingUsers = usersTyping.filter(
        (item) => item.userId !== userId,
      );
      setUsersTyping(updatedTypingUsers);
    }
  };

  const handleNewUserAddedEvents = (messageData) => {
    const { type, data } = messageData;
    const isCurrentUser = data.user === userId;
    debugger;
    if (type === "newUser" && !isCurrentUser) {
      debugger;
      const newUser = {
        userId: data.user,
        userName: data.userName,
      };
      const updatedUsers = {
        ...baseChatDetails,
      };
      updatedUsers[chatRoomId].push(newUser);
      // uniq(updatedUsers[chatRoomId], "userId");
      setbaseChatDetails(updatedUsers);
      updateUserInfo(chatRoomId, updatedUsers);
    }
  };

  const reconnectWebsocket = () => {
    const protocol = window.location.protocol.includes("https") ? "wss" : "ws";
    const url = isProduction()
      ? webSocketUrl
      : `${window.location.hostname}:9699`;
    console.log(`Attempting to reconnect in ${5000 / 1000} seconds...`);
    setTimeout(() => {
      const newWs = new WebSocket(`${protocol}://${url}`);
      setWs(newWs);
    }, 50000);
  };

  const handleJoin = () => {
    const chatDetails = getChatInfo(chatRoomId) || [];
    if (isEmpty(chatDetails)) {
      navigate(`/chat/${chatRoomId}`);
    }
    const { userName } =
      chatDetails.find((item) => item.userId === userId) || {};
    debugger;
    ws &&
      ws.send(
        JSON.stringify({
          type: "join",
          message: "Join Chat",
          roomId: chatRoomId,
          userId: userId,
          userName: userName,
        }),
      );
  };

  const onSubmit = () => {
    const newMessage = {
      type: "message",
      message: inputValue,
      roomId: chatRoomId,
      userId: userId,
    };
    ws.send(JSON.stringify(newMessage));
    setInputValues("");
    isMobile && stopTyping(chatRoomId);
  };

  const handleLeave = () => {
    ws.close();
  };

  function startTyping(roomId) {
    ws.send(JSON.stringify({ type: "startTyping", roomId, userId: userId }));
  }

  function stopTyping(roomId) {
    ws.send(JSON.stringify({ type: "stopTyping", roomId, userId: userId }));
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && Boolean(ws)) {
      onSubmit();
    }
  };

  const renderMessage = () => {
    const chatDetails =
      baseChatDetails[chatRoomId] || getChatInfo(chatRoomId) || [];
    return (
      <div className="chatWrapper">
        {messages.map(({ type, data }) => {
          const { userName } =
            chatDetails.find((item) => item.userId === data.user) || {};
          const isCurrentUser = data.user === userId;
          if (type === "message") {
            return (
              <div className={isCurrentUser ? "messageRight" : "messageLeft"}>
                <div className="messageContent">
                  <p>{data.message}</p>
                  <span>
                    {userName} at {data.timestamp}
                  </span>
                </div>
              </div>
            );
          } else if (type === "newUser" && !isCurrentUser) {
            return (
              <div className="messageCenter">
                <p>{data.userName} has Joined.</p>
              </div>
            );
          }
        })}
      </div>
    );
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    messageApi.open({
      type: "success",
      content: "Invitation link copied to clipboard.",
    });
  };

  const pingServer = async () => {
    const serverResp = await checkServerHealth();
    if (serverResp) {
      setIsserverUp(serverResp);
    }
  };

  const getTypingUsers = () => {
    const users = usersTyping && usersTyping.map((item) => item.userName);
    return uniq(users).join(", ");
  };

  const getUsersList = () => {
    const chatDetails =
      baseChatDetails[chatRoomId] || getChatInfo(chatRoomId) || [];
    debugger;
    const users = chatDetails.map((item) => {
      return {
        key: item.userId,
        label: item.userName,
      };
    });
    console.log(users, chatDetails, "fffff");
    const a = [
      {
        key: "1",
        label: " 1st menu item",
      },
      {
        key: "2",
        label: " 2nd menu item",
      },
    ];
    return users;
  };

  if (!isServerUp) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Loader title="Starting the free tier server." />
      </div>
    );
  }
  return (
    <Layout>
      {contextHolder}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ overflow: "auto", height: "90vh", display: "none" }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "nav 1",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "nav 2",
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "nav 3",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            paddingLeft: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                // height: 64,
              }}
            />
            <Dropdown
              menu={{ items: getUsersList() }} // Call the function to get items
              placement="bottom"
              arrow
            >
              <Button>Users</Button>
            </Dropdown>
          </div>
          <div
            onClick={() =>
              copyLink(`${window.location.origin}/chat/${chatRoomId}`)
            }
          >
            <Tag color="#2db7f5">Copy nvitation Link </Tag>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            minHeight: "80vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            position: "relative",
            maxHeight: "80vh",
          }}
        >
          <>
            {renderMessage()}
            {/* <button onClick={handleJoin}>Join Room</button>
            <button onClick={handleLeave}>Leave Room</button> */}
            <div className="messageForm">
              <div>
                {usersTyping.length > 0 && (
                  <p className="messageFormTyping">
                    {getTypingUsers()} typing...{" "}
                  </p>
                )}

                <Input
                  value={inputValue}
                  placeholder="Message"
                  onChange={(e) => {
                    setInputValues(e.target.value);
                  }}
                  onFocus={() => startTyping(chatRoomId)}
                  onBlur={() => stopTyping(chatRoomId)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button onClick={onSubmit} disabled={Boolean(!ws)}>
                Send
              </Button>
            </div>
          </>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Chat;
