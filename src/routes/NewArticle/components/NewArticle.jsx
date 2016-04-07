import React from 'react';
import { Link } from 'react-router';

import {
  Row,
  Col,
  Button,
  Icon,
  Dropdown,
  Menu,
  SubMenu,
  Checkbox,
  Pagination,
  Upload,
  Form,
  Input,
  Tabs
} from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
let image = '';

class NewArticle extends React.Component{

  constructor() {
    super();
    this.state={
      current: 'mail'
    }
  }

  handleUpload() {
    let file = $('#ipt')[0];
    if(!file.files || !file.files[0]){
      return;
    }
    var reader = new FileReader();
    reader.onload = function(evt){
      document.getElementById('image').src = evt.target.result;
      image = evt.target.result;
    };
    reader.readAsDataURL(file.files[0]);

    console.log(file == $('#ipt')[0])
  }

  handleChange(e) {
    switch (Number(e)) {
      case 2:
        this.setState({
          
        });
        break;
      default:

        break;
    }
  }

  render() {
    return(
      <div>
        <header className="new-article-header">
          <Input className="article-header-input col-24" placeholder="标题"/>
        </header>
        <article className="new-article-content">
          <div className="new-article-content-div-t">
            <div className="article-content-div-t-1">
              <img id="image" src=" "/>
            </div>
            <div className="article-content-div-t-2">
              <label htmlFor="ipt">
                <a>上传图片</a>
              </label>
              <input style={{opacity:0}} id="ipt" type="file" onChange={this.handleUpload}/>
            </div>
          </div>
          <div className="new-article-content-div-c">
            <Tabs defaultActiveKey="1" onChange={this.handleChange}>
              <TabPane tab="编辑内容" key="1">

              </TabPane>
              <TabPane tab="跳转链接" key="2">

              </TabPane>
            </Tabs>
          </div>
          <div className="new-article-content-div-b">
              <Checkbox /><span>推荐到首页</span>&nbsp;&nbsp;&nbsp;&nbsp;<Checkbox /><span>置顶轮播</span>
          </div>
        </article>
        <footer className="new-article-footer">
          <Link to="/article">
            <div className="new-article-footer-1">
              发布
            </div>
          </Link>
          <Link to="/article">
            <div className="new-article-footer-2">
              取消
            </div>
          </Link>
          <div className="new-article-footer-3">
            预览
          </div>
        </footer>
      </div>
    )
  }
}

export default NewArticle;
