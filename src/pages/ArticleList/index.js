import React, { Component } from "react";
import styles from "./index.module.scss";
import Channel from 'components/Channel'
import {
  Card,
  Breadcrumb,
  Form,
  Radio,
  Button,

  DatePicker,
  Table,
  Tag,
  Modal,
  message,
} from "antd";
import { Link } from "react-router-dom";
import { ArticleStatus } from "api/constants";
import { getArticleList,delArticle } from "api/article";
import defaultImg from "assets/error.png";
import { DeleteOutlined, EditOutlined,ExclamationCircleOutlined  } from "@ant-design/icons";
const { RangePicker } = DatePicker;
const { confirm } = Modal
export default class ArticleList extends Component {
  reqParams = {
    page: 1,
    per_page: 10,
    status: null,
    channel_id: null,
    begin_pubdate: null,
    end_pubdate: null,
  };
  state = {
    
    articles: {},
  };
  onFinish = (value) => {
    console.log(value);
    this.reqParams.channel_id =
      value.channel_id === undefined ? null : value.channel_id;
    // console.log(this.reqParams);
    this.reqParams.status = value.status !== -1 ? value.status : null;

    if (value.data) {
      console.log(value);
      this.reqParams.begin_pubdate = value.data[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      this.reqParams.end_pubdate = value.data[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }else{
      // 置为空和删掉都行
      this.reqParams.begin_pubdate = null
      delete this.reqParams.end_pubdate
    }


    this.reqParams.page = 1
    this.getAritcleList(this.reqParams);
  };

  columns = [
    {
      title: "封面",
      // 这里什么也不填的话render拿到的是一个对象
      // 填了的话就是这个对象的属性
      dataIndex: "",
      render: (data) => {
        // console.log(data);
        return (
          <img
            src={data.cover.type !== 0 ? data.cover.images[0] : defaultImg}
            style={{ width: 200, height: 120, objectFit: "cover" }}
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
      render: (status) => {
        const obj = ArticleStatus.find((item) => item.id === status);
        return <Tag color={obj.color}>{obj.name}</Tag>;
      },
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

      render: (data) => {
        return (
          <div>
            <Button onClick={()=>{
              this.handelEdit(data.id)
            }} type="primary" shape="circle" icon={<EditOutlined />} />
            <Button
              type="primary"
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={()=>{
                this.handelDel(data.id)
              }}
            />
          </div>
        );
      },
    },
  ];

 
  handelEdit = (id)=>{
    // console.log(id);
    this.props.history.push('/home/article/'+id)
  }
  handelDel = (id)=>{
    // console.log(id);
    confirm({
      title: '温馨提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除这篇文章吗？',
      onOk:async () => {
        // console.log('OK');
        // 发送请求删除文章
        try {
          await delArticle(id)
          // console.log("删除成功");
          this.getAritcleList(this.reqParams)
          message.success('删除成功')
        } catch (error) {
          console.log(error);
        }

      },
      
    });
  }

  


  render() {
    // console.log(this.state.articles);

    const { total_count, results, page, per_page } = this.state.articles;
    // console.log(per_page);
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
              <Channel></Channel>
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
          <Table
            columns={this.columns}
            dataSource={results}
            rowKey="id"
            pagination={{
              position: ["bottomCenter"],
              pageSize: per_page,
              current: page,
              total: total_count,
              onChange: this.onChange,
            }}
          />
        </Card>
      </div>
    );
  }

  onChange = (page, pageSize) => {
    // console.log(page,pageSize);
    this.reqParams = { ...this.reqParams, page, per_page: pageSize };
    this.getAritcleList(this.reqParams);
  };

  async componentDidMount() {
    // this.getChannelList();
    this.getAritcleList();
  }

  getAritcleList = async (params) => {
    const res = await getArticleList(params);
    // console.log(res1);
    // console.log(res);
    this.setState({
      articles: res.data,
    });
  };
}
