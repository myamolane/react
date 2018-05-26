import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux, Link} from 'dva/router';
import {
    Form,
    Input,
    Button,
    Select,
    Row,
    Col,
    Popover,
    Progress
} from 'antd';
import styles from './ResetPassword.less';

const FormItem = Form.Item;
const {Option} = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
    ok: <div className={styles.success}>强度：强</div>,
    pass: <div className={styles.warning}>强度：中</div>,
    poor: <div className={styles.error}>强度：太短</div>
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({forget, loading}) => ({forget, submitting: loading.effects['forget/reset']}))
@Form.create()
export default class ResetPassword extends Component {
    state = {
        confirmDirty: false,
        visible: false,
        help: ''
    };

    getPasswordStatus = () => {
        const {form} = this.props;
        const value = form.getFieldValue('password');
        if (value && value.length > 11) {
            return 'ok';
        }
        if (value && value.length > 8) {
            return 'pass';
        }
        return 'poor';
    };

    handleSubmit = e => {
        e.preventDefault();
        this
            .props
            .form
            .validateFields({
                force: true
            }, (err, values) => {
                if (!err) {
                    this
                        .props
                        .dispatch({
                            type: 'forget/reset',
                            payload: {
                                ...values,
                                code: this.props.match.params.code
                            }
                        });
                }
            });
    };

    handleConfirmBlur = e => {
        const {value} = e.target;
        this.setState({
            confirmDirty: this.state.confirmDirty || !!value
        });
    };

    checkConfirm = (rule, value, callback) => {
        const {form} = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不匹配!');
        } else {
            callback();
        }
    };

    checkPassword = (rule, value, callback) => {
        if (!value) {
            this.setState({
                help: '请输入密码！',
                visible: !!value
            });
            callback('error');
        } else {
            this.setState({help: ''});
            if (!this.state.visible) {
                this.setState({
                    visible: !!value
                });
            }
            if (value.length < 8) {
                callback('error');
            } else {
                const {form} = this.props;
                if (value && this.state.confirmDirty) {
                    form.validateFields(['confirm_password'], {force: true});
                }
                callback();
            }
        }
    };

    renderPasswordProgress = () => {
        const {form} = this.props;
        const value = form.getFieldValue('password');
        const passwordStatus = this.getPasswordStatus();
        return value && value.length
            ? (
                <div className={styles[`progress-${passwordStatus}`]}>
                    <Progress
                        status={passwordProgressMap[passwordStatus]}
                        className={styles.progress}
                        strokeWidth={6}
                        percent={value.length * 10 > 100
                        ? 100
                        : value.length * 10}
                        showInfo={false}/>
                </div>
            )
            : null;
    };

    render() {
        const {form, submitting} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div className={styles.main}>
                <h3>设置密码</h3>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem help={this.state.help}>
                        <Popover
                            content={< div style = {{ padding: '4px 0' }} > {
                            passwordStatusMap[this.getPasswordStatus()]
                        }
                        {
                            this.renderPasswordProgress()
                        } < div style = {{ marginTop: 10 }} > 请至少输入 8 个字符。请不要使用容易被猜到的密码。 < /div> </div >}
                            overlayStyle={{
                            width: 240
                        }}
                            placement="right"
                            visible={this.state.visible}>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        validator: this.checkPassword
                                    }
                                ]
                            })(<Input size="large" type="password" placeholder="至少8位密码，区分大小写"/>)}
                        </Popover>
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('confirm_password', {
                            rules: [
                                {
                                    required: true,
                                    message: '请确认密码！'
                                }, {
                                    validator: this.checkConfirm
                                }
                            ]
                        })(<Input size="large" type="password" placeholder="确认密码"/>)}
                    </FormItem>
                    <FormItem
                        style={{
                        textAlign: 'center'
                    }}>
                        <Button
                            size="large"
                            loading={submitting}
                            className={styles.submit}
                            type="primary"
                            htmlType="submit">
                            确认
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}
