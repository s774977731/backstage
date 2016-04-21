import React from 'react';
import { Link } from 'react-router';

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
  Input
} from 'antd';
const FormItem = Form.Item;


const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">第一个菜单项</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">第二个菜单项</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">第三个菜单项</Menu.Item>
  </Menu>
);

const columns = [{
  title: '姓名',
  dataIndex: 'name',
  width: 150,
}, {
  title: '年龄',
  dataIndex: 'age',
  width: 150
}, {
  title: '住址',
  dataIndex: 'address'
}];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `李大嘴${i}`,
    age: 32,
    address: `西湖区湖底公园${i}号`
  });
}

const backImg = {
  //backgroundImage:'url('+imgUrl+')',
  backgroundColor:'#fff',
  alignItems:'center'
};

const commentList = {
  user:'小兔子',
  time:'2016-12-12',
  comment:'u are a big pig u are a big pig u are a big pig u are a big pig u are a big pig u are a big pig '
};
class VideoCheck extends React.Component{

  constructor() {
    super();
  }

  handleClick(e) {
    console.log($('#video1'));
    //e.target.play();
    if(e.target.paused){
      e.target.play();
    }else{
      e.target.pause();
    }
  }

  scrollSide() {
    let videoBox = $('.video-check-right-m');
    let scrollHeight = videoBox.scrollTop();
    const rightHeight = videoBox.height();

    let lastComment = $('.video-check-right-comment');
    let lastboxHeight = lastComment.last().get(0).offsetTop+Math.floor(lastComment.last().height()/2);

    console.log(scrollHeight,rightHeight,lastboxHeight);
    if(scrollHeight+rightHeight > lastboxHeight-100){
      let box = $('<div>').addClass('video-check-right-comment').appendTo($('.video-check-right-m'));

      let content = $('<div>').html(
        `<div class="video-check-right-comment">
            <Row>
              <div class="col-2 video-check-right-commentList">${commentList.user}</div>
              <div class="col-2 video-check-right-commentList">头像</div>
              <div class="col-16 video-check-right-commentList">${commentList.time}</div>
              <div class="col-4 video-check-right-commentList"><i class=" anticon anticon-exclamation-circle-o"></i>&nbsp;&nbsp;&nbsp;&nbsp;<i class=" anticon anticon-lock"></i></div>
            </Row>
            <div class="video-check-right-commentDetail">
              ${commentList.comment}
            </div>
          </div>`
      ).appendTo(box);
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      wrapperCol: { span: 20 }
    };

    return(
      <div>
        <header className="video-check-header" >
            <Link to="/live-video"><Button size="large" type="ghost"><Icon type="cross-circle" />结束直播</Button></Link>
            <span>&nbsp;&nbsp;温州市2016年全民马拉松</span>
          <div className="col-1 col-offset-23" style={{backgroundColor:'#fff',marginTop:'1rem'}}>.</div>
        </header>
        <Row>
          <div className="video-check-left col-11">
            <Row>
              <div id="video1" className="col-12 video-check-left-position" onClick={this.handleClick}>
                <div style={{position:'relative'}}>

                </div>
                <div className="video-check-left-position-opacity">
                  <h1>播放</h1>
                </div>
              </div>
              <div id="video1" className="col-12 video-check-left-position" onClick={this.handleClick}>
                <div style={{position:'relative'}}>

                </div>
                <div className="video-check-left-position-opacity">
                  <h1>播放</h1>
                </div>
              </div>
            </Row>
            <Row>
              <div id="video1" className="col-12 video-check-left-position" onClick={this.handleClick}>
                <div style={{position:'relative'}}>

                </div>
                <div className="video-check-left-position-opacity">
                  <h1>播放</h1>
                </div>
              </div>
              <div id="video1" className="col-12 video-check-left-position" onClick={this.handleClick}>
                <div style={{position:'relative'}}>

                </div>
                <div className="video-check-left-position-opacity">
                  <h1>播放</h1>
                </div>
              </div>
            </Row>
          </div>
          <div onScroll={this.scrollSide} className=" video-check-right col-11 col-offset-1">
            <Row>
              <p className="col-24">评论列表</p>
            </Row>
            <Row>
              <Form style={{height: '5rem'}}>
                <FormItem
                  {...formItemLayout}
                  hasFeedback>
                  <Input type="email" style={{height:'40px'}} placeholder="请输入关键词" />
                </FormItem>
                <FormItem
                  wrapperCol={{ span: 4 }}
                >
                  <Button style={{width:'100%',height:'40px'}} htmlType="submit" type="ghost" >提交</Button>
                </FormItem>
              </Form>
            </Row>
            <br/>

            <div className="video-check-right-m">
              <div className="video-check-right-comment">
                <Row>
                  <div className="col-2 video-check-right-commentList" >{commentList.user}</div>
                  <div className="col-2 video-check-right-commentList" >头像</div>
                  <div className="col-16 video-check-right-commentList">{commentList.time}</div>
                  <div className="col-4 video-check-right-commentList" ><Icon type="exclamation-circle-o" />&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="lock" /></div>
                </Row>
                <div className="video-check-right-commentDetail">
                  {commentList.comment}
                </div>
              </div>
              <div className="video-check-right-comment">
                <Row>
                  <div className="col-2 video-check-right-commentList" >{commentList.user}</div>
                  <div className="col-2 video-check-right-commentList" >头像</div>
                  <div className="col-16 video-check-right-commentList">{commentList.time}</div>
                  <div className="col-4 video-check-right-commentList" ><Icon type="exclamation-circle-o" />&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="lock" /></div>
                </Row>
                <div className="video-check-right-commentDetail">
                  {commentList.comment}
                </div>
              </div>
              <div className="video-check-right-comment">
                <Row>
                  <div className="col-2 video-check-right-commentList" >{commentList.user}</div>
                  <div className="col-2 video-check-right-commentList" >头像</div>
                  <div className="col-16 video-check-right-commentList">{commentList.time}</div>
                  <div className="col-4 video-check-right-commentList" ><Icon type="exclamation-circle-o" />&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="lock" /></div>
                </Row>
                <div className="video-check-right-commentDetail">
                  {commentList.comment}
                </div>
              </div>
              <div className="video-check-right-comment">
                <Row>
                  <div className="col-2 video-check-right-commentList" >{commentList.user}</div>
                  <div className="col-2 video-check-right-commentList" >头像</div>
                  <div className="col-16 video-check-right-commentList">{commentList.time}</div>
                  <div className="col-4 video-check-right-commentList" ><Icon type="exclamation-circle-o" />&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="lock" /></div>
                </Row>
                <div className="video-check-right-commentDetail">
                  {commentList.comment}
                </div>
              </div>
              <div className="video-check-right-comment">
                <Row>
                  <div className="col-2 video-check-right-commentList" >{commentList.user}</div>
                  <div className="col-2 video-check-right-commentList" >头像</div>
                  <div className="col-16 video-check-right-commentList">{commentList.time}</div>
                  <div className="col-4 video-check-right-commentList" ><Icon type="exclamation-circle-o" />&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="lock" /></div>
                </Row>
                <div className="video-check-right-commentDetail">
                  {commentList.comment}
                </div>
              </div>
            </div>
          </div>
        </Row>
      </div>
    )
  }
}


VideoCheck = Form.create()(VideoCheck);
export default VideoCheck;

