import React from 'react';
import ReactDOM from 'react-dom'
import { Link } from 'react-router';
import reqwest from 'reqwest';

import {
  Row,
  Col,
  Button,
  Icon,
  Dropdown,
  Menu,
  Checkbox,
  Pagination,
  Input,
  Table,
  message,
  Tooltip,
  QueueAnim,
  Popconfirm,
  Tag,
  Select
} from 'antd';
//全局链接
let publicParamsJSON = sessionStorage.publicParams;
let publicParams = JSON.parse(publicParamsJSON);
let publicUrl = sessionStorage.publicUrl;
//合并对象
let extend=function(o,n,override){
  for(var p in n)if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))o[p]=n[p];
};
//找到数组中的某个值，并返回一个数组
function getStats(array = [], key) {
  return array.length ? array.map((value) => value[key]) : [];
}

class NewLiveRoom extends React.Component{

  constructor() {
    super();
    this.state = {
      data : [],
      selectedRowKeys:[],
      selectedRows: window.room ? window.room.hosts : [],
      record :{},
      loading: false,
      visible: false,
      portrait:'',
      nickName:'',
      userId:'',
      titles:[],
    };
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderAddUsers = this.renderAddUsers.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.fetch = this.fetch.bind(this);
    this.getTableRight = this.getTableRight.bind(this);
    this.handlePicUpload = this.handlePicUpload.bind(this);
    this.handleCreateUpdateRoom = this.handleCreateUpdateRoom.bind(this);
  }

  columnsLeft() {
    return([
      {
        title: '头像',
        dataIndex: 'portrait',
        render:(text) => <img src={text} width="50" />
      }, {
        title: '昵称',
        dataIndex: 'nick_name'
      },  {
        title: '用户名',
        dataIndex: 'user_name',
      },{
        className:'text-right',
        render:(text,record) => <div>
            <Select defaultValue={window.room ? record.title : ''} onChange={this.handletitlesChange.bind(this,record)} style={{ width: 90,textAlign:'center' }} >
            <Option value="compere">主持人</Option>
            <Option value="guest">嘉宾</Option>
            <Option value="commentator">评论员</Option>
            </Select>
        </div>
      }
    ])
  }

  columns() {
    return ([
      {
        title: '头像',
        dataIndex: 'portrait',
        render:(text) => <img src={text} width="50" />
      }, {
        title: '昵称',
        dataIndex: 'nick_name'
      },  {
        title: '用户名',
        dataIndex: 'user_name',
      },{
        title: '添加时间',
        dataIndex: 'reg_time'
      }, {
        className:'text-right',
        render:(text,record) => <Popconfirm
          title="确定要解除该主播人权限吗？"
          onConfirm={this.deleteClick.bind(this, record.uid)}
        >
          <a href="javasript:;">解除权限</a>
        </Popconfirm>
      }
    ])
  }

  /**
   * 左半部分
   */

  handlePicUpload() {
    let params = {
      uid:1
    };
    publicParams.service = 'Basic.UploadPicture',
    extend(publicParams,params);

    let file = $('#uploadLogo')[0];
    if(!file.files || !file.files[0]){
      return;
    }
    let reader = new FileReader();
    reader.onload = function(evt){
      document.getElementById('img').src = evt.target.result;
      //base64图片
      var index = (evt.target.result).indexOf('base64')+7;
      publicParams.data_uri_scheme = (evt.target.result).substring(index);
      console.log(publicParams);
    };
    reader.onloadend = function () {
      $.ajax({
        method: "POST",
        url:publicUrl,
        data:publicParams,
        dataType:'jsonp'
      }).done(function(data) {
        console.log(data);
      }).error(function (data) {
        console.log(data);
      });
    };
    reader.readAsDataURL(file.files[0]);
  }

  handletitlesChange(recode,value) {
    recode.title = value;
    console.log(recode);
  }

  handleCreateUpdateRoom() {
    const { selectedRows } = this.state;
    let roomName = ReactDOM.findDOMNode(this.refs.roomName).childNodes[0].value;
    if(roomName.length == 0) {
      message.error('请输入频道名称');
      ReactDOM.findDOMNode(this.refs.roomName).childNodes[0].focus();
      return false;
    }
    let uids = getStats(selectedRows,'uid');
    let titles = getStats(selectedRows,'title');
    let params = {
      name:roomName,
      cover:'',
      uids:uids,
      titles:titles
    };
    extend(publicParams,params);
    if(!window.room.id) {
      publicParams.service = 'Admin.CreateRoom';
      console.log(window.room,11111);
    }else {
      publicParams.service = 'Admin.UpdateRoom';
      publicParams.room_id = 16;
      console.log(window.room,22222);
    }
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result);
        if(!window.room.id) {

          if(result.data.code == 0) {
            message.success('房间创建成功');
            setTimeout(function () {
              window.location.href = '/#/live-room'
            },1000)
          }else if(result.data.code == 1) {
            message.error('房间创建失败')
          }else if(result.data.code == 2) {
            message.info('房间创建成功，但添加主持人失败')
          }else {
            message.error('非法请求')
          }
        }else {
          if(result.data.code == 0) {
            message.success('房间更新成功');
            setTimeout(function () {
              window.location.href = '/#/live-room'
            },1000)
          }else if(result.data.code == 1) {
            message.error('房间更新失败')
          }else if(result.data.code == 2) {
            message.info('房间更新成功，但添加主持人失败')
          }else {
            message.error('非法请求')
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

  renderRoomName() {
    if(window.room) {
      return window.room.name;
    }else {
      return "";
    }
  }

  /**
   * 右半部分
   */

  deleteClick(recordUid) {
    publicParams.service = 'Admin.CancelLivePermission';
    publicParams.uid = recordUid;

    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result);
        if (result.data.code == 0) {
          console.log('success');
          this.getTableRight();
          this.setState({
            data: data
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

  renderAddUsers() {
    const { visible, portrait, nickName} = this.state;
    return (
      <QueueAnim>
        { visible ?
          <div key="a" className="addUserDiv">
            <div className="col-4"><img src={portrait} /></div>
            <div className="col-4">{nickName}</div>
            <Button onClick={this.handleClick} className="col-offset-10"><Icon type="plus"/>添加</Button>
          </div> : null }
      </QueueAnim>
    )
  }

  handleClick() {
    const { userId } =this.state;
    publicParams.uid = userId;
    publicParams.service = 'Admin.AssignLivePermission';
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result.data);
        if(result.data.code == 0) {
          message.success('授予该用户直播权限成功');
          this.getTableRight();
          this.setState({
            data:data
          })
        }else if(result.data.code ==1) {
          message.error('授予该用户直播权限失败');
        }else {
          message.error('请重新登录')
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
    })

    this.setState({
      visible:false
    })
  }

  handleChange(e) {
    //判断是否是手机号
    let regBox = {
      phone : /^0?1[3|4|5|8][0-9]\d{8}$/
    };
    var is_phone = regBox.phone.test(e.target.value);

    if(is_phone) {
      publicParams.service = 'Admin.GetUserNoLivePermByPh';
      publicParams.phone_number = e.target.value;
      this.fetch();
    }
    if(e.target.value.length == 11 && !is_phone) {
        message.error('请输入正确的手机号');
    }
    if(e.target.value.length < 11) {
      this.setState({
        visible:false
      })
    }
  }

  fetch() {
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        //根据手机号获取没有直播权限的用户
        if (result.data.user) {
          if(result.data.code == 0){
            const user = result.data.user;
            this.setState({
              portrait:user.portrait,
              nickName:user.nick_name,
              visible:true,
              userId:user.uid
            });
          }
        }else if(result.data.code == 1 && result.data.msg == "Not found"){
          message.error('没有该用户');
        }else if(result.data.code == 2){
          message.error('该用户已经拥有直播权限');
        }
        //获取拥有直播权限的用户列表
        if(result.data.users) {
          this.setState({
            data:result.data.users
          })
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

  /**
   * 右-->左
   */

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

      this.setState({
        selectedRows,
        record,
        selection:true
      });
      console.log(selectedRows);
  }

  onSelectAll(selected, selectedRows, changeRows) {
    this.setState({
      selectedRows,
    });
    console.log(selectedRows);
  }

  onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.setState({ selectedRowKeys });
      sessionStorage.selectedRowKeys = JSON.stringify(selectedRowKeys);

  }

  getCheckboxProps(record) {
    return {
      defaultChecked: record.nick_name == 'hello', // 配置默认勾选的列
      //disabled: record.nick_name == 'hello'    // 配置无法勾选的列
    }
  }

  /**
   * 界面初始化
   */

  getTableRight() {
    publicParams.service = 'Admin.GetUsersWithLivePermission';
    this.fetch()
  }


  componentWillMount() {
    this.getTableRight();
  }
  componentDidMount() {
    console.log(window.roomId,window.room.hosts)
  }

  render() {
    const { selectedRowKeys } = this.state;
    let keys;

    const rowSelection = {
      getCheckboxProps:this.getCheckboxProps.bind(this),
      onChange: this.onSelectChange.bind(this),
      onSelect: this.onSelect.bind(this),
      onSelectAll:this.onSelectAll.bind(this)
    };
    const hasSelected = selectedRowKeys.length > 0;
    return(
      <div>
        <div className="new-live-video-left col-12">
          <header className="col-23">
            <Input ref="roomName" defaultValue={this.renderRoomName()} placeholder="输入或更改频道名称" />
            <div style={{margin:'10px 0 0 0'}}>
              <img id="img" width="100" height="100" src="http://static.v1.5.webei.cn/business/images/forum_logo.png" alt="" />
              <label htmlFor="uploadLogo" style={{marginLeft:'1rem',color:'#2db7f5',fontSize:'1.5rem',cursor:'pointer'}} id="uploadLogoAction" href="javascript:void(0)">修改</label>
              <input style={{display:'none'}} id="uploadLogo" onChange={this.handlePicUpload} name="logo" type="file" single />
            </div>
          </header>
          <article className="col-23 new-live-video-left-article">
            <div style={{fontSize:'1.5rem',marginBottom:'5px'}}>该频道的直播人</div>
            <Table
              pagination={{pageSize:'4'}}
              columns={this.columnsLeft()}
              dataSource={this.state.selectedRows} />
          </article>
          <footer className="col-23">
            <p>评论权限</p>
            <Row>
              <div className="col-5 new-video-left-footer-div1">开放评论</div>
              <div className="col-5 new-video-left-footer-div2">审核评论</div>
            </Row>
            <div onClick={this.handleCreateUpdateRoom} className="col-24 new-video-left-footer-div-b"><Icon type="check"/></div>
          </footer>
        </div>
        <div className="new-live-video-right col-12">
          <header>
            <Input type="tel" onChange={this.handleChange} placeholder="请输入手机号，提升主播权限" minLength="11" maxLength="11"/>
          </header>
          <section>
            <div>
              {this.renderAddUsers()}
              <div style={{height:'40px',margin:'10px 2px 2px 0'}}>
                <span style={{lineHeight:'40px',fontSize:'1.5rem'}}>请勾选到该频道的直播人</span>
                <span style={{lineHeight:'40px',marginLeft:'20px'}}>{hasSelected ? `已选择了 ${selectedRowKeys.length} 个，最多选择了4个对象` : ''}</span>
              </div>
              <Table rowSelection={rowSelection} columns={this.columns()} dataSource={this.state.data} pagination={{ pageSize: 8}} />
            </div>
          </section>
        </div>
      </div>
    )
  }
}

export default NewLiveRoom;
