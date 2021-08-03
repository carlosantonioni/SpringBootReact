import { useState, useEffect } from "react";
import { getAllStudents } from "./client";
import {Layout, Menu, Breadcrumb, Table, Spin, Empty, Button, Badge, Tag} from 'antd';
import StudentDrawerForm from "./StudentDrawerForm";
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import './App.css';
import Avatar from "antd/es/avatar/avatar";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu
const TheAvatar = ({name}) => {
    let trim = name.trim();
    if (trim.length === 0) {
        return <Avatar icon={<UserOutlined/>}/>
    }
    const split = trim.split(" ");
    if (split.length === 1) {
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>
        {`$return {name.charAt(0)}${name.charAt(name.length - 1)}`}
    </Avatar>
}

const columns = [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) => <TheAvatar name={student.name}/>
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },

];
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function App() {
  const [students, setStudents] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [collapsed, setCollapse] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const fetchStudents = () =>
      getAllStudents()
          .then(res => res.json())
          .then(data => {
              console.log(data);
              setStudents(data);
              setFetching(false);
          });

  useEffect(() => {
      console.log("Component is mounted");
      fetchStudents();
  }, []);

  const renderStudents = () => {
      if (fetching) {
          return <Spin indicator={antIcon} />;
      }

      if (students.length <= 0) {
          return <Empty />;
      }

      return <>
        <StudentDrawerForm
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
          fetchStudents = {fetchStudents}
        />
        <Table
          dataSource={students}
          columns={columns}
          bordered
          title={() =>
              <>
                  <Button
                      onClick={() => setShowDrawer(!showDrawer)}
                      type="primary"
                      icon={<PlusOutlined />}
                      size="small">
                    Add New
                  </Button>
                  <Tag style={{marginLeft: "5px"}}>Number of students</Tag>
                  <Badge count={students.length} className="site-badge-count-4"/>
              </>
          }
          scroll={{ y: 550}}
          pagination={{pageSize: 8}}
          rowKey={(students) => students.id}
        />
      </>
  }

  return <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1" icon={<PieChartOutlined />}>
                  Option 1
              </Menu.Item>
              <Menu.Item key="2" icon={<DesktopOutlined />}>
                  Option 2
              </Menu.Item>
              <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                  <Menu.Item key="3">Tom</Menu.Item>
                  <Menu.Item key="4">Bill</Menu.Item>
                  <Menu.Item key="5">Alex</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                  <Menu.Item key="6">Team 1</Menu.Item>
                  <Menu.Item key="8">Team 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="9" icon={<FileOutlined />}>
                  Files
              </Menu.Item>
          </Menu>
      </Sider>
      <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>User</Breadcrumb.Item>
                  <Breadcrumb.Item>User</Breadcrumb.Item>
              </Breadcrumb>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                  { renderStudents() }
              </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Carlos Antonioni © 2018</Footer>
      </Layout>
  </Layout>
}

export default App;
