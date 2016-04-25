import React from 'react';
import { Link } from 'react-router';
import reqwest from 'reqwest';
//import NewLiveVideo from '../../NewLiveVideo/components/NewLiveVideo.jsx';

import {
  Row,
  Col,
  Button,
  Icon,
  Menu,
  Checkbox,
  Table,
  Tag,
  Form,
  Input,
  Popover,
  Select,
  message
} from 'antd';

let buildDate = new Date();
let nowBuildTime = buildDate.getFullYear()+'/'+buildDate.getMonth()+'/'+buildDate.getDay()+'  '+buildDate.getHours()+
                    ':'+buildDate.getMinutes()+':'+buildDate.getSeconds();


const data = [];
console.log(LiveVideo);
for (let i = 0; i < 7; i++) {
  data.push({
    key: i,
    id:i+1,
    title: `小兔子${i}`,
    build: nowBuildTime,
    start:nowBuildTime,
    state:i % 2 === 0 ? <Tag color="green">已处理</Tag> : <Tag color="red">未处理</Tag>,
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

class LiveVideo extends React.Component{

  constructor() {
    super();
    this.state = {
      authority: true,
      open:true
    };
    this.handClickState = this.handClickState.bind(this);
    this.handClickAuthority = this.handClickAuthority.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      console.log(values);
      this.fetch(values);
    });
  }

  fetch(params = {}) {
    reqwest({
      url: '/api/comment',
      method: 'get',
      data: params,
      type: 'json',
      withCredentials: true,
      success: (result) => {
        if (result.data) {
          this.setState({

          });
        } else {
          this.setState({

          });
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
    }, {
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
      render:function(text,record) {
        return (
          <span>
            <Button onClick={this.getVideoContent.bind(this,record)} type="ghost"><Icon type="play-circle-o" />查看/审核直播</Button>
            <Button type="ghost"><Icon type="setting"/></Button>
            <Button type="ghost">推荐</Button>
          </span>
        );
      }.bind(this)
    }]
  }

  getVideoContent(record) {
    console.log(record);
  }

  render() {
    const { getFieldProps } = this.props.form;
    return(
      <div>
        <header className="ant-video-header">
          {/*与Article同步CSS代码*/}
          <header className="article-right-header">
            <Row>
              <Col span="2" offset="14">
                <Link to="/new-live-video">
                  <Button htmlType="submit" className="fish-btn-black" style={{width:'100%',height:'40px'}}><Icon style={{marginLeft:'-5px'}} type="plus"/>新建直播</Button>
                </Link>
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
            <Table rowSelection={null} dataSource={data} columns={this.columns()} />
          </section>
        </article>
        <footer className="ant-video-footer">

        </footer>
      </div>
    )
  }
}

LiveVideo = Form.create()(LiveVideo);
export default LiveVideo;

