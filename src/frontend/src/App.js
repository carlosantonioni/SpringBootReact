import {useState, useEffect} from "react";
import {deleteStudent, getAllStudents} from "./client";
import {Layout, Menu, Breadcrumb, Table, Spin, Empty, Button, Badge, Tag, Popconfirm, Radio} from 'antd';
import StudentDrawerForm from "./StudentDrawerForm";
import StudentDrawerEditForm from "./StudentDrawerEditForm";
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
import {errorNotification, successNotification} from "./Notification";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu
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
const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then(() => {
        successNotification("Student deleted", `Student ${studentId} deleted successfully`);
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                "There was an issue: ",
                `${res.message} [${res.status}] [${res.error}]`
            );
        });
    });
}

function App() {
    const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;
    const [students, setStudents] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [collapsed, setCollapse] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [showDrawerEdit, setShowDrawerEdit] = useState(false);
    const [studentEdit, setStudentEdit] = useState([]);

    const columns = fetchStudent => [
        {
            title: '',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (text, student) =>
                <TheAvatar name={student.name}/>
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
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, student) =>
                <Radio.Group>
                    <Popconfirm
                        placement='topRight'
                        title={`Are you sure to delete ${student.name}`}
                        onConfirm={() => removeStudent(student.id, fetchStudent)}
                        okText='Yes'
                        cancelText='No'>
                        <Radio.Button value="small">Delete</Radio.Button>
                    </Popconfirm>
                    <Radio.Button value="small" onClick={() => {
                        setShowDrawerEdit(!showDrawerEdit)
                        setStudentEdit(student)
                    }}>Edit</Radio.Button>

                </Radio.Group>
        },
    ];

    const fetchStudents = () =>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setStudents(data);
                setFetching(false);
            }).catch(err => {   //Handling error clients side block start
            console.log(err.response);
            err.response.json().then(res => {
                console.log(res);
                errorNotification(
                    "There was an error: ",
                    `${res.message} [${res.status}] [${res.error}]`
                );
            }); // Handling error clients side end block
        }).finally(() => setFetching(false));

    useEffect(() => {
        console.log("Component is mounted");
        fetchStudents();
    }, []);

    const renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon}/>;
        }

        if (students.length <= 0) {
            return <>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                    Add New
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Empty/>
            </>
        }

        return <>
            <StudentDrawerEditForm
                showDrawerEdit={showDrawerEdit}
                setShowDrawerEdit={setShowDrawerEdit}
                fetchStudents={fetchStudents}
                studentEdit={studentEdit}
            />
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
            <Table
                dataSource={students}
                columns={columns(fetchStudents)}
                bordered
                title={() =>
                    <>
                        <Button
                            onClick={() => setShowDrawer(!showDrawer)}
                            type="primary"
                            icon={<PlusOutlined/>}
                            size="small">
                            Add New
                        </Button>
                        <Tag style={{marginLeft: "5px"}}>Number of students</Tag>
                        <Badge count={students.length} className="site-badge-count-4"/>
                    </>
                }
                scroll={{y: 550}}
                pagination={{pageSize: 8}}
                rowKey={(students) => students.id}
            />
        </>
    }

    return <Layout style={{minHeight: '100vh'}}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapse}>
            <div className="logo"/>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined/>}>
                    Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined/>}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined/>} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined/>} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined/>}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{padding: 0}}/>
            <Content style={{margin: '0 16px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                    {renderStudents()}
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Made by: Carlos Antonioni © 2021 </Footer>
        </Layout>
    </Layout>
}

export default App;
