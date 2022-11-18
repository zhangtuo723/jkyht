import React, { Component } from "react";
import { Select } from "antd";
import {getChannels} from 'api/channel'
export default class Channel extends Component {
  state = {
    channels: [],
  };

  getChannelList = async () => {
    const res = await getChannels();
    // console.log(res);
    this.setState({
      channels: res.data.channels,
    });

  };
  componentDidMount() {
    this.getChannelList();
  }

  render() {
    // console.log(this.props);
    return (
      <Select
        value={this.props.value}
        // defaultValue={this.props.value}
        onChange={this.props.onChange}
        // defaultValue="lucy"
        placeholder="请选择文章频道"
        style={{ width: 200 }}
        options={this.state.channels.map((item) => {
          return { value: item.id, label: item.name };
        })}
      />
    );
  }
}
