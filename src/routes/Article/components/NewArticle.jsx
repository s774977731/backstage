import React from 'react';
import { Link } from 'react-router';
import reqwest from 'reqwest';

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

class NewArticle extends React.Component{

  constructor() {
    super();
    this.state={
      current: 'mail',
      key:1,
      visible:false,
      params:{}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  //handleUpload() {
  //  let file = $('#ipt')[0];
  //  if(!file.files || !file.files[0]){
  //    return;
  //  }
  //  var reader = new FileReader();
  //  reader.onload = function(evt){
  //    document.getElementById('image').src = evt.target.result;
  //    image = evt.target.result;
  //  };
  //  reader.readAsDataURL(file.files[0]);
  //  console.log(file == $('#ipt')[0])
  //}

  fetch(params = {}) {
    reqwest({
      url: '/api/comment',
      method: 'get',
      data: params,
      type: 'json',
      withCredentials: true,
      success: (result) => {
        if (result.data.data.length) {
          this.setState({

          });
        } else {
          this.setState({

          });
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
    e.preventDefault();
    console.log('收到表单值：', this.props.form.getFieldsValue());
  }

  renderUpload() {
    const props = {
      name: 'upload',
      action: '/upload.do',
      listType: 'picture-card',
      accept: 'image/*',
      showUploadList:true,
      defaultFileList: [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
        thumbUrl: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png'
      }],
      onChange: (res) => {
        console.log(res);
        switch (res.file.status) {
          case 'error':
            message.error('上传图片失败');
            break;
          case 'done':
            message.success('上传图片成功');
            this.setState({

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

  render() {
    const {visible} = this.state;
    const { getFieldProps } = this.props.form;
    return(
      <Form onSubmit={this.handleSubmit} form={this.props.form}>
        <FormItem>
          <Input {...getFieldProps('title')} style={{height:'40px'}} placeholder="标题"/>
        </FormItem>
        {this.renderUpload()  /*渲染图片上传*/}
        <FormItem>
          <Tabs defaultActiveKey="1">
            <TabPane tab="编辑内容" key="1" >
              <textarea {...getFieldProps('content')} placeholder="请添加内容" className="content-div-c-textarea"/>
            </TabPane>
            <TabPane tab="跳转链接" key="2" >
              <textarea {...getFieldProps('link')} placeholder="输入或粘贴链接" className="content-div-c-textarea" />
            </TabPane>
          </Tabs>
        </FormItem>
        <FormItem>
          <label className="ant-checkbox-inline">
            <Checkbox  {...getFieldProps('recommend')} />推荐到首页
          </label>
          <label className="ant-checkbox-inline">
            <Checkbox  {...getFieldProps('top')} />置顶轮播
          </label>
        </FormItem>
        <FormItem>
          <Link to="/article">
            <div className="new-article-footer-1">
              <Button htmlType="submit" style={{width:'100%',height:'100%'}}>
                发布
              </Button>
            </div>
          </Link>
          <div className="new-article-footer-2">
            <Button type="ghost" htmlType="submit" style={{width:'100%',height:'100%'}}>
              取消
            </Button>
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
