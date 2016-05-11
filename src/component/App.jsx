import React, { Component } from 'react';
import { Link } from 'react-router';
import reqwest from 'reqwest';
import md5 from 'md5';
import {
  DatePicker,
  Button,
  Model,
  Cascader,
  Breadcrumb,
  Menu,
  Icon,
  Row,
  Col
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
 //publicParams.user_id=64;
 //publicParams.token='3315cfc6b45b0c722b091dd8224bad46';
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
      data:'数据中心'
    };
    this.handleClick = this.handleClick.bind(this);
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
      case 'authority-center':
        window.key = 5;
            break;
    }
    //全局的key
    console.log(window.key);
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
        console.log(result.data);
        if(result.data.code == 0) {
          window.location.href = '../index.html'
        }
      }
    });
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
    //console.log(children.props);
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
            <div onClick={this.handleLogout} style={{float:'right',marginRight:'20px',cursor:'pointer'}}>admin | 退出 </div>
          </div>
          <div className="ant-layout-container">
            <div className="ant-layout-content">
              {this.props.children}
            </div>
          </div>
        </div>
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
