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
  Form,
  Input,
  Table,
  message,
  Modal,
  Tooltip
} from 'antd';
const FormItem = Form.Item;

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


class NewLiveRoom extends React.Component{

  constructor() {
    super();
    this.state = {
      data : [{
        key: '1',
        name: '胡彦斌',
        age: 1,
        address: '西湖区湖底公园1号'
      }, {
        key: '2',
        name: '胡彦祖',
        age: 2,
        address: '西湖区湖底公园2号'
      }, {
        key: '3',
        name: '李大嘴',
        age: 3,
        address: '西湖区湖底公园3号'
      }, {
        key: '4',
        name: '李大嘴',
        age: 4,
        address: '西湖区湖底公园4号'
      }, {
        key: '5',
        name: '李大嘴',
        age: 5,
        address: '西湖区湖底公园5号'
      }, {
        key: '6',
        name: '李大嘴',
        age: 6,
        address: '西湖区湖底公园6号'
      }],
      selectedRowKeys: [],
      selectedRows: [],
      record :{},
      loading: false,
      visible: false
    };
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleClick() {
    this.setState({
      visible: true
    });
  }

  handleOk() {
    this.setState({
      visible: false
    });
    console.log('收到表单值：', this.props.form.getFieldsValue());
    let formObj = this.props.form.getFieldsValue();
    const newData = [{
      key: this.state.data.length+1,
      name: formObj.user,
      age: formObj.phone,
      address: formObj.pass
    }];
    this.setState({
      data:newData.concat(this.state.data)
    })
  }

  handleCancel(e) {
    console.log(e);
    this.setState({
      visible: false
    });
  }

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
          data:this.state.data
        });
        message.success('操作成功');

      }, 500);
      console.log(this.state.selectedRows);
    }else{
      message.info("请至少选择一项")
    }
  }

  onSelect(record, selected, selectedRows) {

    if(selectedRows.length >4) {
      //selected = false;
      message.info('最多选择4条');
      return false;
    }else {
      this.setState({
        selectedRows:selectedRows,
        record
      });
    }
  }

  onSelectChange(selectedRowKeys) {
    if(selectedRowKeys.length<5){
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.setState({ selectedRowKeys });
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
      onSelect: this.onSelect.bind(this)
    };
    const hasSelected = selectedRowKeys.length > 0;
    return(
      <div>
        <div className="new-live-video-left col-12">
          <header className="col-23">
            <Input style={{margin:"0 0 10px 0"}}/>
          </header>
          <article className="col-23 new-live-video-left-article">
            <Table
              pagination={false}
              columns={columns}
              dataSource={this.state.selectedRows} />
          </article>
          <footer className="col-23">
            <p>评论权限</p>
            <Row>
              <div className="col-5 new-video-left-footer-div1">hello</div>
              <div className="col-5 new-video-left-footer-div2">world</div>
            </Row>
            <div className="col-24 new-video-left-footer-div-b"><Icon type="check"/></div>
          </footer>
        </div>
        <div className="new-live-video-right col-12">
          <header>
            <div onClick={this.handleClick} className="new-live-video-right-header-div">
              <Icon type="plus"/>添加主播账号
            </div>
            <Modal title="第一个 Modal" visible={this.state.visible}
                   onOk={this.handleOk} onCancel={this.handleCancel}>
              <Form horizontal >
                <FormItem>
                  <Input {...getFieldProps('user')} style={{height:'40px'}} placeholder="用户名"/>
                </FormItem>
                <FormItem>
                  <Input {...getFieldProps('phone')} style={{height:'40px'}} placeholder="手机号"/>
                </FormItem>
                <FormItem>
                  <Input {...getFieldProps('pass')} style={{height:'40px'}} placeholder="密码"/>
                </FormItem>
              </Form>
            </Modal>
          </header>
          <section>
            <div>
              <div style={{height:'40px',margin:'2px 2px 2px 0'}}>
                <Button className="col-4"
                        style={{height:'40px'}}
                        type="ghost"
                        onClick={this.handleClickDelete}
                        disabled={!hasSelected}
                        loading={loading}>操作操作</Button>
                <span style={{lineHeight:'40px',marginLeft:'5px'}}>{hasSelected ? `已选择了 ${selectedRowKeys.length} 个，最多选择了4个对象` : ''}</span>
              </div>
              <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data} />
            </div>
          </section>
        </div>

      </div>
    )
  }
}

NewLiveRoom = Form.create()(NewLiveRoom);
export default NewLiveRoom;
