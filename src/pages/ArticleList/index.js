import React, { Component } from "react";
import styles from "./index.module.scss";
import {
  Card,
  Breadcrumb,
  Form,
  Radio,
  Button,
  Select,
  DatePicker,
  Table,
  Tag,
} from "antd";
import { Link } from "react-router-dom";
import { ArticleStatus } from "api/constants";
import { getChannels } from "api/channel";
import { getArticleList } from "api/article";
import defaultImg from "assets/error.png";
import { DeleteOutlined,EditOutlined } from '@ant-design/icons'
const { RangePicker } = DatePicker;
export default class ArticleList extends Component {
  state = {
    channels: [],
    articles: {},
  };
  onFinish = (value) => {
    console.log(value);
  };
 
  columns = [
    {
      title: "封面",
      // 这里什么也不填的话render拿到的是一个对象
      // 填了的话就是这个对象的属性
      dataIndex: "",
      render: (data) => {
        console.log(data);
        return (
          <img
            src={data.cover.type!== 0 ? data.cover.images[0] : defaultImg}
            style={{width:200,height:120,objectFit:'cover'}}
            alt=""
          />
        );
      },
    },
    {
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "状态",
      dataIndex: "status",
      render:(status)=>{
        const obj = ArticleStatus.find(item=>item.id===status)
        return <Tag color={obj.color}>{obj.name}</Tag>
      }
    },
    {
      title: "发布时间",

      dataIndex: "pubdate",
    },
    {
      title: "阅读数",

      dataIndex: "read_count",
    },
    {
      title: "评论数",

      dataIndex: "comment_count",
    },
    {
      title: "点赞数",

      dataIndex: "like_count",
    },
    {
      title: "操作",

      render:(data)=>{
        return <div>
          <Button type="primary" shape="circle" icon={<EditOutlined />} />
          <Button type="primary" shape="circle" danger icon={<DeleteOutlined />} />
        </div>
      }
    },
  ];

  render() {
    const { total_count, results } = this.state.articles;
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
                placeholder="请选择文章频道"
                style={{ width: 200 }}
                options={this.state.channels.map((item) => {
                  return { value: item.id, label: item.name };
                })}
              />
            </Form.Item>

            <Form.Item name="data">
              <RangePicker />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit">筛选</Button>
            </Form.Item>
          </Form>
        </Card>
        <Card title={`根据筛选条件共查询到${total_count} 条结果`}>
          <Table columns={this.columns} dataSource={results} rowKey="id" />
        </Card>
      </div>
    );
  }
  async componentDidMount() {
    this.getChannelList();
    this.getAritcleList();
  }
  getChannelList = async () => {
    const res = await getChannels();
    // console.log(res);
    this.setState({
      channels: res.data.channels,
    });
  };
  getAritcleList = async () => {
    const res = await getArticleList();
    // console.log(res1);
    this.setState({
      articles: res.data,
    });
  };
}
