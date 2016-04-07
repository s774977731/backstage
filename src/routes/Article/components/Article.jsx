import React from 'react';
import { Link } from 'react-router';
import remove from 'lodash/remove';
import reqwest from 'reqwest';

import {
  Row,
  Col,
  Button,
  Icon,
  Dropdown,
  Menu,
  Form,
  Table,
  message,
  Input,
  Popover,
  Popconfirm
} from 'antd';
const FormItem = Form.Item;

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a name="id" href="#">ID</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="1">
      <a name="nichen" href="#">昵称</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">
      <a name="user">账号</a>
    </Menu.Item>
  </Menu>
);

class Article extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [
        {
          key: 1,
          id: 1,
          title: `李大嘴11111`,
          updateTime: `2016-5-10`
        }, {
          key: 2,
          id: 2,
          title: `李大嘴22222`,
          updateTime: `2016-5-10`
        }, {
          key: 3,
          id: 3,
          title: `李大嘴33333`,
          updateTime: `2016-5-10`
        }, {
          key: 4,
          id: 4,
          title: `李大嘴44444`,
          updateTime: `2016-5-10`
        }
      ],
      selectedRowKeys: [],  // 这里配置默认勾选列
      selectedRows: [],
      record: {},
      loading: false,
      operate: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.start = this.start.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetch = this.fetch.bind(this);
    this.columns = this.columns.bind(this);
  }

  columns() {
    return([{
        title: 'ID',
        width:'10%',
        dataIndex: 'id'
      }, {
        title: '头图',
        width:'10%',
        dataIndex: 'img'
      }, {
        title: '标题',
        width:'15%',
        dataIndex: 'title'
      }, {
        title: '更新时间',
        width:'15%',
        dataIndex: 'updateTime'
      }, {
        title: '浏览点赞',
        width:'15%',
        dataIndex: 'like'
      }, {
        title: '分享收藏',
        width:'15%',
        dataIndex: 'collection'
      },{
        key: 'operation',
        className:'text-right',
        render: (text, record) =>
            <span>
              <a href="#">
                <Icon type="link"/>
                <span className="ant-divider" />
                <Icon type="message"/>11145
              </a>
              <span className="ant-divider" />
              <Popconfirm
                title="确定要删除这个篇评论吗？"
                onConfirm={this.deleteClick.bind(this, record.comment_id, record.thread_id)}
              >
                <a href="javasript:;">删除</a>
              </Popconfirm>
            </span>
        }])
  }

  start() {
    this.setState({
      loading: true
    });
    //模拟 ajax 请求，完成后清空
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false
      });
    }, 1000);
  }

  onSelectChange(selectedRowKeys) {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  handleClick() {
    const operateDelete = document.getElementsByClassName("right-header-left")[0];
    if (this.state.operate == false) {
      operateDelete.innerHTML = '<span>&nbsp;&nbsp;&nbsp;</span><i class=" anticon anticon-cross"></i><span>&nbsp;&nbsp;</span><span>取消</span>';
      this.setState({
        operate: !this.state.operate,
        selectedRowKeys: []
      });
    } else {
      operateDelete.innerHTML = '<span>&nbsp;&nbsp;&nbsp;</span><i class=" anticon anticon-setting"></i><span>&nbsp;&nbsp;</span><span>操作</span>';
      this.setState({
        operate: !this.state.operate
      });
    }
  }

  //从数组中删除指定值元素
  removeByValue(arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  }

  //前段界面删除
  handleClickDelete() {
    const {data, selectedRows} = this.state;
    if (selectedRows.length > 0) {
      setTimeout(() => {
        this.setState({
          data: this.state.data,
          selectedRowKeys: [],
          loading: false,
          rowSelection: null
        });
        message.info('删除成功');
      }, 500);

      //删除多选的表单
      for (let i = 0; i < selectedRows.length; i++) {
        this.removeByValue(data, selectedRows[i]);
      }

    } else {
      message.info("请至少选择一项")
    }
  }

  //前后端请求删除
  deleteClick(commentId, threadId) {
    const { comments } = this.state;
    console.log(commentId, threadId);
    reqwest({
      url: `/api/comment/${commentId}`,
      method: 'DELETE',
      type: 'json',
      data: {threadId},
      withCredentials: true,
      success: (result) => {
        this.setState({
          loading: false
        });
        if (result.code == 1) {
          const cComment = comments;
          remove(cComment, (comment) => comment.comment_id === commentId);//lodash中的根据方法删除指定数组中的某个满足条件的值
          this.setState({
            posts: cComment
          });
          message.success('您已删除该评论');
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

  onSelect(record, selected, selectedRows) {
    //this.state.data.splice(record.key-1,1);
    //if(selectedRows.length > 0) {
    //  this.setState({
    //    data : this.state.data
    //  })
    //}
    this.setState({
      selectedRows,
      record
    });
    console.log(record, selected, selectedRows);
  }

  render() {
    const { selectedRowKeys,operate } = this.state;
    const { getFieldProps } = this.props.form;
    const rowSelection = (!this.state.operate) ? null : {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelect.bind(this)
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div className="ant-article-right">
        {/*头部*/}
        <header className="article-right-header">
          <Row>
            <Col span="2">
              <div className="right-header-left" onClick={this.handleClick}>
                &nbsp;&nbsp;&nbsp;<Icon type="setting"/>&nbsp;&nbsp;<span>操作</span>
              </div>
            </Col>
            <Col span="5" style={{whiteSpace:'nowarp',textAlign:'center'}}>
              <span style={{ marginLeft: 8 }}>
                {hasSelected ? `选择了 ${selectedRowKeys.length} 个对象` : ''}
              </span>
            </Col>
            <Col span="2" offset="8">
              <Link to="/new-article">
                <div className="right-header-right-l">
                  <Icon type="plus"/>&nbsp;&nbsp;<span>添加文章</span>
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
          <Row>
            <Col span="2">
              <div
                onClick={this.handleClickDelete}
                className="operate-button-delete"
                style={operate?{visibility:'visible'}:{visibility:'hidden'}}>
                删除
              </div>
            </Col>
          </Row>
          <Row>
            <Col span="2">
              <div
                className="operate-button-delete"
                style={operate?{visibility:'visible'}:{visibility:'hidden'}}>
                推荐
              </div>
            </Col>
          </Row>
        </header>

        <section className="article-right-content article-right-content-single-table">
          <Table
            rowSelection={rowSelection}
            pagination={{ pageSize: 7 }}
            columns={this.columns()}
            dataSource={this.state.data} />
        </section>

        <footer className="article-right-footer"/>
      </div>
    );
  }
}

Article = Form.create()(Article);
export default Article;
