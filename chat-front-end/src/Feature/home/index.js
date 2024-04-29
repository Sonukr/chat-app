import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer } = Layout;

const items = new Array(15).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

const Home: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 48px', height: '95vh' }}>
       
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            marginTop: 32,
            marginBottom: 32,
            borderRadius: borderRadiusLG,
            height: '80vh'
          }}
        >
          Content
        </div>
      </Content>
      
    </Layout>
  );
};

export default Home;