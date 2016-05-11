import React from 'react';
import ReactDOM from 'react-dom'
import reqwest from 'reqwest';
const moment = require('moment');
moment.locale('zh-cn');

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
  Select,
  Upload,
  Radio
} from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;

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
      selectedRowKeys:window.video ? getStats(window.video.views,'user_name') : [],
      selectedRows: window.video ? window.video.views : [],
      record :{},
      loading: false,
      visible: false,
      portrait:'',
      nickName:'',
      userId:'',
      titles:[],
      img_url:'',
      fileList: window.video ? [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: window.video.cover,
      }] : [],
      value:window.video ? Number(window.video.audit) : 0
    };
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderAddUsers = this.renderAddUsers.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.fetch = this.fetch.bind(this);
    this.getTableRight = this.getTableRight.bind(this);
    this.handleCreateUpdateVideo = this.handleCreateUpdateVideo.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }

  columnsLeft() {
    return([
      {
        title: '头像',
        dataIndex: 'portrait',
        render:(text) => <img src={text} width="30" />
      }, {
        title: '昵称',
        dataIndex: 'nick_name'
      },  {
        title: '用户名',
        dataIndex: 'user_name',
      },{
        className:'text-right',
        render:(text,record) => <div>
          <Select defaultValue={window.video ? record.view_code : ''} onChange={this.handletitlesChange.bind(this,record)} style={{ width: 90,textAlign:'center' }} >
            <Option value="1">视角一</Option>
            <Option value="2">视角二</Option>
            <Option value="3">视角三</Option>
            <Option value="4">视角四</Option>
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
        render:(text) => <img src={text} width="30" />
      }, {
        title: '昵称',
        dataIndex: 'nick_name'
      },  {
        title: '用户名',
        dataIndex: 'user_name',
      },{
        title: '添加时间',
        dataIndex: 'reg_time',
        render:(text) => {
          if(text == 0) {
            return '----------------'
          }else {
            return moment.unix(text).format('YYYY-MM-DD')
          }
        }
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

  handleImgChange(info) {
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    this.setState({ fileList });

    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      console.log(info.file.response.data.img_url);
      message.success(`${info.file.name} 上传成功。`);
      this.setState({
        img_url:info.file.response.data.img_url
      })
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败。`);
    }
  }

  handleRadioChange(e) {
    this.setState({
      value: e.target.value,
    });
  }

  renderPicture() {
    publicParams.service = 'Admin.UploadImage';
    const props = {
      name:'image',
      action: publicUrl+'/?service=Admin.UploadImage',
      data:publicParams,
      accept: 'image/*',
      listType: 'picture-card',
      beforeUpload(file) {
        const isPic = file.type === 'image/jpeg' || file.type === 'image/png';
        const limitedSize = file.size < 2097152;
        if (!isPic) {
          message.error('非法的图片格式，请重新选择');
        }
        if (!limitedSize) {
          message.error('图片体积过大，请重新选择');
        }
        return isPic && limitedSize;
      },
      onChange:this.handleImgChange,
    };
    return (
      <div className="clearfix" style={{marginTop:'20px'}}>
        <Upload {...props} fileList={this.state.fileList}>
          <Icon type="plus" />
          <div className="ant-upload-text">上传封面图</div>
        </Upload>
      </div>
    )
  }

  handletitlesChange(recode,value) {
    this.change = true;
    recode.view_code = value;
    console.log(value);
    var views;
    if(window.video) {
      views = window.video.views;
      //未添加或删除
      for(var i=0;i<views.length;i++) {
        if(views[i].user_id == recode.uid) {
          views[i].view_code = recode.view_code;
          views[i].change = recode.change;
        }
      }
    }
  }

  handleCreateUpdateVideo() {
    const { selectedRows, pic_is_change, img_url, fileList, value } = this.state;
    let roomName = ReactDOM.findDOMNode(this.refs.roomName).childNodes[0].value;
    var views;
    if(window.video) {
      views = window.video.views;
    }

    if(!selectedRows) {
      message.info('请选择直播人');
      return;
    }
    if(!this.change) {
      message.info('请选择视角');
      return false;
    }
    if(roomName.length == 0) {
      message.error('请输入频道名称');
      ReactDOM.findDOMNode(this.refs.roomName).childNodes[0].focus();
      return false;
    }
    if(selectedRows.length < 1) {
      message.info('请添加直播人');
      return false;
    }

    let uids = getStats(selectedRows,'uid');
    let codes = getStats(selectedRows,'view_code');
    ////判断是否有重复元素
    //let sortArray = codes.sort();
    //  for(let i=0;i<sortArray.length;i++) {
    //    if(sortArray[i] == sortArray[i+1] && sortArray.length > 1) {
    //      message.info('不能选择两个相同的视角');
    //      return false;
    //    }
    //  }


    publicParams.name = roomName;
    publicParams.cover = img_url ;
    publicParams.audit = this.state.value;
    if(!window.video) {
      if(!img_url) {
        message.error('请上传图片');
        return false;
      }
      publicParams.codes = codes;
      publicParams.uids = uids;
      publicParams.service = 'Admin.CreateVideo';
    }else {
      publicParams.service = 'Admin.UpdateVideo';
      publicParams.video_id = window.video.id;
      publicParams.cover = img_url ? img_url :window.video.cover;

      //没有添加或删除直播人
      if(selectedRows[0].user_id) {
        let userIds = getStats(selectedRows,'user_id');
        let viewscodes = getStats(views,'view_code');
        publicParams.uids = userIds;
        publicParams.codes = viewscodes;
      }else {
        //添加或删除直播人
        for(let i=0;i<selectedRows.length;i++) {
          for(let j=0;j<views.length;j++) {
            if(selectedRows[i].uid == views[j].user_id) {
              if(selectedRows[i].change) {
                selectedRows[i].title = selectedRows[i].title;
              }else {
                selectedRows[i].title = views[j].title;
              }
            }
          }
        }

        this.setState({
          selectedRows
        });

        publicParams.uids = getStats(selectedRows,'uid');
        publicParams.codes = getStats(selectedRows,'view_code');
      }
    }

    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result);
        if(!window.video.id) {
          if(result.data.code == 0) {
            message.success('房间创建成功');
            setTimeout(function () {
              window.location.href = '#/video/main'
            },1000)
          }else if(result.data.code == 1) {
            message.error('房间创建失败')
          }else if(result.data.code == 2) {
            message.info('房间创建成功，但添加主持人失败')
          }else if(result.data.code == 3){
            message.error('会话容量不足，请停止其他视频')
          }else {
            message.error('非法请求');
          }
        }else {
          if(result.data.code == 0) {
            message.success('房间更新成功');
            console.log(publicParams);
            setTimeout(function () {
              window.location.href = '#/video/main'
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

  renderVideoName() {
    if(window.video) {
      return window.video.name;
    }else {
      return "";
    }
  }

  returnDataSource() {
    const { selectedRows } = this.state;
    return selectedRows;
    //const { selectedRowKeys, data } = this.state;
    //var dataArr = [];
    //console.log(selectedRowKeys, data);
    //for(let i=0;i<data.length;i++) {
    //  for(let j=0;j<selectedRowKeys.length;j++) {
    //    if(data[i].user_name == selectedRowKeys[j]) {
    //      dataArr.push(data[i]);
    //    }
    //  }
    //}
    //return dataArr;
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
          //this.setState({
          //  data: data
          //});
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
            <div className="col-4"><img src={portrait} width="30" style={{marginTop:10}}/></div>
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
    if(selectedRows.length > 4) {
      return false;
    }
    this.setState({
      selectedRows,
      record,
      selection:true
    });
    console.log(selectedRows);
  }

  onSelectAll() {
    return false;
  }

  onSelectChange(selectedRowKeys) {
    if(selectedRowKeys.length > 4) {
      message.info('最多选4个');
      return false;
    } else {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.setState({ selectedRowKeys });
      sessionStorage.selectedRowKeys = JSON.stringify(selectedRowKeys);
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
    window.videoId = JSON.parse(sessionStorage.videoId);
    window.video = JSON.parse(sessionStorage.video);
    window.record = JSON.parse(sessionStorage.record);
    this.getTableRight();
  }
  componentDidMount() {
    console.log(window.video)
  }

  render() {
    const { selectedRowKeys } = this.state;
    let keys;

    const rowSelection = {
      selectedRowKeys:selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
      onSelect: this.onSelect.bind(this),
      onSelectAll:this.onSelectAll.bind(this)
    };
    const hasSelected = selectedRowKeys.length > 0;
    return(
      <div>
        <div className="new-live-video-left col-12">
          <header className="col-23">
            <Input ref="roomName" defaultValue={this.renderVideoName()} placeholder="输入或更改频道名称" />
            {this.renderPicture()}
          </header>
          <article className="col-23 new-live-video-left-article">
            <div style={{fontSize:'1.5rem',marginBottom:'5px'}}>该频道的直播人</div>
            <Table
              rowKey={record => record.user_name}
              pagination={false}
              columns={this.columnsLeft()}
              dataSource={this.returnDataSource()}
              useFixedHeader/>
          </article>
          <footer className="col-23">
            <p>评论权限</p>
            <br />
            <Row>
              <RadioGroup onChange={this.handleRadioChange} value={this.state.value}>
                <Radio key="0" value={0}>开放评论</Radio>
                <Radio key="1" value={1}>关闭评论</Radio>
              </RadioGroup>
            </Row>
            <div onClick={this.handleCreateUpdateVideo} className="col-24 new-video-left-footer-div-b"><Icon type="check"/></div>
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
                <span style={{lineHeight:'40px',marginLeft:'20px'}}>{hasSelected ? `已选择了 ${selectedRowKeys.length} 个直播人` : ''}</span>
              </div>
              <Table rowKey={record => record.user_name}
                     rowSelection={rowSelection}
                     columns={this.columns()}
                     dataSource={this.state.data}
                     pagination={false}
                     useFixedHeader/>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

export default NewLiveRoom;
