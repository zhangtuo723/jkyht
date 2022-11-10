import React, { Component } from 'react'
import styles from './index.module.scss'
import { Card, Breadcrumb, Form, Radio, Button, Select } from 'antd'
import { Link } from 'react-router-dom'
import { ArticleStatus } from 'api/constants'
import {getChannels} from 'api/channel'
export default class ArticleList extends Component {
  state = {
    channels:[]
  }
  onFinish = (value) => {
    console.log(value)
  }
  render() {
    return (
      <div className={styles.root}>
        <Card
          title={
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/home">首页</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>内容管理</Breadcrumb.Item>
            </Breadcrumb>
          }
        >
          <Form
            initialValues={{
              status: -1,
            }}
            onFinish={this.onFinish}
          >
            <Form.Item label="状态" name="status">
              <Radio.Group>
                {ArticleStatus.map((item) => (
                  <Radio key={item.id} value={item.id}>
                    {item.name}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item label="频道" name="channel_id">
              <Select
                // defaultValue="lucy"
                placeholder='请选择文章频道'
                style={{ width: 200 }}
                options={this.state.channels.map((item)=>{
                  return {value:item.id,label:item.name}
                })}
              />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit">筛选</Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
  async componentDidMount(){
    const res = await getChannels()
    // console.log(res);  
    this.setState({
      channels:res.data.channels
    }) 
  }
}
