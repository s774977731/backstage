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
  QueueAnim,
  message,
  Input,
  Form,
  Popover
} from 'antd';

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">ID</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">昵称</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">账号</Menu.Item>
  </Menu>
);

const columns = [{
  title: 'ID',
  dataIndex: 'name',
  render: text => <a href="#">{text}</a>,
}, {
  title: '头像',
  dataIndex: 'age'
}, {
  title: '登录名',
  dataIndex: 'address'
}, {
  title: '添加时间',
    dataIndex: 'addTime'
}, {
  title: '',
  dataIndex: 'delete'
}];


class Authority extends React.Component{

  constructor() {
    super();
    this.state = {
      data : [{
          key: '1',
          name: '胡彦斌',
          age: 32,
          address: '西湖区湖底公园1号'
        }, {
          key: '2',
          name: '胡彦祖',
          age: 42,
          address: '西湖区湖底公园1号'
        }, {
          key: '3',
          name: '李大嘴',
          age: 32,
          address: '西湖区湖底公园1号'
        }
      ],
      selectedRowKeys: [],
      selectedRows: [],
      record :{}
    };
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
  }

  handleConfirm() {
    var loginInput =  $('#loginInput').val();
    var passwordInput = $('#passwordInput').val();
    var passwordInputAgain = $('#passwordInputAgain').val()

    if(loginInput == ""||passwordInput ==""||passwordInputAgain ==""){
      message.info('表单不能为空');
      document.getElementById('handle-add-admin').style.visibility = 'visible';
      document.getElementById('admin').innerHTML = '确认添加';
    }else if(passwordInput !== passwordInputAgain){
      message.info('密码不同请重新输入');
      var passwordInputAgain = $('#passwordInputAgain').val(null);
      document.getElementById('handle-add-admin').style.visibility = 'visible';
      document.getElementById('admin').innerHTML = '确认添加';
    }else {
      const newData = [{
        key: this.state.data.length+1,
        name:  loginInput,
        age: passwordInput,
        address: passwordInputAgain
      }];
      this.setState({
        data : newData.concat(this.state.data)
      });


    }
  }

  handleClick(e) {
    e.preventDefault();
    var visibility = document.getElementById('handle-add-admin').style.visibility;
    console.log(visibility);
    if(visibility == 'hidden'){
      document.getElementById('handle-add-admin').style.visibility = 'visible';
      document.getElementById('admin').innerHTML = '确认添加';

      $('#loginInput').val(null);
      $('#passwordInput').val(null);
      $('#passwordInputAgain').val(null)
    }else {
      document.getElementById('handle-add-admin').style.visibility = 'hidden';
      document.getElementById('admin').innerHTML = '添加管理员';
      console.log($('#loginInput').val(),$('#passwordInput').val(), $('#passwordInputAgain').val());

      this.handleConfirm();
    }
  }

  handleCancel() {
    $('#handle-add-admin').css({
      'visibility':'hidden'
    });
    $('#admin').html('添加管理员')
  }

  onSelect(record, selected, selectedRows) {
    this.setState({
      selectedRows,
      record
    });
    console.log(record, selected, selectedRows);
  }

  onSelectChange(selectedRowKeys) {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  onSelectAll(selected, selectedRows, changeRows) {
    this.setState({
      selectedRows
    });
    console.log(selected, selectedRows, changeRows);
  }

  //从数组中删除指定值元素
  removeByValue(arr,val) {
    for(let i=0; i<arr.length; i++) {
      if(arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  }

  handleClickDelete() {
    if(this.state.selectedRows.length > 0){
      //删除多选的表单
      for(let i=0; i<this.state.selectedRows.length; i++) {
        this.removeByValue(this.state.data,this.state.selectedRows[i]);
      }

      setTimeout(() => {
        this.setState({
          data:this.state.data,
          selectedRowKeys: [],
          selectedRows:[]
        });
        message.info('删除成功');
      }, 500);
    }else{
      message.info("请至少选择一项")
    }

  }

  render() {
    const {selectedRowKeys } = this.state;
    // 通过 rowSelection 对象表明需要行选择
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
      onSelect: this.onSelect.bind(this),
      onSelectAll: this.onSelectAll.bind(this)
    };
    return(
      <div>
        <header className="ant-video-header">
          {/*与Article同步CSS代码*/}
          <header className="article-right-header">
            <Row>
              <Col span="1">
                <div className="Icon-demo-div" onClick={this.handleClickDelete}><Icon className="Icon-demo" type="delete"/></div>
              </Col>
              <Col span="4" offset="1">

                  <div className="right-header-left" onClick={this.handleClick}>
                    &nbsp;&nbsp;&nbsp;<Icon type="plus" />&nbsp;&nbsp;<span id="admin">添加管理员</span>
                  </div>
              </Col>
              {/*Group*/}
              <div>
                <Col span="1" offset="12">
                  <div className="right-header-right-m">
                    <Dropdown overlay={menu} trigger={['click']}>
                      <div className="ant-dropdown-link" href="#">
                        全部 <Icon type="down" />
                      </div>
                    </Dropdown>
                  </div>
                </Col>
                <Col span="3">
                  <Input className="right-header-right-m-input" />
                </Col>
                <Col span="2">
                  <div className="right-header-right-r">
                    <Icon type="search" />&nbsp;&nbsp;<span>搜索</span>
                  </div>
                </Col>
              </div>
            </Row>

            <Row>
              <Col span="4" offset="2">

                <div id="handle-add-admin" style={{visibility:'hidden'}}>
                    <Row>
                      <div key="a" className="col-24 handle-add-admin-input-border">
                        <Input required id="loginInput" style={{width:'100%'}} placeholder="登陆名"/>
                      </div>
                    </Row>
                    <Row>
                      <div key="b" className="col-24 handle-add-admin-input-border">
                        <Input type="password" id="passwordInput" style={{width:'100%'}} placeholder="输入密码"/>
                      </div>
                    </Row>
                    <Row>
                      <div key="c" className="col-24 handle-add-admin-input-border">
                        <Input type="password" id="passwordInputAgain" style={{width:'100%'}} placeholder="请再次输入密码"/>
                      </div>
                    </Row>
                    <Row>
                      <div key="c" className="col-24 handle-add-admin-input-border">
                        <Input onClick={this.handleCancel}
                               id="cancelButton"
                               type="button"
                               style={{width:'100%'}}
                               value="取消添加"/>
                      </div>
                    </Row>
                </div>
              </Col>
            </Row>
          </header>
        </header>
        <article className="ant-video-content ">
          {/*主体内容*/}
          <section className="article-right-content article-right-content-t-single">
            <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data} />
          </section>
        </article>
        <footer className="ant-video-footer"></footer>
      </div>
    )
  }
}

export default Authority;

