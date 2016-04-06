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
  message,
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

const columns = [{
  title: 'ID',
  dataIndex: 'id'
}, {
  title: '头图',
  dataIndex: 'img'
}, {
  title: '标题',
  dataIndex: 'title'
},{
  title: '更新时间',
  dataIndex: 'updateTime'
},{
  title: '浏览点赞',
  dataIndex: 'like'
},{
  title: '分享收藏',
  dataIndex: 'collection'
}];



class Article extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      data : [
        {
          key:1,
          id:1,
          title: `李大嘴11111`,
          updateTime: `2016-5-10`
        }, {
          key:2,
          id:2,
          title: `李大嘴22222`,
          updateTime: `2016-5-10`
        }, {
          key:3,
          id:3,
          title: `李大嘴33333`,
          updateTime: `2016-5-10`
        }, {
          key:4,
          id:4,
          title: `李大嘴44444`,
          updateTime: `2016-5-10`
        }
      ],
      selectedRowKeys: [],  // 这里配置默认勾选列
      selectedRows: [],
      record :{},
      loading: false,
      operate: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.start = this.start.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
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
    this.setState({ selectedRowKeys });
  }

  handleClick() {
    if(this.state.operate == false){
      $(".right-header-left")[0].innerHTML = '<span>&nbsp;&nbsp;&nbsp;</span><i class=" anticon anticon-cross"></i><span>&nbsp;&nbsp;</span><span>取消</span>';
      this.setState({
        operate:!this.state.operate,
        selectedRowKeys: []
      });
    }else {
      $(".right-header-left")[0].innerHTML = '<span>&nbsp;&nbsp;&nbsp;</span><i class=" anticon anticon-setting"></i><span>&nbsp;&nbsp;</span><span>操作</span>';
      this.setState({
        operate:!this.state.operate
      });
    }
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
      setTimeout(() => {
        this.setState({
          data:this.state.data,
          selectedRowKeys: [],
          loading: false,
          rowSelection: null
        });
        message.info('删除成功');
      }, 500);

      //删除多选的表单
      for(let i=0; i<this.state.selectedRows.length; i++) {
        this.removeByValue(this.state.data,this.state.selectedRows[i]);
      }

    }else{
      message.info("请至少选择一项")
    }

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
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = (!this.state.operate)?null:{
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
                &nbsp;&nbsp;&nbsp;<Icon type="setting" />&nbsp;&nbsp;<span>操作</span>
              </div>
            </Col>
            <Col span="5" style={{whiteSpace:'nowarp',textAlign:'center'}}>
              <span style={{ marginLeft: 8 }}>{hasSelected ? `选择了 ${selectedRowKeys.length} 个对象` : ''}</span>
            </Col>

            <Col span="2" offset="8">
              <Link to="/new-article">
                <div className="right-header-right-l">
                  <Icon type="plus" />&nbsp;&nbsp;<span>添加文章</span>
                </div>
              </Link>
            </Col>
            {/*Group*/}
            <div>
              <Col span="1" offset="1">
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
            <Col span="2">
              <div onClick={this.handleClickDelete} className="operate-button-delete" style={this.state.operate?{visibility:'visible'}:{visibility:'hidden'}}>
                删除
              </div>
            </Col>
          </Row>
          <Row>
            <Col span="2">
              <div className="operate-button-delete" style={this.state.operate?{visibility:'visible'}:{visibility:'hidden'}}>
                推荐
              </div>
            </Col>
          </Row>
        </header>

        <section className="article-right-content article-right-content-single-table">
            <Table
              rowSelection={rowSelection}
              pagination={{ pageSize: 7 }}
              columns={columns}
              dataSource={this.state.data} />
        </section>
        <footer className="article-right-footer"></footer>
      </div>
    );
  }
}

export default Article;
