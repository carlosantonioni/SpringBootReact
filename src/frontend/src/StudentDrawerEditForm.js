import {Drawer, Input, Col, Select, Form, Row, Button, Spin} from 'antd';
import {updateStudent} from "./client";
import {useState} from "react";
import {LoadingOutlined} from "@ant-design/icons";
import {errorNotification, successNotification} from "./Notification";

const {Option} = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function StudentDrawerForm({showDrawerEdit, setShowDrawerEdit, fetchStudents, studentEdit}) {

    console.log(studentEdit);

    const onCLose = () => {
        setShowDrawerEdit(false);
        setDestroyOnClose(true)
    };
    const [destroyOnClose, setDestroyOnClose] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const onFinish = student => {
        setSubmitting(true)
        console.log("ID STUDENT::::  " + student.id);
        console.log(JSON.stringify(student, null, 2))
        updateStudent(student)
            .then(() => {
                console.log("Student added");
                successNotification(
                    "Student successfully added",
                    `${student.name} was added to the system`
                );
                onCLose();
                fetchStudents();
            }).catch(err => {
            console.log(err);
            err.response.json().then(res => {
                console.log(res);
                errorNotification(
                    "There was an error: ",
                    `${res.message} [${res.status}] [${res.error}]`,
                    "bottomLeft"
                );
            });
        }).finally(() => {
            setSubmitting(false);
        })
    };

    const onFinishFailed = errorInfo => {
        alert(JSON.stringify(errorInfo, null, 2));
    };

    return <Drawer
        title="Edit register"
        width={720}
        onClose={onCLose}
        visible={showDrawerEdit}
        destroyOnClose={destroyOnClose}
        bodyStyle={{paddingBottom: 80}}
        footer={
            <div
                style={{
                    textAlign: 'right',
                }}
            >
                <Button onClick={onCLose} style={{marginRight: 8}}>
                    Cancel
                </Button>
            </div>
        }
    >
        <Form layout="vertical" onFinishFailed={onFinishFailed} onFinish={onFinish} hideRequiredMark>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item initialValue={studentEdit.id} name="id" label="id" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item initialValue={studentEdit.name} name="name" label="Name" rules={[{required: true, message: 'Enter student name'}]}>
                        <Input/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item initialValue={studentEdit.email} name="email" label="Email" rules={[{required: true, message: 'Enter student email'}]}>
                        <Input/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item initialValue={studentEdit.gender} name="gender" label="Gender" rules={[{required: true, message: 'Select a gender'}]}>
                        <Select>
                            <Option value="MALE">MALE</Option>
                            <Option value="FEMALE">FEMALE</Option>
                            <Option value="OTHER">OTHER</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                {submitting && <Spin indicator={antIcon} />}
            </Row>
        </Form>
    </Drawer>
}

export default StudentDrawerForm;