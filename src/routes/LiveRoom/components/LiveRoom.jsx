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
  Spin
} from 'antd';
//全局链接
let publicParamsJSON = sessionStorage.publicParams;
let publicParams = JSON.parse(publicParamsJSON);
let publicUrl = sessionStorage.publicUrl;

class LiveRoom extends React.Component{

  constructor() {
    super();
    this.state = {
      total:1,
      spin:true
    };
    this.getRooms = this.getRooms.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getRoomNum = this.getRoomNum.bind(this);
  }

  columns() {
    return[{
      title: 'ID',
      dataIndex: 'id'
    }, {
      title: '标题',
      dataIndex: 'name'
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
      render:(text,record) =>
        moment.unix(text).format('YYYY-MM-DD')
    },{
      title: '开播时间',
      dataIndex: 'start'
    },{
      title: '直播状态',
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
            <Button onClick={this.getRoomItem.bind(this,record.id)} type="ghost"><Icon type="setting"/></Button>
            <Button type="ghost">推荐</Button>
          </span>
        );
      }.bind(this)
    }]
  }

  getRoomItem(room_id) {
    publicParams.service = 'Admin.GetRoom';
    publicParams.room_id = room_id;
    window.roomId = room_id;
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
        if (result.data.rooms) {
          this.setState({
            spin:false,
            data:result.data.rooms
          });
          //存值到sessionStorage
        }
        if (result.data.num) {
            this.setState({
              spin:false,
              total:result.data.num
            })
        }
        if(result.data.room) {
            window.room = result.data.room;
            window.location.href = '/#/new-live-room'
        }
        //获取直播间的直播内容
        if(result.data.content) {
          window.roomCheck = result.data.content;
          window.location.href = '/#/room-check'
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

  handleAddRoom() {
    window.room = {};
    window.location.href = '/#/new-live-room'
  }

  handleChange(current) {
    console.log(current);
    publicParams.page = current;
    this.getRooms()
  }

  getRooms() {
    publicParams.service = 'Admin.GetRooms';
    this.fetch()
  }

  getRoomNum() {
    publicParams.service = 'Admin.GetRoomNum';
    this.fetch()
  }

  componentWillMount() {
    this.getRooms();
    this.getRoomNum();
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
                  <Button onClick={this.handleAddRoom} className="fish-btn-black" style={{width:'100%',height:'40px'}}><Icon style={{marginLeft:'-5px'}} type="plus"/>新建直播</Button>
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

LiveRoom = Form.create()(LiveRoom);
export default LiveRoom;

