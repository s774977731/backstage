import React from 'react';
import { Link } from 'react-router';
import reqwest from 'reqwest';
import PublicComments from '../../Public/PublicComments.jsx';
import publicCommentsStyle from '../../Public/publicComments.css';

import {
  Row,
  Col,
  Button,
  Icon,
  Dropdown,
  Menu,
  Checkbox,
  Pagination,
  Table,
  Form,
  Input,
  message
} from 'antd';
//全局链接
let publicParamsJSON = sessionStorage.publicParams;
let publicParams = JSON.parse(publicParamsJSON);
let publicUrl = sessionStorage.publicUrl;


window.deleteRoomComment = function (i) {
  console.log(window.roomCheck[i]);
  publicParams.service = 'Admin.DeleteRoomContent';
  publicParams.content_id = window.roomCheck[i].id;
  reqwest({
    url: publicUrl,
    method: 'get',
    data: publicParams,
    type: 'jsonp',
    withCredentials: true,
    success: (result) => {
      console.log(result);
      if(result.data.code == 0) {
        message.success('删除评论成功');
        $(`#x${i}`).fadeOut();
      }
    },
    error: (err) => {
      console.log(err);
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

class VideoCheck extends React.Component{

  constructor() {
    super();

    this.fetch = this.fetch.bind(this);
  }

  renderComments() {
    const contentList = window.roomCheck;
    var comments = '';
    if(window.roomCheck) {
      //对某用户禁言
      for (var i=0;i<window.roomCheck.length;i++){
        comments += `
        <div id="x${i}" class="comments">
          <Row>
            <div class="col-2 commentList borderTopLeft">
            ${contentList[i].name}
            </div>
            <div class="col-2 commentList" >
            <img src=${contentList[i].icon_url} />
            </div>
            <div class="col-16 commentList" style="text-align: left">
            ${contentList[i].create_time}
            </div>
            <div class="col-4 commentList borderTopRight" >
              <i onclick="window.deleteRoomComment(${i})" class="anticon anticon-delete commentListRight"></i>
            </div>
          </Row>
          <div style="margin-left: 5px">
            ${contentList[i].content}
          </div>
        </div>
          `
      }
    }
    return {__html: comments};
  }

  fetch() {

  }

  render() {
    return(
      <div>
        <header className="video-check-header" >
          <Link to="/live-room"><Button size="large" type="ghost"><Icon type="cross-circle" />结束直播</Button></Link>
          <span>&nbsp;&nbsp;温州市2016年全民马拉松</span>
          <div className="col-1 col-offset-23" style={{backgroundColor:'#fff',marginTop:'1rem'}}>.</div>
        </header>
        <Row>
          <Col span="11">
            <h2>直播列表</h2>
            <br/>
            <div className=" video-check-right" style={{overflow:'auto'}}>
              <div dangerouslySetInnerHTML={this.renderComments()} />
            </div>
          </Col>
          <Col span="11" offset="1">
            <PublicComments />
          </Col>
        </Row>
      </div>
    )
  }
}

export default VideoCheck;

