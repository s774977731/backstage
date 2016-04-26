import React from 'react';
import { Link } from 'react-router';
import reqwest from 'reqwest';
const moment = require('moment');
moment.locale('zh-cn');

import {
  Row,
  Col,
  Button,
  Icon,
  Menu,
  Checkbox,
  Table,
  Form,
  Input,
  Popover,
  Select,
  Pagination,
  Tag,
  Spin,
  message
} from 'antd';
//全局链接
let publicParamsJSON = sessionStorage.publicParams;
let publicParams = JSON.parse(publicParamsJSON);
let publicUrl = sessionStorage.publicUrl;

class LiveVideo extends React.Component{

  constructor() {
    super();
    this.state = {
      total:1,
      spin:true
    };
    this.getVideos = this.getVideos.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getVideoNum = this.getVideoNum.bind(this);
  }

  columns() {
    return[{
      title: 'ID',
      width:'10%',
      dataIndex: 'id'
    }, {
      title: '标题',
      width:'15%',
      dataIndex: 'name'
    }, {
      title: '创建时间',
      width:'15%',
      dataIndex: 'create_time',
      render:(text,record) =>
        moment.unix(text).format('YYYY-MM-DD')
    },{
      title: '开播时间',
      width:'15%',
      dataIndex: 'start'
    },{
      title: '直播状态',
      width:'10%',
      dataIndex: 'status',
      render:  function (text) {
        if(text == 1) {
          return <Tag color="green">未开播</Tag>
        }else if(text == 2) {
          return <Tag style={{backgroundColor:'red',color:'white'}}>正在直播</Tag>
        }else if(text == 3) {
          return <Tag color="blue">已结束</Tag>
        }else {
          return <Tag color="yellow">无效</Tag>
        }
      }
    }, {
      title: '评论权限',
      width:'10%',
      dataIndex: 'audit',
      render: (text) =>
        <div>
          {!text ? <Tag color="yellow">关闭评论</Tag> :<Tag color="blue">开放评论</Tag>}
        </div>
    },{
      key: 'operation',
      className:'text-right',
      render:function(text,record) {
        return (
          <span>
            <Button onClick={this.getRoomContent.bind(this,record.id,record)} type="ghost"><Icon type="play-circle-o" />查看/审核直播</Button>
            <Button onClick={this.getVideoItem.bind(this,record.id)} type="ghost"><Icon type="setting"/></Button>
            <Button type="ghost" onClick={this.recommend.bind(this,record,record.id)}>{record.recommend == 1 ? '取消推荐' : '推荐'}</Button>
          </span>
        );
      }.bind(this)
    }]
  }

  recommend(record,id) {
    console.log(record.recommend);
    if(record.recommend == 1) {
      publicParams.service = 'Admin.Unrecommend';
    }else {
      publicParams.service = 'Admin.Recommend';
    }
    publicParams.type = 3;
    publicParams.id = id;
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result);
        this.getVideos();
        setTimeout(function () {
          if(record.recommend == 0) {
            message.success('推荐成功')
          }else{
            message.success('取消推荐成功')
          }
        },700)
      },
      error: (err) => {
        console.log(err);
        this.setState({ loading: false });
        switch (err.status) {
          case 404:
            message.error('获取数据失败，请联系官方人员！');
            break;
          default:
            message.error('获取数据失败，请刷新重试！');
            break;
        }
      }
    });
  }

  getVideoItem(video_id) {
    publicParams.service = 'Admin.GetVideo';
    publicParams.video_id = video_id;
    window.Video = video_id;
    this.fetch();
  }

  getRoomContent(room_id,record) {
    //获取直播间的直播内容
    publicParams.service = 'Admin.GetRoomContent';
    publicParams.room_id = room_id;
    window.record = record;
    this.fetch();
    //获取评论列表
    publicParams.service = 'Admin.GetComments';
    publicParams.type = 3;
    publicParams.id = room_id;
    this.fetch();
  }

  fetch() {
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result.data);
        if (result.data.videos) {
          console.log(result.data.videos);
          this.setState({
            spin:false,
            data:result.data.videos
          });
          //存值到sessionStorage
        }
        if (result.data.num) {
          this.setState({
            spin:false,
            total:result.data.num
          })
        }
        //Admin.GetVideo
        if(result.data.video) {
          window.video = result.data.video;
          window.location.href = '/#/new-live-video'
        }
        //获取直播间的直播内容
        if(result.data.content) {
          window.roomCheck = result.data.content;
          window.location.href = '/#/video-check'
        }
        //获取评论列表
        if(result.data.comments) {
          window.comments = result.data.comments;
          window.location.href = '/#/room-check'
        }

      },
      error: (err) => {
        console.log(err);
        this.setState({ loading: false });
        switch (err.status) {
          case 404:
            message.error('获取数据失败，请联系官方人员！');
            break;
          default:
            message.error('获取数据失败，请刷新重试！');
            break;
        }
      }
    });
  }

  handleAddVideo() {
    window.room = {};
    window.location.href = '/#/new-live-video'
  }

  handleChange(current) {
    console.log(current);
    publicParams.page = current;
    this.getVideos()
  }

  getVideos() {
    publicParams.service = 'Admin.GetVideos';
    this.fetch()
  }

  getVideoNum() {
    publicParams.service = 'Admin.GetVideoNum';
    this.fetch()
  }

  componentWillMount() {
    this.getVideos();
    this.getVideoNum();
  }

  render() {
    const{ data, spin } = this.state;
    const { getFieldProps } = this.props.form;

    return(
      <Spin spining={spin}>
        <header className="ant-video-header">
          {/*与Article同步CSS代码*/}
          <header className="article-right-header">
            <Row>
              <Col span="2" offset="14">
                <Button onClick={this.handleAddVideo} className="fish-btn-black" style={{width:'100%',height:'40px'}}><Icon style={{marginLeft:'-5px'}} type="plus"/>新建直播</Button>
              </Col>
              {/*Group*/}
              <Form onSubmit={this.handleSubmit} form={this.props.form}>
                <Col span="2" offset="1">
                  <Select defaultValue="all" size="large">
                    <Option value="all">全部</Option>
                    <Option value="ID">ID</Option>
                    <Option value="nickName">昵称</Option>
                    <Option value="user">账号</Option>
                  </Select>
                </Col>
                <Col span="3">
                  <Input {...getFieldProps('key')} style={{height:'40px'}} />
                </Col>
                <Col span="2">
                  <Button htmlType="submit" type="ghost" style={{width:'100%',height:'40px'}}>提交</Button>
                </Col>
              </Form>
            </Row>
          </header>
        </header>
        <article className="ant-video-content">
          {/*主体内容*/}
          <section className="article-right-content">
            <div style={{width:'2rem',height:'2rem'}}></div>
            <Table rowSelection={null}
                   pagination = {{
                   defaultCurrent:1,
                   onChange:this.handleChange,
                   total:this.state.total}}
                   dataSource={data}
                   columns={this.columns()} />
            <br />
          </section>
        </article>
        <footer className="ant-video-footer">
        </footer>
      </Spin>
    )
  }
}

LiveVideo = Form.create()(LiveVideo);
export default LiveVideo;

