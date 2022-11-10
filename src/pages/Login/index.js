import React, { Component } from 'react'
import { Card, Button, Checkbox, Form, Input ,message} from 'antd'
import  styles from './index.module.scss'
import logo from 'assets/logo.png'
import {setToken} from 'utils/storage'
import {login} from 'api/user'
export default class Login extends Component {
  state = {
    loading:false
  }
  render() {
    
    return (
      <div className={styles.login}>
        <Card className="login-container">
          <img src={logo} alt="" className="login-logo" />
          {/* 表单 */}
          <Form
          className='aa'
          autoComplete="off" 
          size="large"
          onFinish = {this.onFinish}
          initialValues={{
            mobile:'13911111111',
            code:'246810',
            agree:true
          }}
          >
            <Form.Item
              validateTrigger={['onChange', 'onBlur']}
              name="mobile"
              rules={[
                {
                  required: true,
                  message: '手机号不能为空!',
                },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '手机号格式有误',
                  validateTrigger: 'onBlur',
                },
              ]}
            >
              <Input autoComplete='off' placeholder="请输入手机号" />
            </Form.Item>

            <Form.Item
              name="code"
              validateTrigger={['onChange', 'onBlur']}
              rules={[
                {
                  required: true,
                  message: '验证码不能为空!',
                },
                {
                  pattern: /^\d{6}$/,
                  message: '验证码格式错误!',
                  validateTrigger:'onBlur'
                },
              ]}
            >
              <Input placeholder="请输入验证码" />
            </Form.Item>

            <Form.Item
              valuePropName="checked"
              name="agree"
              rules={[
                // { required: true, message: '请阅读并同意协议' },
              { validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意协议'))}]}
            >
              <Checkbox>我已阅读并同意[隐私条款]和[用户协议]</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button block 
              type="primary" 
              htmlType="submit" 
              loading={this.state.loading}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
  onFinish = async ({mobile,code})=>{
    this.setState({loading:true})
    // console.log(this.props,'llll');

    try {
      const res = await login(mobile,code)
      // console.log(res);
      // 登录成功  保存token  
      message.success('登录成功',0.5,()=>{
        // localStorage.setItem('token',res.data.token)
        setToken(res.data.token)
      // 跳转首页
      // 被路由compoent=的组件都会有props.history
      // 判断 location中是否有值

      const {state} = this.props.location

      if(state){
        this.props.history.push(state.from)
      }else{
        this.props.history.push('/home')
      }


      
      })
      
      
    } catch (error) {
      // console.log(error);
      message.error(error.response.data.message,1)
      this.setState({
        loading:false
      })
      
    }
    
  }
}
