import {
  LogoutOutlined,
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { Layout, Menu, message, Popconfirm } from 'antd'
import React, { Component } from 'react'
import styles from './index.module.scss'
import { Route, Switch, Link } from 'react-router-dom'
import{removeToken} from 'utils/storage'
import Home from 'pages/Home'
import ArticleList from 'pages/ArticleList'
import ArticlePublish from 'pages/ArticlePublish'
import {getUserProfile} from 'api/user'
const { Header, Content, Sider } = Layout


export default class LayoutComponent extends Component {
  state = {
    profile:{}
  }
  


  render() {
    // console.log(this.props);
    return (
      <div className={styles.layout}>
        <Layout>
          <Header className="header">
            <div className="logo" />
            <div className="profile">
              <span>{this.state.profile.name}</span>
              <span>
                
                <Popconfirm
                  title="你确定要退出本系统吗?"
                  onConfirm={this.onConfirm}
                  // onCancel={cancel}
                  okText="确定"
                  cancelText="取消"
                >
                  <LogoutOutlined /> 退出
                  {/* <a href="#">Delete</a> */}
                </Popconfirm>
              </span>
            </div>
          </Header>
          <Layout>
            <Sider width={200}>
              <Menu
                mode="inline"
                theme="dark"
                defaultSelectedKeys={[this.props.location.pathname]}
                style={{
                  height: '100%',
                  borderRight: 0,
                }}
              >
                <Menu.Item key="/home" icon={<HomeOutlined />}>
                  <Link to="/home">数据概览</Link>
                </Menu.Item>
                <Menu.Item key="/home/list" icon={<DiffOutlined />}>
                  <Link to="/home/list">内容管理</Link>
                </Menu.Item>
                <Menu.Item key="/home/article" icon={<EditOutlined />}>
                  <Link to="/home/article">发布文章</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout
              style={{
                padding: '24px',
              }}
            >
              <Content className="site-layout-background">
                {/* 不需要router包起来了 */}
                <Switch>
                  <Route exact path="/home" component={Home}></Route>
                  <Route path="/home/list" component={ArticleList}></Route>
                  <Route
                    path="/home/article"
                    component={ArticlePublish}
                  ></Route>
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    )
  }

   async componentDidMount(){
    // console.log(11);
    const res = await getUserProfile()
    // console.log(res);
    this.setState({
      profile:res.data
    })

  }

  onConfirm = ()=>{
    // console.log('ddd');
    // 移除token
  
    // localStorage.removeItem('token')
    removeToken()
    this.props.history.push('/login')
    message.success('退出成功！')
  }
}
