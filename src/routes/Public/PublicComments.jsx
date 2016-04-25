import React from 'react';
import { Link } from 'react-router';
import reqwest from 'reqwest';
import publicComments from './publicComments.css';


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
  Input,
  Form,
  message
} from 'antd';
const FormItem = Form.Item;

//全局链接
let publicParamsJSON = sessionStorage.publicParams;
let publicParams = JSON.parse(publicParamsJSON);
let publicUrl = sessionStorage.publicUrl;

//对某用户禁言/取消禁言
window.disableUserComment = function(i) {
  //console.log(window.comments[i]);
  var searchContent = JSON.parse(sessionStorage.searchContent);
  console.log(searchContent[i]);
  if(window.comments[i]) {
    publicParams.uid = window.comments[i].user_id;
    switch (Number(window.comments[i].audit)) {
      case 0:
        publicParams.service = 'Admin.DisableUserComment';
        break;
      case 1:
        publicParams.service = 'Admin.EnableUserComment';
        break;
    }
  }
  else {
    //对评论进行搜索
    publicParams.uid = searchContent[i].user_id;
    switch (Number(searchContent[i].audit)) {
      case 0:
        publicParams.service = 'Admin.DisableUserComment';
        break;
      case 1:
        publicParams.service = 'Admin.EnableUserComment';
        break;
    }
  }
  reqwest({
    url: publicUrl,
    method: 'get',
    data: publicParams,
    type: 'jsonp',
    success: (result) => {
      console.log(result);
      if(result.data.code == 0) {
        setTimeout(function () {
          var auditNumber;
          if(window.comments[i]) {
            getComments();
            auditNumber = Number(window.comments[i].audit);
          }else {
            getSearchComment();
            searchContent = JSON.parse(sessionStorage.searchContent);
            auditNumber = Number(searchContent[i].audit);
          }
          switch (auditNumber) {
            case 0:
              message.success('用户禁言成功');
              for(let j=0;j<window.comments.length;j++) {
                let nickname = window.comments[i].nickname;
                if(window.comments[j].nickname == nickname) {
                  $(`#icon${j}`).removeClass('anticon anticon-exclamation-circle-o').addClass('anticon anticon-cross-circle-o');
                }
              }
              break;
            case 1:
              message.success('用户解除禁言');
              for(let j=0;j<window.comments.length;j++) {
                let nickname = window.comments[i].nickname;
                if(window.comments[j].nickname == nickname) {
                  $(`#icon${j}`).removeClass('anticon anticon-cross-circle-o').addClass('anticon anticon-exclamation-circle-o');
                }
              }
              break;
          }
        },500);
      }
    }
  });
};

window.deleteCommentList = function (i) {
  console.log(window.contentList[i]);
  publicParams.service = 'Admin.DeleteComment';
  if(window.record) {
    if(window.key == 2) {
      //文章
      publicParams.type = 1;
      publicParams.id = window.contentList[i].comment_id;

    }else if(window.key == 3) {
      //视频直播
      publicParams.type = 2;

    }else if(window.key == 4) {
      //直播间
      publicParams.type = 3;
      publicParams.id = window.contentList[i].comment_id;
    }
    console.log(publicParams);
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
          $(`#y${i}`).fadeOut();
        }
      }
    });
  }
};

//获取评论列表
function getComments () {
  //文章
  if(window.key == 2) {
    publicParams.type = 1;
    publicParams.id = window.record.article_id;
  }
  //直播间
  if(window.key == 4) {
    publicParams.type = 3;
    publicParams.id = window.record.id;
  }
  publicParams.service = 'Admin.GetComments';
  reqwest({
    url: publicUrl,
    method: 'get',
    data: publicParams,
    type: 'jsonp',
    success: (result) => {
      window.comments = result.data.comments;
      console.log(result.data.comments);
    }
  });
}

//获取搜索评论列表
function getSearchComment() {
  //文章
  if(window.key == 2) {
    publicParams.type = 1;
    publicParams.id = window.record.article_id;
  }
  //直播间
  if(window.key == 4) {
    publicParams.type = 3;
    publicParams.id = window.record.id;
  }
  publicParams.service = 'Admin.SearchComment';
  reqwest({
    url: publicUrl,
    method: 'get',
    data: publicParams,
    type: 'jsonp',
    success: (result) => {
      sessionStorage.searchContent = JSON.stringify(result.data.comments);
      console.log(JSON.parse(sessionStorage.searchContent));
    }
  });
}

class PublicComments extends React.Component{

  constructor() {
    super();
    this.state = {
      serchContent:[]
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  fetch() {
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        if(result.data.code == 0) {
          this.setState({
            serchContent:result.data.comments
          });
          sessionStorage.searchContent = JSON.stringify(result.data.comments);
          console.log(JSON.parse(sessionStorage.searchContent))
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

  handleSubmit(e) {
    e.preventDefault();
    let formValue = this.props.form.getFieldsValue();
    console.log('收到表单值：', this.props.form.getFieldsValue());
    //console.log(window.record);
    //console.log(window.comments,window.key);
    publicParams.service = 'Admin.SearchComment';
    publicParams.key = formValue.key;
    //搜索文章列表
    if(window.record.article_id) {
      publicParams.type = 1;
      publicParams.id = window.record.article_id;
      this.fetch();
    }
    //搜索直播间列表
    if(window.record.id) {
      publicParams.type = 3;
      publicParams.id = window.record.id;
      this.fetch();
    }
  }

  renderComments() {
    const { serchContent } = this.state;
    let contentList = window.comments;
    window.contentList = contentList;
    var comments = '';
    if(serchContent.length > 0) {
      //对评论进行搜索
       var length = serchContent.length;
       window.comments = [];
      for (var i=0;i<length;i++)
      {
        comments += `
        <div id="y${i}" class="comments">
          <div>
            <div class="col-2 commentList borderTopLeft">
            ${serchContent[i].nickname}
            </div>
            <div class="col-2 commentList">
            <img src=${serchContent[i].portrait} />
            </div>
            <div class="col-16 commentList" style="text-align: left">
            ${serchContent[i].create_time}
            </div>
            <div class="col-4 commentList borderTopRight" >
              <i id="icon${i}" onclick="window.disableUserComment(${i})" class="anticon anticon-exclamation-circle-o commentListRight"></i>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <i onclick="window.deleteCommentList(${i})" class=" anticon anticon-delete commentListRight" ></i>
            </div>
          </div>
          <div style="margin-left: 5px">
            ${serchContent[i].content}
          </div>
        </div>
          `
      }
    }
    if(window.comments) {
      //对某用户禁言
      for (var i=0;i<window.comments.length;i++)
      {
        comments += `
        <div id="y${i}" class="comments">
          <div>
            <div class="col-2 commentList borderTopLeft">
            ${contentList[i].nickname}
            </div>
            <div class="col-2 commentList" >
            <img src=${contentList[i].portrait} />
            </div>
            <div class="col-16 commentList" style="text-align: left">
            ${contentList[i].create_time}
            </div>
            <div class="col-4 commentList borderTopRight" >
              <i id="icon${i}" onclick="window.disableUserComment(${i})" class="anticon anticon-exclamation-circle-o commentListRight"></i>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <i onclick="window.deleteCommentList(${i})"  class=" anticon anticon-delete commentListRight"></i>
            </div>
          </div>
          <div style="margin-left: 5px">
            ${contentList[i].content}
          </div>
        </div>
          `
      }
    }
    return {__html: comments};
  }

  componentDidMount() {
    console.log(window.comments,window.record);
    let comments = window.comments;
    if(comments) {
        for(var i=0;i<comments.length;i++) {
          if(comments[i].audit == 1) {
            $(`#icon${i}`).removeClass('anticon anticon-exclamation-circle-o').addClass('anticon anticon-cross-circle-o');
          }
        }
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      wrapperCol: { span: 20 }
    };

    return(
      <div>
        <Row>
          <div className="video-check-right">
            <Row>
              <h2>评论列表</h2>
              <Form onSubmit={this.handleSubmit} style={{height: '3rem',marginTop:'-1rem',marginBottom:'1.7rem'}}>
                <FormItem
                  {...formItemLayout}
                  hasFeedback>
                  <Input required type="text" {...getFieldProps('key')} placeholder="请输入搜索内容" style={{height:'40px'}} />
                </FormItem>
                <FormItem
                  wrapperCol={{ span: 4 }}
                >
                  <Button  style={{width:'100%',height:'40px'}} htmlType="submit" type="ghost" >搜索</Button>
                </FormItem>
              </Form>
            </Row>
            <div style={{height:'41rem',overflow:'auto'}}>
              <div dangerouslySetInnerHTML={this.renderComments()} />
            </div>
          </div>
        </Row>
      </div>
    )
  }
}


PublicComments = Form.create()(PublicComments);
export default PublicComments;

