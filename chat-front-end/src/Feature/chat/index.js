
import React, { useId, useState, useEffect } from 'react';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Form, Input, } from 'antd';
import { useParams } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const Chat: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
const [inputValue, setInputValues] = useState('');
const [messages, setMessages] = useState([]);
const [ws, setWs] = useState(null);

useEffect(() => {
  if (!ws) {
    const newWs = new WebSocket('ws://localhost');
    // Handle connection events here (ws.onopen, ws.onmessage, ws.onclose)
    setWs(newWs);
  }
  // Cleanup function to close the connection on unmount
  return () => ws && ws.close();
}, [ws]);

  const {id: chatRoomId, userId} = useParams();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  console.log('ws', ws)
 if(ws){

  ws.onopen = function(event) {
    console.log('WebSocket connection opened!');
    // You can send initial messages to the server after connection
  };
  
  ws.onmessage = function(event) {
    console.log('Message received from server:', event.data);
    setMessages([...messages, JSON.parse(event.data)]);
    // Process messages received from the server (update UI, etc.)
  };
  
  ws.onclose = function(event) {
    console.log('WebSocket connection closed!', event);
    // Handle disconnection (reconnect logic, etc.)
  };
 }

  const handleJoin = () => {
    ws && ws.send(JSON.stringify({type: 'join', message: 'Join Chat', roomId: chatRoomId, userId: userId}))
  }

  const onSubmit = ( )=> {
    const newMessage = {
      type: 'message',
      message: inputValue,
      roomId: chatRoomId,
      userId: userId
    }
    ws.send(JSON.stringify(newMessage))
  }

  const handleLeave = () => {
    
    ws.close()
  }
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}  style={{ overflow: 'auto', height: '100vh' }}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'nav 1',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div>
            {JSON.stringify(messages)}
            <button onClick={handleJoin}>Join Room</button>
            <button onClick={handleLeave}>Leave Room</button>
            <Input placeholder="Message" onChange={(e)=> setInputValues(e.target.value)}/>
            <Button onClick={onSubmit}>Submit</Button>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Chat;