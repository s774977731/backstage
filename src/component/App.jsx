import React, { Component } from 'react';
import ReactDOM from  'react-dom';
import { Link } from 'react-router';
import reqwest from 'reqwest';
import md5 from 'md5';
import {
  DatePicker,
  Button,
  Modal,
  Cascader,
  Breadcrumb,
  Menu,
  Icon,
  Row,
  Col,
  Input,
  message
} from 'antd';
const SubMenu = Menu.SubMenu;

//全局链接
//var publicUrl = 'http:192.168.0.8/backend/Public/video';
var publicUrl = 'http://bi.webei.cn/video';
var timestamp = Date.parse(new Date());
var publicParams = {};
publicParams.app = 1;
publicParams.t = timestamp;
publicParams.sign=md5(timestamp+'lowkey');
 // publicParams.user_id=64;
 // publicParams.token='87d98cc75ed4145a1f3eeb05fb7f0d77';
publicParams.user_id = sessionStorage.user_id;
publicParams.token = sessionStorage.token;

var publicParamsJSON = JSON.stringify(publicParams);
sessionStorage.publicParams = publicParamsJSON;
sessionStorage.publicUrl = publicUrl;


class App extends Component {
  constructor() {
    super();
    this.state = {
      Authority:false,
      data:'数据中心',
      visible:false
    };
    this.handleClick = this.handleClick.bind(this);
    this.modifySupPassword = this.modifySupPassword.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancle = this.handleCancle.bind(this);
  }

  handleClick(e) {
    switch (e.key) {
      case 'data-center':
        window.key = 1;
            break;
      case 'article':
        window.key = 2;
            break;
      case 'video':
        window.key = 3;
            break;
      case 'room':
        window.key = 4;
            break;
      case 'other':
        window.key = 5;
            break;
      case 'authority-center':
        window.key = 6;
            break;
    }
    //全局的key
    // console.log(window.key);
  }

  handleLogout() {
    publicParams.service = 'Admin.Logout';
    reqwest({
      url: publicUrl+'/?service=Admin.Logout',
      method: 'post',
      data: publicParams,
      type: 'json',
      withCredentials: true,
      success: (result) => {
        // console.log(result.data);
        if(result.data.code == 0) {
          window.location.href = '../index.html'
        }
      }
    });
  }

  modifySupPassword() {
    this.setState({visible:true})
  }
  handleOk() {
    this.setState({visible:false});
    let newPass = ReactDOM.findDOMNode(this.refs.newPass).childNodes[0].value;
    publicParams.new_pwd = newPass;
    publicParams.service = 'Admin.ChangeSelfPassword';
    reqwest({
      url: publicUrl+'/?service=Admin.ChangeSelfPassword',
      method: 'post',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        // console.log(result.data)
        message.success('修改密码成功');
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
    })
  }

  handleCancle() {
    this.setState({visible:false})
  }

  componentWillMount() {
    publicParams.service = 'Admin.GetAdmins';
    reqwest({
      url: publicUrl,
      method: 'post',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        //console.log(result.data)
        if(result.data.code != 10) {
          this.setState({
            Authority:true
          })
        }
      }
    });
  }

  render() {
    const { Authority } = this.state;
    const { location, children } = this.props;
    // console.log(children.props);
    return (
      <article className="ant-layout-main">
        {/*这里左边*/}
        <aside className = 'ant-layout-left'>
          <header className = "ant-layout-logo">
            <img src="http://7xrdm6.com2.z0.glb.qiniucdn.com/1_image_a1_1462781794_5810image/png" height="25px"/>
          </header>
          <Menu onClick = {this.handleClick}
                theme="dark"
                defaultOpenKeys = {['sub2','sub3']}
                defaultSelectedKeys={[children.props.route.path]}
                selectedKeys={[children.props.route.path]}
                mode = "inline">
            <Menu.Item  key = "data-center" >
              <Link to="/data-center"><Icon type = "bar-chart" />数据中心</Link>
            </Menu.Item>
            <SubMenu key = "sub2" title = {<span><Icon type = "home" /><span>首页管理</span></span>}>
              <Menu.Item key = "article">
              <Link to="/article/main">文章管理</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key = "sub3" title = {<span><Icon type = "play-circle-o" /><span>直播管理</span></span>}>
              <Menu.Item key = "video">
                <Link to="/video/main">视频直播</Link>
              </Menu.Item>
              <Menu.Item key = "room">
                <Link to="/room/main">直播间</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key = "sub4" title = {<span><Icon type="ellipsis" /><span>其他功能</span></span>}>
              <Menu.Item key = "other">
                <Link to="/other/ad">广告图</Link>
              </Menu.Item>
            </SubMenu>
            {
              Authority ?
                <Menu.Item key = "authority-center" >
                  <Link to="/authority-center"><Icon type = "lock" />权限中心</Link>
                </Menu.Item> : <div></div>
            }
          </Menu>
        </aside>
        {/*这里右边*/}
        <div className="ant-layout-right">
          <div className="ant-layout-header">
            {/*<div className="ant-layout-breadcrumb" style={{float:'left'}}>
             <Breadcrumb>
             <Breadcrumb.Item>
             <Link to="/data-center">首页</Link>
             </Breadcrumb.Item>
             <Breadcrumb.Item>{[children.props.children.props.route.name]}</Breadcrumb.Item>
             </Breadcrumb>
             </div>*/}
            <div style={{float:'right',marginRight:'20px',cursor:'pointer'}}><span onClick={this.modifySupPassword}>{sessionStorage.username || 'admin'} </span>| <span onClick={this.handleLogout}>退出</span> </div>
          </div>
          <div className="ant-layout-container">
            <div className="ant-layout-content">
              {this.props.children}
            </div>
          </div>
        </div>
        <Modal title="修改超级管理员密码"
               width="350"
               style={{fontFamily:'_GB2312 FangSong_GB2312'}}
               visible={this.state.visible}
               onOk={this.handleOk}
               onCancel={this.handleCancle}>
          <Input type="password" ref="newPass" placeholder="请输入新密码"/>
        </Modal>
      </article>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.element
};

App.contextTypes = {
  title: React.PropTypes.string
};
export default App;
