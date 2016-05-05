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
      current:'1',
      data:'数据中心'
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.setState({
      current: e.key
    });
    //全局的key
    window.key = e.key;
    console.log(window.key);

    switch (Number(e.key)) {
      case 2:
        this.setState({
          data:'文章管理'
        });
        break;
      case 3:
        this.setState({
          data:'视频直播'
        });
        break;
      case 4:
        this.setState({
          data:'直播间'
        });
        break;
      case 5:
        this.setState({
          data:'权限中心'
        });
        break;
      default:
        this.setState({
          data:'数据中心'
        });
    }
  }

  render() {
    return (
      <article className="ant-layout-main">
        {/*这里左边*/}
        <aside className = 'ant-layout-left'>
          <header className = "ant-layout-logo"><p style={{fontSize:'1.5rem'}}>直播温州</p></header>
          <Menu onClick = {this.handleClick}
                theme="dark"
                defaultOpenKeys = {['sub2','sub3']}
                selectedKeys = {[this.state.current]}
                mode = "inline">
            <Menu.Item  key = "1" >
              <Link to="/data-center"><Icon type = "bar-chart" />数据中心</Link>
            </Menu.Item>
            <SubMenu key = "sub2" title = {<span><Icon type = "home" /><span>首页管理</span></span>}>
              <Menu.Item key = "2">
              <Link to="/article">文章管理</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key = "sub3" title = {<span><Icon type = "play-circle-o" /><span>直播管理</span></span>}>
              <Menu.Item key = "3">
                <Link to="/live-video">视频直播</Link>
              </Menu.Item>
              <Menu.Item key = "4">
                <Link to="/live-room">直播间</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key = "5" >
              <Link to="/authority-center"><Icon type = "lock" />权限中心</Link>
            </Menu.Item>
          </Menu>
        </aside>
        {/*这里右边*/}
        <div className="ant-layout-right">
          <div className="ant-layout-header">
            <div className="ant-layout-breadcrumb" style={{float:'left'}}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Link to="/data-center">首页</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{this.state.data}</Breadcrumb.Item>
              </Breadcrumb>
            </div>
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
