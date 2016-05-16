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
      spin:true,
      search:'title'
    };
    this.getVideos = this.getVideos.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getVideoNum = this.getVideoNum.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeSearch = this.changeSearch.bind(this);
  }

  columns() {
    return[{
      title: 'ID',
      width:'10%',
      dataIndex: 'id'
    },{
      title: '头图',
      width:'10%',
      dataIndex: 'cover',
      render:(text) => <img src={text} width="30"/>
    }, {
      title: '标题',
      width:'10%',
      dataIndex: 'name'
    }, {
      title: '创建时间',
      width:'10%',
      dataIndex: 'create_time',
      render:(text,record) => {
        if(text) {
          return moment.unix(text).format('YYYY-MM-DD')
        }else {
          return '-----'
        }
      }
    },{
      title: '开播时间',
      width:'10%',
      dataIndex: 'play_time',
      render:(text) => {
        if(text == 0) {
          return '----------------'
        }else {
          return moment.unix(text).format('YYYY-MM-DD')
        }
      }
    },{
      title: '直播状态',
      width:'10%',
      dataIndex: 'status',
      render:  function (text,record) {
        if(text == 1) {
          record.delete = true;
          return <Tag color="green">未开播</Tag>
        }else if(text == 2) {
          record.delete = false;
          return <Tag style={{backgroundColor:'red',color:'white'}}>正在直播</Tag>
        }else if(text == 3) {
          record.delete = true;
          return <Tag color="blue">已结束</Tag>
        }else {
          record.delete = true;
          return <Tag color="yellow">无效</Tag>
        }
      }
    }, {
      title: '评论权限',
      width:'10%',
      dataIndex: 'audit',
      render: (text) =>
        <div>
          {text == 1 ? <Tag color="yellow">关闭评论</Tag> :<Tag color="blue">开放评论</Tag>}
        </div>
    },{
      key: 'operation',
      className:'text-right',
      render:function(text,record) {
        return (
          <span>
            <Button onClick={this.getVideoContent.bind(this,record.id,record)} type="ghost"><Icon type="play-circle-o" />查看/审核直播</Button>
            <Button onClick={this.getVideoItem.bind(this,record.id,record)} type="ghost"><Icon type="setting"/></Button>
            <Button type="ghost" onClick={this.recommend.bind(this,record,record.id)}>{record.recommend == 1 ? '取消' : '推荐'}</Button>
          </span>
        );
      }.bind(this)
    }]
  }

  recommend(record,id) {
    // console.log(record.recommend);
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
        // console.log(result);
        this.getVideos();
        setTimeout(function () {
          if(record.recommend == 0) {
            if(result.data.code == 0) {
              message.success('推荐成功')
            }
            if(result.data.code == 2) {
              message.info('最多推荐4个，请先取消其他推荐')
            }
          }else {
            message.success('取消推荐成功')
          }
        },700)
      },
      error: (err) => {
        // console.log(err);
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

  changeSearch(value) {
    // console.log(value);
    this.setState({
      search:value
    })
  }

  handleSubmit(e) {
    const { search } = this.state;
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        // console.log('Errors in form!!!');
        return;
      }
      // console.log(values.key);
      if(search == 'title') {
        publicParams.video_title = values.key;
        publicParams.service = 'Admin.SearchVideoByTitle';
      }else {
        publicParams.video_id = values.key;
        publicParams.service = 'Admin.SearchVideoById';
      }
      reqwest({
        url: publicUrl,
        method: 'get',
        data: publicParams,
        type: 'jsonp',
        withCredentials: true,
        success: (result) => {
          this.setState({
            data:result.data.videos,
            total:result.data.total
          });
          // console.log(result.data);
        }
      });
    });
  }

  getVideoItem(video_id,record) {
    publicParams.service = 'Admin.GetVideo';
    publicParams.video_id = video_id;
    window.videoId = video_id;
    window.record = record;
    this.fetch();
  }

  getVideoContent(video_id,record) {
    this.setState({spin:true});
    //获取直播间的直播内容
    publicParams.service = 'Admin.GetVideoContent';
    publicParams.video_id = video_id;
    window.record = record;
    this.fetch();
    //获取评论列表
    publicParams.service = 'Admin.GetComments';
    publicParams.type = 3;
    publicParams.id = video_id;
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
        if (result.data.videos) {
          // console.log(result.data.videos);
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
          window.location.href = '#/video/new-live-video'
        }
        //获取视频直播内容
        if(result.data.content) {
          //console.log(result.data.content.views);
          window.videoCheck = result.data.content.views;
          setTimeout(function () {
            window.location.href = '#/video/video-check'
          },100)
        }
        //获取评论列表
        if(result.data.comments) {
          window.comments = result.data.comments;
        }
      },
      error: (err) => {
        // console.log(err);
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
    window.video = false;
    window.location.href = '#/video/new-live-video'
  }

  handleChange(current) {
    // console.log(current);
    publicParams.page = current;
    window.liveVideoPage = current;
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

  componentWillUnmount() {
    sessionStorage.record = JSON.stringify(window.record);
    sessionStorage.videoCheck = JSON.stringify(window.videoCheck);
    sessionStorage.comments = JSON.stringify(window.comments);
    sessionStorage.videoId = JSON.stringify(window.videoId);
    sessionStorage.video = JSON.stringify(window.video);
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
                  <Select onChange={this.changeSearch} defaultValue="title" size="large">
                    <Option value="title">标题</Option>
                    <Option value="id">ID</Option>
                  </Select>
                </Col>
                <Col span="3">
                  <Input {...getFieldProps('key')} style={{height:'40px'}} />
                </Col>
                <Col span="2">
                  <Button htmlType="submit" type="ghost" style={{width:'100%',height:'40px'}}>搜索</Button>
                </Col>
              </Form>
            </Row>
          </header>
        </header>
        <article className="ant-video-content">
          {/*主体内容*/}
          <section className="article-right-content">
            <div style={{width:'2rem',height:'2rem'}}></div>
            <Table rowKey = {record => record.id}
                   rowSelection={null}
                   pagination = {{
                   current:window.liveVideoPage ? window.liveVideoPage : 1,
                   onChange:this.handleChange,
                   total:this.state.total}}
                   dataSource={ data }
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
