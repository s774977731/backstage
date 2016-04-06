import React from 'react';
import { Link } from 'react-router';
import AddForm from './AddForm.jsx';

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
  title: '该频道的直播人',
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


class NewLiveVideo extends React.Component{

  constructor() {
    super();
    this.state = {
      data : [{
        key: '1',
        name: '胡彦斌',
        age: 11,
        address: '西湖区湖底公园1号'
      }, {
        key: '2',
        name: '胡彦祖',
        age: 21,
        address: '西湖区湖底公园2号'
      }, {
        key: '3',
        name: '李大嘴',
        age: 31,
        address: '西湖区湖底公园3号'
      }, {
        key: '4',
        name: '李大嘴',
        age: 41,
        address: '西湖区湖底公园4号'
      }, {
        key: '51',
        name: '李大嘴',
        age: 5,
        address: '西湖区湖底公园5号'
      }],
      selectedRowKeys: [],
      selectedRows: [],
      record :{},
      loading: false,
      visible: false,
      selection: false
    };
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickCheck = this.handleClickCheck.bind(this)
  }

  handleClick() {
    this.setState({
      visible: !this.state.visible
    });

    this.props.form.resetFields();
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
          data:this.state.data,
          selection:false,
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
        selectedRows,
        record,
        selection:true
      });
    }
    console.log(selectedRows);
  }

  onSelectChange(selectedRowKeys) {
    if(selectedRowKeys.length<5){
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.setState({ selectedRowKeys });
    }
  }

  handleSubmit(values) {
    console.log(values.name,values.email);
    const newData = [{
      key: this.state.data.length+1,
      name: values.name,
      age: values.email,
      address: values.textarea
    }];
    this.setState({
      data:newData.concat(this.state.data)
    });
  }

  handleClickCheck() {
    console.log(this.state.selectedRows);
    //export var xxx = this.state.selectedRows;
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
            <Input placeholder="输入或更改频道名称" style={{margin:"0 0 10px 0"}}/>
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
              <div className="col-5 new-video-left-footer-div1">开放评论</div>
              <div className="col-5 new-video-left-footer-div2">审核评论</div>
            </Row>
            <Link to="/live-video">
              <div onClick={this.handleClickCheck} className="col-24 new-video-left-footer-div-b"><Icon type="check"/></div>
            </Link>
          </footer>
        </div>
        <div className="new-live-video-right col-12">
          <header>
            <div onClick={this.handleClick} className="new-live-video-right-header-div">
              <Icon type="plus"/>添加主播账号
            </div>
            {/*这里是子主键*/}
            <AddForm  handleSubmit = {this.handleSubmit} name={this.state.visible} />
          </header>
          <section>
            <div>
              <div style={{height:'40px',margin:'2px 2px 2px 0'}}>
                <Button className="col-4"
                        style={{height:'40px'}}
                        type="ghost"
                        onClick={this.handleClickDelete}
                        disabled={!this.state.selection}
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

NewLiveVideo = Form.create()(NewLiveVideo);
export default NewLiveVideo;

