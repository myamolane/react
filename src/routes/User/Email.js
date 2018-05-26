import React, {Component} from 'react';
import {Button} from 'antd';
import {Link} from 'dva/router';
import Result from 'components/Result';
import styles from './RegisterResult.less';
import { connect } from 'dva';

const actions = (
    <div className={styles.actions}>
        <Link to="/">
            <Button size="large">返回首页</Button>
        </Link>
    </div>
);
@connect(({ forget, loading }) => ({
    forget,
    submitting: loading.effects['forget/verifyEmail'],
}))
export default class Email extends Component {
    componentDidMount() {
        this.props.dispatch({
            type: 'forget/verifyEmail',
            payload: this.props.match.params.code
        })
    }
    render() {
        console.log('render')
        console.log(this.props)
        console.log(this.state)

        const {status, title, description } = this.props.forget
        
        return (
        <Result
            className={styles.registerResult}
            type={status}
            title={
                <div className = {styles.title} > 
                    {title} 
                </div>
            }
            description={description}
            actions={actions}
            style={{
            marginTop: 56
        }}/>
        )
    }
}
