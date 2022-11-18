import React, { Component } from "react";
import {
  Card,
  Form,
  Breadcrumb,
  Button,
  Input,
  Radio,
  Upload,
  Modal,
  message,
} from "antd";
import Channel from "components/Channel";
import styles from "./index.module.scss";
import { PlusOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { baseURL } from "utils/request";
import { pubArticle, getArticleById, updateArticle } from "api/article";
import {Link} from 'react-router-dom'
export default class ArticlePublish extends Component {
  state = {
    type: 3,
    fileList: [],
    showPreview: false,
    previewUrl: "",
    id: this.props.match.params.id,
  };
  formRef = React.createRef();
  async componentDidMount() {
    if (this.state.id) {
      const res = await getArticleById(this.state.id);
      // console.log(res);
      const fileList = res.data.cover.images.map((item) => {
        return { url: item };
      });
      this.setState({
        fileList: fileList,
        type: res.data.cover.type,
      });
      this.formRef.current.setFieldsValue({
        ...res.data,
        type: res.data.cover.type,
      });
    }
  }
  render() {
    // console.log(this.props);
    const { showPreview, previewUrl } = this.state;
    return (
      <div className={styles.root}>
        <Card
          title={
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/home">首页</Link>
                {/* <a href="/home">首页</a> */}
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {this.state.id ? "修改文章" : "发布文章"}
              </Breadcrumb.Item>
            </Breadcrumb>
          }
        >
          <Form
            ref={this.formRef}
            labelCol={{ span: 4 }}
            size="large"
            onFinish={this.onFinish}
            initialValues={{
              title: "",
              channel_id: 2,
              content: "",
              type: this.state.type,
            }}
          >
            <Form.Item
              label="标题:"
              name="title"
              rules={[
                {
                  required: true,
                  message: "标题不能为空",
                },
              ]}
            >
              <Input
                style={{ width: 400 }}
                placeholder="请输入文章的标题"
              ></Input>
            </Form.Item>
            <Form.Item label="频道:" name="channel_id">
              <Channel></Channel>
            </Form.Item>

            <Form.Item label="封面:" name="type">
              <Radio.Group onChange={this.changeType}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4 }}>
              {this.state.type !== 0 && (
                <Upload
                  listType="picture-card"
                  fileList={this.state.fileList}
                  action={`${baseURL}/upload`}
                  onChange={this.uploadChange}
                  name="image"
                  onPreview={this.handlePreview}
                  beforeUpload={this.beforeUpload}
                >
                  {this.state.fileList.length < this.state.type && (
                    <PlusOutlined></PlusOutlined>
                  )}
                </Upload>
              )}
            </Form.Item>

            <Form.Item
              label="内容:"
              name="content"
              rules={[{ required: true, message: "内容不能为空" }]}
            >
              <ReactQuill
                theme="snow"
                placeholder="请输入文章内容"
              ></ReactQuill>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Button type="primary" htmlType="submit" size="large">
                {this.state.id ? "修改文章" : "发布文章"}
              </Button>
              <Button size="large" onClick={this.saveDraft}>
                存入草稿
              </Button>
            </Form.Item>
          </Form>
          <Modal
            open={showPreview}
            title="图片预览"
            footer={null}
            onCancel={this.handleCancel}
          >
            <img
              alt="example"
              style={{
                width: "100%",
              }}
              src={previewUrl}
            />
          </Modal>
        </Card>
      </div>
    );
  }
  uploadChange = ({ fileList }) => {
    console.log(fileList);
    this.setState({
      fileList: fileList,
    });
  };
  changeType = (e) => {
    // console.log(e);
    this.setState({
      type: e.target.value,
      fileList: [],
    });
  };

  save = async (value, draft) => {
    const { type, fileList } = this.state;

    if (fileList.length !== type) {
      return message.error("封面数量对不上");
    }
    const images = fileList.map((item) => item.url || item.response.data.url);
    const cover = { type, images };
    const data = { ...value, cover };
    try {
      if (this.state.id) {
        await updateArticle(data, this.state.id, draft);
        message.success("修改成功", 1, () => {
          this.props.history.push("/home/list");
        });
      } else {
        await pubArticle(data, draft);
        message.success("发布成功", 1, () => {
          this.props.history.push("/home/list");
        });
      }
    } catch (error) {
      message.error(error);
    }
  };
  saveDraft = async () => {
    const value = await this.formRef.current.validateFields();
    this.save(value, true);
  };

  onFinish = async (value) => {
    this.save(value, false);
  };
  handlePreview = (file) => {
    // console.log(file);
    const url = file.url || file.response.data.url;
    this.setState({
      showPreview: true,
      previewUrl: url,
    });
  };
  handleCancel = () => {
    this.setState({
      showPreview: false,
      previewUrl: "",
    });
  };
  beforeUpload = (file) => {
    if (file.size > 1024 * 1024 * 5) {
      message.warn("图片大小超过5M");
      return Upload.LIST_IGNORE;
    }
    if (!["image/png", "image/jpg"].includes(file.type)) {
      message.warn("上传格式有误");
      return Upload.LIST_IGNORE;
    }

    return true;
  };
}
