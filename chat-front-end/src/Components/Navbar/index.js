import { Typography } from 'antd';


import { Layout } from 'antd';
const { Header } = Layout;
const { Title } = Typography;

export default function Navbar() {
  return (
    <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="demo-logo" >
        <Title level={3} style={{color: '#fff', margin: 0}}>Chat App</Title>
        </div>
        {/* <NavLink to="/signup">
          Login
        </NavLink> */}
    </Header>
  )
}
