import React, { Component } from 'react';
import { Link } from 'react-router';
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

class App extends Component {
  constructor() {
    super();
    this.state = {
      //current:'1',
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

  render() {
    const { location, children } = this.props;
    console.log(children.props);
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
            <Menu.Item key = "authority-center" >
              <Link to="/authority-center"><Icon type = "lock" />权限中心</Link>
            </Menu.Item>
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
            <div style={{float:'right',marginRight:'20px'}}>admin | 退出 </div>
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
