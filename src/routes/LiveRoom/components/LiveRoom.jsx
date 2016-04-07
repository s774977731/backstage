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
  Table,
  Form,
  Input,
  Popover
} from 'antd';


const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="#">ID</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="1">
      <a href="#">昵称</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">账号</Menu.Item>
  </Menu>
);


const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
    key: i,
    id: i+1,
    title: `李大嘴${i}`,
    build: 32,
    address: `西湖区湖底公园${i}号`,
    authority:'nhao'
  });
}

const rowSelection = {
  onChange(selectedRowKeys, selectedRows) {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect(record, selected, selectedRows) {
    console.log(record, selected, selectedRows);
  },
  onSelectAll(selected, selectedRows, changeRows) {
    console.log(selected, selectedRows, changeRows);
  }
};

class LiveRoom extends React.Component{

  constructor() {
    super();
    this.state = {
      authority: true,
      open:true
    };
    this.handClickState = this.handClickState.bind(this);
    this.handClickAuthority = this.handClickAuthority.bind(this);
  }

  handClickState() {
    this.setState({
      authority: !this.state.authority
    })
  }
  handClickAuthority() {
    this.setState({
      open: !this.state.open
    })
  }


  columns() {
    return[{
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '创建时间',
      dataIndex: 'build',
      key: 'build'
    },{
      title: '开播时间',
      dataIndex: 'start',
      key: 'start'
    },{
      title: '直播状态',
      dataIndex: 'state',
      key: 'state',
      render: () =>
        <div onClick={this.handClickState}>
          {this.state.authority?<Button type="ghost"><Icon type="play-circle" />未开播</Button>:<Button type="ghost"><Icon type="play-circle" />已开播</Button>}
        </div>
    }, {
      title: '评论权限',
      dataIndex: 'authority',
      key: 'authority',
      render: () =>
        <div onClick={this.handClickAuthority}>
          {this.state.open?<Button type="ghost">开放</Button>:<Button type="ghost">审核</Button>}
        </div>
    },{
      key: 'operation',
      render() {
        return (
          <span>
            <Link to="/room-check">
              <Button type="ghost"><Icon type="play-circle-o" />查看/审核直播</Button>
            </Link>
            <Button type="ghost"><Icon type="setting"/></Button>
            <Button type="ghost">推荐</Button>
          </span>
        );
      }
    }]
  }

  render() {
    const { getFieldProps } = this.props.form;

    return(
      <div>
        <header className="ant-video-header">
          {/*与Article同步CSS代码*/}
          <header className="article-right-header">
            <Row>
              <Col span="2" offset="15">
                <Link to="/new-live-video">
                  <div className="right-header-right-l">
                    <Icon type="plus" />&nbsp;&nbsp;<span>新建直播</span>
                  </div>
                </Link>
              </Col>
              {/*Group*/}
              <Form onSubmit={this.handleSubmit} form={this.props.form}>
                <Col span="1" offset="1">
                  <div className="right-header-right-m">
                    <Dropdown overlay={menu} trigger={['click']}>
                      <div className="ant-dropdown-link" href="#">
                        全部 <Icon type="down"/>
                      </div>
                    </Dropdown>
                  </div>
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
            <Table rowSelection={null} dataSource={data} columns={this.columns()} />
          </section>
        </article>
        <footer className="ant-video-footer">
        </footer>
      </div>
    )
  }
}

LiveRoom = Form.create()(LiveRoom);
export default LiveRoom;

