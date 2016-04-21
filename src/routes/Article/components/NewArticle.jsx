import React from 'react';
import { Link } from 'react-router';
import reqwest from 'reqwest';
import md5 from "md5";
var Base64 = require('js-base64').Base64;

import {
  Row,
  Col,
  Button,
  Icon,
  Checkbox,
  Upload,
  Form,
  Input,
  Tabs,
  message,
  Modal
} from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
//全局链接
let publicParamsJSON = sessionStorage.publicParams;
let publicParams = JSON.parse(publicParamsJSON);
let publicUrl = sessionStorage.publicUrl;
//合并对象
let extend=function(o,n,override){
  for(var p in n)if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))o[p]=n[p];
};

class NewArticle extends React.Component{

  constructor() {
    super();
    this.state={
      current: 'mail',
      visible:false,
      params:{},
      value:1,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.fetch = this.fetch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickUpload = this.handleClickUpload.bind(this);
  }

  fetch() {
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result);
        if (result.data.code == 0) {
          message.success('添加文章成功');
          setTimeout(function(){
            window.location.href = '/#/article'
          },500);
        }else if (result.data.code == 1){
          message.error('添加文章失败');
        }else{
          message.info('请重新登录');
        }
      },
      error: (err) => {
        console.log(err);
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

  handleSubmit(e) {
    const { value } = this.state;
    e.preventDefault();
    console.log('收到表单值：', this.props.form.getFieldsValue());
    let formValue = this.props.form.getFieldsValue();

    let params = {
      type:value,
      content:'hello',
      title:formValue.title,
      image_url:'111111',
      url:formValue.link  || '',
      recommended:Number(formValue.recommended) || 0,
      banner:Number(formValue.banner) || 0
    };
    publicParams.service = 'Admin.AddArticle';

    extend(publicParams,params);
    console.log(publicParams);
    this.fetch();
  }

  handleClickUpload() {
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

  renderUpload() {
    let params = {
      service:'Basic.UploadPicture',
      data_uri_scheme:this.state.base64,
      uid:1
    };
    extend(publicParams,params);

    const props = {
      name: 'image_url',
      action: publicUrl,
      listType: 'picture-card',
      data:publicParams,
      accept: 'image/*',
      dataType:'jsonp',
      showUploadList:true,
      onChange: (res) => {
        switch (res.file.status) {
          case 'error':
            console.log(res.file.thumbUrl);
            message.error('上传图片失败');
            break;
          case 'done':
            message.success('上传图片成功');
            this.setState({
              base64:res.file.thumbUrl
            });
            break;
          default:
            break;
        }
      }
    };
    return(
      <FormItem>
        <Upload {...props}>
          <Icon type="plus" />
          <div className="ant-upload-text">上传照片</div>
        </Upload>
      </FormItem>
    )
  }

  showModal() {
    const {params} = this.state;
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      this.setState({ params: values });
      console.log(values);
    });
    Modal.info({
      title: '信息预览',
      content: (
        <div>
          <p>标题：{params.title || '无'}</p>
          <p>头像：{}</p>
          <p>文章内容：{params.content || '谁的客户给发U很干净看看就会感觉啊很多国家的更好独守空房嘎哈uw误会乌尔禾无额活该和uhah莪和午饭'}</p>
          <p>文章内容：{params.link || 'http://www.baidu.com'}</p>
        </div>
      ),
      onOk() {}
    });
  }

  handleChange(key) {
    console.log(key);
    this.setState({
      value:key
    })
  }

  render() {
    const { publish } = this.state;
    const { getFieldProps } = this.props.form;
    return(
      <Form onSubmit={this.handleSubmit} form={this.props.form}>
        <FormItem>
          <Input required {...getFieldProps('title')} style={{height:'40px'}} maxLength="25" placeholder="标题（最多25个字）"/>
        </FormItem>
        {this.renderUpload()  /*渲染图片上传*/}
        <FormItem>
          <img id="img" width="100" height="100" src="http://static.v1.5.webei.cn/business/images/forum_logo.png" alt="" />
          <label htmlFor="uploadLogo" style={{marginLeft:'1rem',color:'#2db7f5',fontSize:'1.5rem',cursor:'pointer'}} id="uploadLogoAction" href="javascript:void(0)">修改</label>
          <input style={{display:'none'}} id="uploadLogo" onChange={this.handleClickUpload} name="logo" type="file" single />
        </FormItem>
        <FormItem>
          <Tabs defaultActiveKey="1" onChange={this.handleChange}>
            <TabPane tab="编辑内容" key="1" >
              <iframe frameBorder="1" src="" height="300" width="100%"></iframe>
            </TabPane>
            <TabPane tab="跳转链接" key="2" >
              <Input type="textarea" type="url" {...getFieldProps('link')} placeholder="输入或粘贴链接"/>
            </TabPane>
          </Tabs>
        </FormItem>
        <FormItem>
          <label className="ant-checkbox-inline">
            <Checkbox  {...getFieldProps('recommended')} />推荐到首页
          </label>
          <label className="ant-checkbox-inline">
            <Checkbox  {...getFieldProps('banner')} />置顶轮播
          </label>
        </FormItem>
        <FormItem>
          <div className="new-article-footer-1">
            <Button htmlType="submit" style={{width:'100%',height:'100%'}}>
              发布
            </Button>
          </div>
          <div className="new-article-footer-2">
            <Link to="/article">
              <Button type="ghost" style={{width:'100%',height:'100%'}}>
                取消
              </Button>
            </Link>
          </div>
          <div onClick={this.showModal} className="new-article-footer-3">
            预览
          </div>
        </FormItem>
      </Form>
    )
  }
}

NewArticle = Form.create()(NewArticle);
export default NewArticle;
