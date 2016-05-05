import React from 'react';
import { Link } from 'react-router';
import reqwest from 'reqwest';
import md5 from 'md5';
import remove from 'lodash/remove';
const moment = require('moment');
moment.locale('zh-cn');

import {
  Row,
  Col,
  Button,
  Icon,
  Menu,
  Checkbox,
  Pagination,
  Table,
  QueueAnim,
  message,
  Input,
  Form,
  Popover,
  Select,
  Popconfirm,
  Spin
} from 'antd';

//全局链接
let publicParamsJSON = sessionStorage.publicParams;
let publicParams = JSON.parse(publicParamsJSON);
let publicUrl = sessionStorage.publicUrl;


function getStats(array = [], key) {
  return array.length ? array.map((value) => value[key]) : [];
}


class Authority extends React.Component{

  constructor() {
    super();
    this.state = {
      data : [],
      selectedRowKeys: [],
      selectedRows: [],
      record :{},
      spin:true,
      search:'title'
    };
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.fetch = this.fetch.bind(this);
    this.handleClickMul = this.handleClickMul.bind(this);
    this.getAdmins = this.getAdmins.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeSearch = this.changeSearch.bind(this);
  }

  columns() {
    return(
      [{
        title: 'ID',
        width:'15%',
        dataIndex: 'id',
        sorter: (a, b) => a.id - b.id,
        render: text => <p>{text}</p>
      }, {
        title: '登录名',
        width:'15%',
        dataIndex: 'username'
      }, {
        title: '添加时间',
        width:'15%',
        dataIndex: 'reg_time',
        sorter: (a, b) => a.reg_time - b.reg_time,
        render:(text,record) =>
          moment.unix(text).format('YYYY-MM-DD')
      },{
        className:'text-right',
        render: (text, record) =>
          <span>
            <Popconfirm
              title="确定要删除该管理员吗？"
              onConfirm={this.deleteClick.bind(this, record.id,record)}
            >
              <a href="javasript:;">删除</a>
            </Popconfirm>
          </span>
      }]
    );
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

      //后台请求添加管理员
      const params = {
        username:loginInput,
        password:passwordInput
      };
      publicParams.service = 'Admin.AddAdmin';
      publicParams.username = params.username;
      publicParams.password = params.password;
      this.fetch();
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

      this.handleConfirm();
    }
  }

  handleCancel() {
    $('#handle-add-admin').css({
      'visibility':'hidden'
    });
    $('#admin').html('添加管理员')
  }

  changeSearch(value) {
    console.log(value);
    this.setState({
      search:value
    })
  }

  handleSubmit(e) {
    const { search } = this.state;
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      console.log(values.key);
      if(search == 'title') {
        publicParams.username = values.key;
        publicParams.service = 'Admin.SearchAdminByUsername';
      }else {
        publicParams.admin_id = values.key;
        publicParams.service = 'Admin.SearchAdminById';
      }
      reqwest({
        url: publicUrl,
        method: 'get',
        data: publicParams,
        type: 'jsonp',
        withCredentials: true,
        success: (result) => {
          this.setState({
            data:result.data.admins,
            total:result.data.total
          });
          console.log(result.data,this.state.data);
        }
      });
    });
  }

  onSelect(record, selected, selectedRows) {
    this.setState({
      selectedRows,
      record
    });
  }

  onSelectChange(selectedRowKeys,selectedRows) {
    console.log(selectedRows);
    this.setState({ selectedRowKeys });
  }

  onSelectAll(selected, selectedRows, changeRows) {
    this.setState({
      selectedRows
    });
  }

  handleClickMul() {
    const {selectedRows} = this.state;
    if(this.state.selectedRows.length > 0){
      //请求删除多选的表单
      publicParams.service = 'Admin.DeleteAdmins';
      publicParams.admin_ids = getStats(selectedRows,'id');
      console.log(getStats(selectedRows,'id'));

      reqwest({
        url: publicUrl,
        method: 'get',
        data: publicParams,
        type: 'jsonp',
        withCredentials: true,
        success: (result) => {
          const code = result.data.code;
          if(code == 0) {
            this.getAdmins();
            message.info('删除成功');
          }else if(code == 1) {
            message.error('删除失败');
          }else if(code == 9) {
            message.info('没有权限，您的token失效!');
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

    }else{
      message.info("请至少选择一项")
    }
  }

  //前后端请求删除
  deleteClick(admin_id,thisData) {
    const {data} = this.state;
    publicParams.admin_id = admin_id;
    publicParams.service = 'Admin.DeleteAdmin';

    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(admin_id);
        if (result.data.code == 0) {
          console.log('success');
          this.getAdmins();
          this.setState({
            data: data
          });
          message.success('您已删除该管理员');
        }
      },
      error: (err) => {
        switch (err.status) {
          case 404:
            message.error('删除失败，请联系官方人员！');
            break;
          default:
            message.error('删除失败，请稍后重试！');
            break;
        }
      }
    });
  }

  fetch() {
      reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
          if (result.data.admins) {
            console.log(result.data.admins);
            this.setState({
              spin:false,
              data:result.data.admins
            });
        }
        else {//添加管理员
          console.log(result);
          this.getAdmins();
          if(result.data.code == 1) {
            message.error('用户名已经存在');
            return ;
          }
            if(result.data.code == 0) {
              message.success('管理员添加成功');
              this.setState({
                data : this.state.data
              });
            }
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

  getAdmins() {
    publicParams.service = 'Admin.GetAdmins';
    this.fetch();
  }

  componentWillMount() {
    this.getAdmins();
  }

  render() {
    const {selectedRowKeys, spin } = this.state;
    const { getFieldProps } = this.props.form;
    // 通过 rowSelection 对象表明需要行选择
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
      onSelect: this.onSelect.bind(this),
      onSelectAll: this.onSelectAll.bind(this)
    };
    return(
      <Spin spining={spin}>
        <header className="ant-video-header">
          {/*与Article同步CSS代码*/}
          <header className="article-right-header">
            <Row>
              <Col span="1">
                <div className="Icon-demo-div" onClick={this.handleClickMul}><Icon className="Icon-demo" type="delete"/></div>
              </Col>
              <Col span="4" offset="1">
                <Button onClick={this.handleClick} className="fish-btn-black" style={{width:'100%',height:'40px'}}><Icon type="plus"/><span id="admin">添加管理员</span></Button>
              </Col>
              {/*Group*/}
              <Form onSubmit={this.handleSubmit} form={this.props.form}>
                <Col span="2" offset="11">
                  <Select onChange={this.changeSearch} defaultValue="title" size="large">
                    <Option value="title">登陆名</Option>
                    <Option value="id">ID</Option>
                  </Select>
                </Col>
                <Col span="3">
                  <Input {...getFieldProps('key')} style={{height:'40px'}} />
                </Col>
                <Col span="2">
                  <Button htmlType="submit" type="ghost" style={{width:'100%',height:'40px'}}>搜索</Button>
                </Col>
              </Form>
            </Row>

            <Row>
              <Col span="4" offset="2">

                <div id="handle-add-admin" style={{visibility:'hidden'}}>
                    <Row>
                      <div key="a" className="col-24 handle-add-admin-input-border">
                        <Input id="loginInput" maxLength="25" style={{width:'100%'}} placeholder="登陆名"/>
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
            <Table rowKey={record => record.id}
                   rowSelection={rowSelection}
                   columns={this.columns()}
                   dataSource={this.state.data} />
          </section>
        </article>
        <footer className="ant-video-footer" />
      </Spin>
    )
  }
}

Authority = Form.create()(Authority);
export default Authority;

