import { Typography } from "antd";

import { Layout } from "antd";
import { useNavigate } from "react-router-dom";
const { Header } = Layout;
const { Title } = Typography;

export default function Navbar() {

  const navigate = useNavigate('');
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div className="demo-logo" onClick={() => navigate(`/`)}>
        <Title level={3} style={{ color: "#fff", margin: 0 }}>
          Live chat
        </Title>
      </div>
      {/* <NavLink to="/signup">
          Login
        </NavLink> */}
    </Header>
  );
}
