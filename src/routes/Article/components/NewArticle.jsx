import React from 'react';
import { Link } from 'react-router';
import reqwest from 'reqwest';
import md5 from "md5";
//import ReactQuill from 'react-quill';
//import QuillStyle from 'react-quill/node_modules/quill/dist/quill.snow.css';
//import ueditorConfig from 'http://bi.webei.cn/video/ueditor/ueditor.config.js';
//import ueditor from 'http://bi.webei.cn/video/ueditor/ueditor.all.min.js';

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
      text:'',
      tabkey:'1',
      fileList: window.article ? [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: window.article.image_url,
      }] : [],
      img_url:''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.showModal = this.showModal.bind(this);
    this.fetch = this.fetch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderPicture = this.renderPicture.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.renderDefaultKey = this.renderDefaultKey.bind(this);
    this.hangleTitleChange = this.hangleTitleChange.bind(this);
    this.returnImg_url = this.returnImg_url.bind(this);
    this.handleLinkChange = this.handleLinkChange.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }

  fetch() {
    reqwest({
      url: publicUrl+'/?service=Admin.AddArticle',
      method: 'post',
      data: publicParams,
      type: 'json',
      withCredentials: true,
      success: (result) => {
        console.log(result);
        if (result.data.code == 0) {
          if(window.article) {
            message.success('更新文章成功');
          }else {
            message.success('添加文章成功');
          }
          window.location.href = '#/article/main'
        }else if(result.data.code == 1){
          if(window.article) {
            message.success('更新文章失败');
          }else {
            message.success('添加文章失败');
          }
        }else if(result.data.code == 2) {
          message.info('最多只能推荐4个，请取消其他推荐');
        }else {
          message.info('请重新登录');
        }
        //if(result.data.code == 0) {
        //  message.success('添加文章成功');
        //  setTimeout(function(){
        //    window.location.href = '#/article/main'
        //  },500);
        //}else {
        //  message.error('添加文章失败')
        //}
      },
      error: (err) => {
        // console.log(err);
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

  returnImg_url() {
    const { img_url } = this.state;

    if(!img_url) {
      return  window.article.image_url
    }else {
      return img_url
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { img_url, articleTitle, value, articleLink, recommend} = this.state;
    if(this.ue) {
      var content = this.ue.getContent();
    }
    // console.log('收到表单值：', this.props.form.getFieldsValue());
    let formValue = this.props.form.getFieldsValue();

    publicParams.type = value;
    publicParams.content = content;
    publicParams.title = articleTitle;
    publicParams.image_url = this.returnImg_url();//this.returnImg_url()
    publicParams.url = articleLink;
    publicParams.author_name = $('#author').val();
    publicParams.source = $('#source').val();
    publicParams.recommended = Number(formValue.recommended) || 0;
    //publicParams.service = 'Admin.AddArticle';
      //更新文章
    if(window.article) {
      publicParams.recommended = Number(formValue.recommended) || window.article.recommend;
      publicParams.url = articleLink || window.article.article_url;
      publicParams.title = articleTitle || window.article.article_title;
      publicParams.author_name = $('#author').val() || window.article.author_name;
      publicParams.source = $('#source').val() || window.article.source;
      publicParams.article_id = window.article.article_id;
      publicParams.service = 'Admin.UpdateArticle';
    }else {
      //添加文章
      if(!img_url) {
       message.error('请上传图片');
       return false;
      }
      publicParams.service = 'Admin.AddArticle';
    }
    console.log(publicParams);
    this.fetch();
  }

  handleImgChange(info) {
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
    this.setState({ fileList });

    if (info.file.status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      // console.log(info.file.response.data.img_url);
      message.success(`${info.file.name} 上传成功。`);
      this.setState({
        img_url:info.file.response.data.img_url
      });
      console.log('跟换后的图片地址'+this.state.img_url);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败。`);
    }
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
      <div className="clearfix">
        <div>&nbsp;</div>
        <Upload {...props} fileList={this.state.fileList}>
          <Icon type="plus" />
          <div className="ant-upload-text">上传封面图</div>
        </Upload>
      </div>
    )
  }

  renderDefaultKey() {
    if(window.article) {
      if(window.article.type == 1) {
        this.setState({ tabkey:'1'})
      }else {
        this.setState({ tabkey:'2'})
      }
    }
  }


  handleChange(key) {
    // console.log(key);
    this.setState({
      value:key
    })
  }

  hangleTitleChange(e) {
    // console.log(e.target.value);
    this.setState({articleTitle:e.target.value});
  }

  handleLinkChange(e) {
    // console.log(e.target.value);
    this.setState({
      articleLink:e.target.value
    })
  }

  handleCheckChange(e) {
    // console.log(e.target.checked);
    var recommended;
    if(e.target.checked) {
      recommended = 1;
    }else {
      recommended = 0
    }
    this.setState({
      recommend:recommended
    })
  }

  renderArticleName() {
    const { articleTitle } = this.state;
    if(window.article) {
      if(articleTitle) {
        return articleTitle;
      }
      return window.article.article_title;
    }else {
        return articleTitle
    }
  }

  renderLink(e) {
    const { articleLink } = this.state;
    if(window.article) {
      if(articleLink) {
        return articleLink;
      }
      return window.article.article_url;
    }else {
      return articleLink;
    }
  }

  renderCheckbox() {
    if(window.article) {
      if(window.article.recommend == 1) {
        return true
      }else {
        return false
      }
    }
  }

  componentWillMount() {
    if(window.article) {
      window.record = JSON.parse(sessionStorage.record);
      window.comments = JSON.parse(sessionStorage.comments);
    }
    this.renderDefaultKey()
  }

  componentDidMount() {
    const { tabkey } = this.state;
    console.log(window.article,1123123);
    if(tabkey == 1) {
      this.ue = UE.getEditor('ueditContainer',{
        initialFrameHeight:'200',
        autoHeightEnabled: false,
        enableAutoSave:true,
        initialContent:`${window.article ? window.article.content : '请输入文章内容'}`
        //isShow:true,
      });
    }
  }

  componentWillUnmount() {
    const { tabkey } = this.state;
    if(tabkey == 1) {
      this.ue.destroy();
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    return(
      <Form onSubmit={this.handleSubmit} form={this.props.form}>
        <FormItem>
          <Input className='col-12' type="text" required {...getFieldProps('title')} style={{height:'40px'}} value={this.renderArticleName()} onChange={this.hangleTitleChange}  placeholder="输入文章标题"/>
          <Input className='col-12' id='author' type="text" required defaultValue={window.article ? window.article.author_name : ''} style={{height:'40px',width:'50%'}} placeholder="输入文章作者"/>
          <Input className='col-12' id='source' type="text" required defaultValue={window.article ? window.article.source : ''} style={{height:'40px',width:'50%'}} placeholder="输入文章来源"/>
        </FormItem>
          {this.renderPicture()}
        <FormItem style={{height:'300px'}}>
          <Tabs defaultActiveKey={this.state.tabkey} onChange={this.handleChange}>
            <TabPane tab="编辑内容" key="1" >
              {/*富文本编辑器*/}
              <div id="ueditContainer" name="content" type="text/plain">

              </div>
            </TabPane>
            <TabPane tab="跳转链接" key="2" >
              <FormItem>
                <Input  type="url" {...getFieldProps('link')} value={this.renderLink()} onChange={this.handleLinkChange} placeholder="输入或粘贴链接"/>
              </FormItem>
            </TabPane>
          </Tabs>
        </FormItem>
        <FormItem >
          <label className="ant-checkbox-inline">
            <Checkbox onChange={this.handleCheckChange} defaultChecked={this.renderCheckbox()} {...getFieldProps('recommended')} />推荐
          </label>
        </FormItem>
        <FormItem>
          <div className="new-article-footer-1">
            <Button htmlType="submit" style={{width:'100%',height:'100%'}}>
              发布
            </Button>
          </div>
          <div className="new-article-footer-2">
            <Link to="/article/main">
              <Button type="ghost" style={{width:'100%',height:'100%'}}>
                取消
              </Button>
            </Link>
          </div>
        </FormItem>
      </Form>
    )
  }
}

NewArticle = Form.create()(NewArticle);
export default NewArticle;
