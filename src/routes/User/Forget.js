import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import styles from './Forget.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const sendTypeMaps = {
    'forget': '找回密码',
    'register': '验证邮箱'
}
@connect(({ forget, loading }) => ({
    forget,
    submitting: loading.effects['forget/request'],
}))
@Form.create()
export default class Forget extends Component {
    state = {
        confirmDirty: false,
        visible: false,
        help: '',
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields({
            force: true
        }, (err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'forget/request',
                    payload: {
                        ...values,
                        send_type: this.props.match.params.send_type
                    },
                });
            }
        });
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    render() {
        const { form, submitting } = this.props;
        const { getFieldDecorator } = form;
        const { count, prefix } = this.state;
        const { send_type } = this.props.match.params
        return (
            <div className={styles.main}>
                <h3>{sendTypeMaps[send_type]}</h3>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入用户名',
                                }
                            ],
                        })(<Input size="large" placeholder="用户名" />)}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('email', {
                            rules: [
                                {
                                    required: true,
                                    message: '邮箱地址格式错误!',
                                },
                            ],
                        })(<Input size="large" placeholder="邮箱" />)}
                    </FormItem>
                    <FormItem style={{ textAlign: 'center'}}>
                        <Button
                            size="large"
                            loading={submitting}
                            className={styles.submit}
                            type="primary"
                            htmlType="submit"
                        >
                            提交
                        </Button>
                         <Link className={styles.login} to="/user/login">
                            登录
                        </Link> 
                    </FormItem>
                    <FormItem>

                    </FormItem>
                </Form>
            </div>
        )
    }
}
