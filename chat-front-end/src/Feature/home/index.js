import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Layout, theme } from 'antd';
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth as auth } from '../../firebase/config';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { setUserInfo } from './utils';

const Home: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const {id: chatRoomId} = useParams();
  const [user, setUser] = useState('');
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        console.log("uid", uid, user)
      } else {
        // User is signed out
        // ...
        console.log("user is logged out")
      }
    });

  }, [])

  const startChat = () => {
    const chatId = chatRoomId || uuidv4();
    const userId = uuidv4();
    setUserInfo(chatId, userId, user);
    navigate(`/chat/${chatId}/${userId}`);
    
  }
  return (
    <Layout style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', minHeight: '92vh'
    }}>



      <Card
        style={{
          maxWidth: 320,
          background: colorBgContainer,
          padding: 24,
          marginTop: 32,
          marginBottom: 32,
          borderRadius: borderRadiusLG,
          // height: '80vh'


        }}
      >
        <Input placeholder='You name' onChange={(e)=> setUser(e.target.value)}/>
        <Button type="primary" block style={{ marginTop: 10 }} onClick={startChat}>Start Chat</Button>
      </Card>


    </Layout>
  );
};

export default Home;