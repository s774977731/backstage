import React from 'react';
import reqwest from 'reqwest';
import { Button, Input, message, Upload, Icon, Row } from 'antd'

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


class AD extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ad:{},
      adPic:'',
      disable:false,
      change:'false',
      img_url:'',
      link_url:'',
      fileListAdd:[],
      fileListChange:[],
      enable:1,
      second:0
    }
    this.fetch = this.fetch.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.addPic = this.addPic.bind(this);
    this.changePic = this.changePic.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSecondChange = this.handleSecondChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.addPicChange = this.addPicChange.bind(this);
    this.changePicChange = this.changePicChange.bind(this);
    this.renderValue = this.renderValue.bind(this);
    this.enableADButton = this.enableADButton.bind(this);
    this.renderSecondValue = this.renderSecondValue.bind(this);
  }

  fetch(){
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result.data.ad)
        if(result.data.ad.length > 0) {
          //getad
          let adPic = result.data.ad.img_url;
          this.setState({
            ad:result.data.ad,
            adPic:adPic,
            disable:true,
            enable:result.data.ad.enabled,
          })
        }
      }
    });
  }

  handleClick() {
    const { change, img_url, link_url, ad, enable, second } = this.state;
    let value = $('#linkUrl').val();
    let secondValue = $('#secondValue').val();
    console.log(!checkUrl(value),secondValue);
    if(value == '') {
      message.error('请输入链接地址');
      $('#linkUrl').focus();
      return false;
    }
    if(!checkUrl(value)) {
      message.error('请输入正确的网址');
      return false;
    }
    publicParams.img_url = img_url || ad.img_url;
    publicParams.link_url = value || link_url;
    publicParams.enable = enable;
    publicParams.second = secondValue || second;
    if(change) {
      publicParams.ad_id = ad.id;
      publicParams.service = 'Admin.UpdateAd';
    }else {
      publicParams.service = 'Admin.AddAd';
    }
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result);
        if(result.data.code == 0) {
          if(change) {
            message.success('更换广告图成功');
          }else {
            message.success('添加广告图成功');
            this.setState({disable:true})
          }
        }
      }
    });
  }

  addPicChange(info) {
      let fileListAdd = info.fileList;
      fileListAdd = fileListAdd.slice(-1);
      this.setState({ fileListAdd });
      this.setState({
          change:false
      })
      console.log(publicParams);
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功。`);
        console.log(info);
        this.setState({
          adPic:info.file.response.data.img_url,
          img_url:info.file.response.data.img_url,
        });
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败。`);
      }
  }

  addPic() {
    const { disable,change } = this.state;
    var uploadImgProps = {
      name:'image',
      action: publicUrl+'/?service=Admin.UploadImage',
      data:publicParams,
      accept: 'image/*',
      // showUploadList:false,
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
      onChange:this.addPicChange
    };

    return(
      <Upload {...uploadImgProps} fileList={this.state.fileListAdd}>
        <Button type='primary' size='large' disabled={disable} >添加</Button>
      </Upload>
    )

  }

  changePicChange(info) {
      let fileListChange = info.fileList;
      fileListChange = fileListChange.slice(-1);
      this.setState({ fileListChange });
      this.setState({
          change:false
      })
      this.setState({
          change:true
      })
      console.log(publicParams,info);
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功。`);
        console.log(info);
        this.setState({
          img_url:info.file.response.data.img_url,
          adPic:info.file.response.data.img_url,
        });
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败。`);
      }
  }

  changePic() {
    const { disable,change } = this.state;
    publicParams.service = 'Admin.UploadImage';
    var props = {
      name:'image',
      action: publicUrl+'/?service=Admin.UploadImage',
      data:publicParams,
      accept: 'image/*',
      // showUploadList:false,
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
      onChange:this.changePicChange
    };
    return(
      <Upload {...props} fileList={this.state.fileListChange}>
        <Button type="primary" size='large' disabled={!disable}>更换</Button>
      </Upload>
    )
  }


  handleClickDelete() {
    const { ad } = this.state;
    publicParams.ad_id = ad.id;
    publicParams.service = 'Admin.DeleteAd';
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result);
          message.success('删除成功')
          this.setState({
            adPic:'',
            disable:false
          })
        }
    });
  }

  handleInputChange(e) {
    this.setState({link_url:e.target.value})
    console.log(this.state.link_url)
  }
  handleSecondChange(e) {
    this.setState({second:e.target.value})
    console.log(this.state.second)
  }

  renderValue() {
    const { ad, link_url } = this.state;
    // console.log(ad,link_url)
    // console.log(url,link_url,111);
    if(ad) {
      if(link_url) {
        return link_url
      }
      return ad.link_url
    }else {
      return 'http://'
    }
  }
  renderSecondValue() {
    const { ad, second } = this.state;
    if(ad) {
      if(second) {
        return second
      }
      return ad.second
    }else {
      return ''
    }
  }

  enableADButton(e) {
    if(e.target.innerHTML == '不启用' || e.target.childNodes[0].innerHTML == '不启用') {
      this.setState({
        enable:0,
      })
      message.info('不启用该广告图');
    }else {
      this.setState({
        enable:1,
      })
      message.info('启用该广告图');
    }
  }

  componentWillMount() {
    publicParams.service = 'Basic.GetAd';
    this.fetch();
  }

  render() {
    const { adPic,disable, ad, enable } = this.state;
    return (
      <div >
        <Row>
          <div style={{textAlign:'center'}}>
            <h2>广告图</h2>
            <div>&nbsp;</div>
            <img src={adPic} width='300' />
          </div>
        </Row>
        <Row>
          <div style={{marginTop:'2rem',backgroundColor:'red'}}>
              <div className='col-6 col-offset-9'>
                <div className='col-6' style={{textAlign:'center'}}>
                  {this.addPic()}
                </div>
                <div className='col-6' style={{textAlign:'center'}}>
                  {this.changePic()}
                </div>
                <div className='col-6' style={{textAlign:'center'}}>
                  <Button disabled={!disable} type='primary' size='large' onClick={this.handleClickDelete}>删除</Button>
                </div>
                <div className='col-6' style={{textAlign:'center'}}>
                  <Button type='primary' size='large' onClick={this.enableADButton}>{enable == 1 ? '不启用' : '启用'}</Button>
                </div>
              </div>
          </div>
        </Row>
        <Row>
          <div className='col-10 col-offset-7' style={{textAlign:'center',marginTop:'2rem'}}>
            <Input type='text' style={{width:'400px',height:'35px'}} placeholder='请输入链接地址，以http://开头' value={this.renderValue()} onChange={this.handleInputChange}  id='linkUrl'></Input>
            <br/>
            <Input type='text' style={{width:'400px',height:'35px',marginTop:'2rem'}} placeholder='请输入广告播放的秒数，以秒为单位' value={this.renderSecondValue()}  onChange={this.handleSecondChange} id='secondValue'></Input>
            <br/>
            <Button style={{width:'400px',marginTop:'2rem'}} type='primary' size='large' onClick={this.handleClick}>保存修改</Button>
          </div>
        </Row>
      </div>
    );
  }
}

export default AD;
