import React, { useState, useEffect } from 'react';
import './style.css';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Input, } from 'antd';
import { useParams } from 'react-router-dom';
import { getChatInfo } from '../home/utils';
import { isProduction, webSocketUrl } from '../../utils/config';

const { Header, Sider, Content } = Layout;

const Chat: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [inputValue, setInputValues] = useState('');
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const { id: chatRoomId, userId } = useParams();
  
  useEffect(() => {
    if (!ws) {
      const protocol = window.location.protocol.includes('https') ? 'wss': 'ws';
      const url = isProduction() ? webSocketUrl : `${window.location.hostname}:9699`;
      const newWs = new WebSocket(`${protocol}://${url}`);
      // Handle connection events here (ws.onopen, ws.onmessage, ws.onclose)
      setWs(newWs);
    }
    // Cleanup function to close the connection on unmount
    return () => ws && ws.close();
  }, [ws]);

  useEffect(()=> {
      if(userId && chatRoomId){
        if(ws && ws.readyState === 1){
          handleJoin();          
        }
      }
  },[chatRoomId, userId, ws])
  

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  if (ws) {
    ws.onopen = function (event) {
      console.log('WebSocket connection opened!');
      if(userId && chatRoomId){
        if(ws && ws.readyState === 1){
          handleJoin();          
        }
      }
      // You can send initial messages to the server after connection
    };

    ws.onmessage = function (event) {
      console.log('Message received from server:', event.data);
      setMessages([...messages, JSON.parse(event.data)]);
      // Process messages received from the server (update UI, etc.)
    };

    ws.onclose = function (event) {
      console.log('WebSocket connection closed!', event);
      // Handle disconnection (reconnect logic, etc.)
    };
  }

  const handleJoin = () => {
    ws && ws.send(JSON.stringify({ type: 'join', message: 'Join Chat', roomId: chatRoomId, userId: userId }))
  }

  const onSubmit = () => {
    const newMessage = {
      type: 'message',
      message: inputValue,
      roomId: chatRoomId,
      userId: userId
    }
    ws.send(JSON.stringify(newMessage))
    setInputValues('')
  }

  const handleLeave = () => {
    ws.close()
  }

  function startTyping(roomId) {
    ws.send(JSON.stringify({ type: 'startTyping', roomId }));
  }

  function stopTyping(roomId) {
    ws.send(JSON.stringify({ type: 'stopTyping', roomId }));
  }

  const handleKeyDown = (e) => {
    if( e.keyCode === 13 ){
      onSubmit();

    }
  }

  const  renderMessage = () => {
    const chatDetails = getChatInfo(chatRoomId);
    return(
      <div className='chatWrapper'>
        {messages.map(({type, data}) => {
          const {userName} = chatDetails.find(item => item.userId === data.user) || {}
          const isCurrentUser = data.user === userId;
          if(type === 'message'){
            return (
              <div className={isCurrentUser ? 'messageRight': 'messageLeft'}>
                <div className="messageContent">
                  <p>{data.message}</p>
                  <span>{userName} at {data.timestamp}</span>
                </div>
              </div>
            )
          }else if(type === 'newUser' && !isCurrentUser){
            
            return(
              <div className='messageCenter'>
                <p>{userName} has Joined.</p>
              </div>
            )
          }
        })}
      </div>
    )
  }

 
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ overflow: 'auto', height: '90vh', display: 'none'}}>
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
        <Header style={{ paddingLeft: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              // height: 64,
            }}
          />
          <div>
            Invite User <span>
              {`${window.location.origin}/chat/${chatRoomId}`}
            </span>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            minHeight: '80vh',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            position: 'relative',
            maxHeight: '80vh'
          }}
        >
          <>
            {renderMessage()}
            {/* <button onClick={handleJoin}>Join Room</button>
            <button onClick={handleLeave}>Leave Room</button> */}
            <div className="messageForm">
            <Input
            value={inputValue}
              placeholder="Message"
              onChange={(e) => { setInputValues(e.target.value) }}
            // onFocus={() => startTyping(chatRoomId)}
            // onBlur={()=> stopTyping(chatRoomId)}
            onKeyDown={handleKeyDown}
            />
            {/* <Button onClick={onSubmit} disabled={Boolean(!ws)}>Submit</Button> */}
            </div>
          </>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Chat;