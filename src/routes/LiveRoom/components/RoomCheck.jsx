import React from 'react';
import { Link } from 'react-router';
import reqwest from 'reqwest';
import PublicComments from '../../Public/PublicComments.jsx';
import publicCommentsStyle from '../../Public/publicComments.css';
const moment = require('moment');
moment.locale('zh-cn');

import {
  Row,
  Col,
  Button,
  Icon,
  Pagination,
  Table,
  Form,
  Input,
  message,
  Modal
} from 'antd';
//全局链接
let publicParamsJSON = sessionStorage.publicParams;
let publicParams = JSON.parse(publicParamsJSON);
let publicUrl = sessionStorage.publicUrl;

// window.deleteRoomComment = function (i) {
//   // console.log(window.roomCheck[i]);
//   publicParams.service = 'Admin.DeleteRoomContent';
//   publicParams.content_id = window.roomCheck[i].id;
//   reqwest({
//     url: publicUrl,
//     method: 'get',
//     data: publicParams,
//     type: 'jsonp',
//     withCredentials: true,
//     success: (result) => {
//       // console.log(result);
//       if(result.data.code == 0) {
//         message.success('删除直播内容成功');
//         $(`#x${i}`).fadeOut();
//       }
//     },
//     error: (err) => {
//       // console.log(err);
//       switch (err.status) {
//         case 404:
//           message.error('获取数据失败，请联系官方人员！');
//           break;
//         default:
//           message.error('获取数据失败，请刷新重试！');
//           break;
//       }
//     }
//   });
// };

class VideoCheck extends React.Component{

  constructor() {
    super();
    this.state = {
      visible:false,
      conList:window.roomCheck || JSON.parse(sessionStorage.roomCheck)
    };
    this.renderModal = this.renderModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.fetch = this.fetch.bind(this);
    this.getRoomHosts = this.getRoomHosts.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.renderComments = this.renderComments.bind(this);
  }

  renderComments() {
    const { conList } = this.state;
    const contentList = window.roomCheck;
    window.self = this;
    // console.log(conList,contentList)
    var comments = '';
    if(window.roomCheck) {
      //对某用户禁言
      for (var i=0;i<conList.length;i++){
        comments += `
        <div id="x${i}" class="comments">
          <Row>
            <div class="col-2 commentList borderTopLeft">
            <img style="width:20px;margin-top: 8px" src=${conList[i].icon_url} />
            </div>
            <div class="col-5 commentList" style="white-space:nowrap">
            ${conList[i].name}
            </div>
            <div class="col-13 commentList" style="text-align: left">
            ${moment.unix(conList[i].create_time).format('YYYY-MM-DD')}
            </div>
            <div class="col-4 commentList borderTopRight" >
              <i onclick="window.self.deleteRoomComment(${i})" class="anticon anticon-delete commentListRight"></i>
            </div>
          </Row>
          <div style="margin-left: 10px" class="content">
            ${window.self.roomContent(i)}
          </div>
        </div>
          `
      }
    }
    return {__html: comments};
  }

  deleteRoomComment(i) {
    const { conList } = this.state;
    // console.log(window.roomCheck[i]);
    publicParams.service = 'Admin.DeleteRoomContent';
    publicParams.content_id = conList[i].id;
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        // console.log(result);
        if(result.data.code == 0) {
          message.success('删除直播内容成功');
          $(`#x${i}`).fadeOut();
        }
      },
      error: (err) => {
        // console.log(err);
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
  };

  roomContent(i) {
    // const contentList = window.roomCheck;
    const { conList } = this.state;
    switch (conList[i].type) {
      case '1':
            return conList[i].content+'<br/>【图片】';
      break;
      case '2':
            return conList[i].content+'<br/>【视频】';
      break;
      case '3':
            return conList[i].content+'<br/>【语音】';
      default:
            return conList[i].content;
      break;
    }
  }

  renderModal() {
    this.getRoomHosts();
    this.setState({
      visible:true
    })
  }

  getRoomHosts() {
    publicParams.service = 'Admin.GetRoomHosts';
    publicParams.room_id = window.record.id;
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        // console.log(result.data);
        if(result.data.code == 0) {
          this.setState({
            data:result.data.hosts
          })
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
    })
  }

  handleOk() {
    this.setState({
      visible:false
    })
  }

  handleCancel() {
    this.setState({
      visible:false
    })
  }

  deleteRoomHost(record) {
    publicParams.service = 'Admin.DeleteRoomHost';
    publicParams.room_id = window.record.id;
    publicParams.uid = record.user_id;
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
        this.getRoomHosts();
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
    })
  }

  columns() {
    return(
      [{
        title: '姓名',
        width:'25%',
        dataIndex: 'nick_name'
      }, {
        title: '头像',
        width:'25%',
        dataIndex: 'portrait',
        render:(text) => <img src={text} width="30"/>
      }, {
        title: '角色',
        width: '25%',
        dataIndex: 'title',
        render:(text) => {
          if(text == 'compere') {
            return '主持人'
          }else if(text == 'guest') {
            return '嘉宾'
          }else if(text == 'commentator') {
            return '评论员'
          }else {
            return '主持人'
          }
        }
      },{
        title: '',
        className:'text-right',
        render:(text,record) =>
          <div>
            <Button onClick={this.deleteRoomHost.bind(this,record)} type="ghost">删除</Button>
            <Button style={{display:'none'}} onClick={this.DEableRoomHost.bind(this,record)} type="ghost">{record.audit == 0 ? '禁言' : '解除'}</Button>
          </div>
      }]
    )
  }

  DEableRoomHost(record) {
    // console.log(record);
    if(record.audit == 0) {
      publicParams.service = 'Admin.DisableRoomHost';
    }else {
      publicParams.service = 'Admin.EnableRoomHost';
    }
    publicParams.room_id = window.record.id;
    publicParams.uid = record.user_id;
    this.fetch()
  }

  handleClick() {
    if(window.record) {
      publicParams.room_id = window.record.id;
      if(window.record.delete) {
        publicParams.service = 'Admin.DeleteRoom';
      }else {
        publicParams.service = 'Admin.StopRoom';
      }
      reqwest({
        url: publicUrl,
        method: 'get',
        data: publicParams,
        type: 'jsonp',
        withCredentials: true,
        success: (result) => {
          // console.log(result.data);
          if(result.data.code == 0) {
            message.success('操作成功');
            window.location.href = '#/room/main';
          }else {
            message.success('操作失败')
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
      })
    }
  }

  handleScroll(e) {
    const { conList } = this.state;
    let i = conList.length;
    let scrollTop = $('.video-check-right').scrollTop();
    let roomHeight = $('.roomHeight').height();
    // let divHeight = $('.comments').last().position().top;
    // let divHeight = $('.comments').last().get(0).offsetTop;
    let lastHeight = $('.comments').height()*5+150;

    // let i = window.roomCheck.length;
    this.lastContent =  conList[i-1];
    console.log(roomHeight ,scrollTop+lastHeight)
    console.log(this.lastContent);

    if(roomHeight < scrollTop+lastHeight) {
      // console.log(this.lastContent)
      publicParams.size = 20;
      publicParams.room_id = window.record.id;
      publicParams.from_id = '';
      publicParams.to_id = this.lastContent.id;
      publicParams.service = 'Admin.GetRoomContent';
      reqwest({
        url: publicUrl,
        method: 'get',
        data: publicParams,
        type: 'jsonp',
        withCredentials: true,
        success: (result) => {
          var content = result.data.content;
          var contentLatest = conList.concat(content);
          this.setState({ conList:contentLatest });
          // console.log(content,conList);
        }
      })
    }
  }

  componentWillMount() {
      window.record = JSON.parse(sessionStorage.record);
      window.roomCheck = JSON.parse(sessionStorage.roomCheck);
      window.comments = JSON.parse(sessionStorage.comments);
  }

  render() {
    const { data } = this.state;
    return(
      <div>
        <header className="video-check-header" >
          <Button onClick={this.handleClick} size="large" type="ghost"><Icon type="cross-circle" />
            {window.record.delete ? '删除直播' :'结束直播'}
          </Button>
          <span style={{marginLeft:'3rem',fontSize:'1.5rem'}}>{window.record.name}</span>
          <Button onClick={this.renderModal} style={{float:'right'}} size="large" type="ghost"><Icon type="user" />该频道直播人</Button>
        </header>
        {/*Modal*/}
        <Modal title="该频道的直播人" visible={this.state.visible}
               onOk={this.handleOk} onCancel={this.handleCancel}>
          <Table dataSource={data} columns={this.columns()} pagination={false} />
        </Modal>
        {/*Modal*/}
        <Row>
          <Col span="11">
            <h2>直播列表</h2>
            <br/>
            <div className="video-check-right" id='demo' onScroll={this.handleScroll} style={{overflow:'auto'}}>
              <div className='roomHeight' dangerouslySetInnerHTML={this.renderComments()} />
            </div>
          </Col>
          <Col span="11" offset="2">
            <PublicComments />
          </Col>
        </Row>
      </div>
    )
  }
}

export default VideoCheck;
