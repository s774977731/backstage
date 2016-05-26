import React from 'react';
import reqwest from 'reqwest';
import { Button, Input, message, Row, Modal } from 'antd'
const confirm = Modal.confirm;

//全局链接
let publicParamsJSON = sessionStorage.publicParams;
let publicParams = JSON.parse(publicParamsJSON);
let publicUrl = sessionStorage.publicUrl;

//测试url
function checkUrl(value){
  var str = value.match(/http:\/\/.+/);
  if (str == null){
    return false;
  }else {
    return true;
  }
}

class AddApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      android:{},
      input1:'',
      input2:'',
      input3:'',
      inputChange1:false,
      inputChange2:false,
      inputChange3:false
    }
    this.fetch = this.fetch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderValue = this.renderValue.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  fetch(){
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result.data.android_app)
        this.setState({
          android:result.data.android_app
        })
      }
    });
  }

  handleClick() {
    let vname = $('#vname').val();
    let vnum = $('#vnum').val();
    let durl = $('#durl').val();
    console.log(checkUrl(durl))
    if(!checkUrl(durl)) {
      this.showConfirm();
      return;
    }
    // console.log(vname,);
    publicParams.service = 'Admin.AddAndroidApp';
    publicParams.version_name = vname;
    publicParams.version_code = vnum;
    publicParams.download_url = durl;
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result.data)
        if(result.data.code == 0) {
          message.success('发布成功');
        }
      }
    });
  }

  showConfirm() {
    confirm({
    title: '链接不正确',
    content: '请输入正确的链接地址',
    onOk() {
      console.log('确定');
    },
    onCancel() {},
  });
  }

  renderValue(num) {
    const { android, input1, input2, input3, inputChange1, inputChange2, inputChange3 } = this.state;
    if(num == 1) {
      if(android) {
        if(inputChange1) {
          return input1
        }
        return android.version_name
      }
    }
    if(num == 2) {
        if(inputChange2) {
          return input2
        }
        return android.version_code
    }
    if(num == 3) {
        if(inputChange3) {
          return input3
        }
        return android.download_url
    }
  }



  handleChange(num,e) {
    console.log(num,e);
    if(num == 1) {
      this.setState({
        input1:e.target.value,
        inputChange1:true
      })
    }
    if(num == 2) {
      this.setState({
        input2:e.target.value,
        inputChange2:true
      })
    }
    if(num == 3) {
      this.setState({
        input3:e.target.value,
        inputChange3:true
      })
    }
  }

  componentWillMount() {
    publicParams.service = 'Basic.GetLatestAndroidApp';
    this.fetch();
  }

  render() {
    const { android, input1, input2, input3  } = this.state;
    return (
      <div>
        <div className='col-24' style={{textAlign:'center'}}><h2>发布新版安卓app</h2></div>
        <div className='col-6 col-offset-9' style={{marginTop:'2rem'}}>
          <Input style={{height:'35px'}} id='vname' placeholder='版本名称' value={this.renderValue(1)} onChange={this.handleChange.bind(null,1)}></Input>
        </div>
        <div className='col-6 col-offset-9' style={{marginTop:'2rem'}}>
          <Input style={{height:'35px'}} id='vnum' placeholder='版本号' value={this.renderValue(2)} onChange={this.handleChange.bind(null,2)}></Input>
        </div>
        <div className='col-6 col-offset-9' style={{marginTop:'2rem'}}>
          <Input style={{height:'35px'}} id='durl' placeholder='下载地址' value={this.renderValue(3)} onChange={this.handleChange.bind(null,3)}></Input>
        </div>
        <div className='col-6 col-offset-9' style={{marginTop:'2rem'}}>
          <Button type='primary' style={{width:'100%',height:'35px'}} onClick={this.handleClick}>发布</Button>
        </div>
      </div>
    );
  }
}

export default AddApp;
