import React from 'react';
import { Link } from 'react-router';
import PublicComment from './../../Public/PublicComments.jsx';

import {
  Row,
  Col,
  Button,
  Icon,
  Dropdown,
  Menu,
  Checkbox,
  Pagination,
  Table,
  Input,
  Form
} from 'antd';

//全局链接
let publicParamsJSON = sessionStorage.publicParams;
let publicParams = JSON.parse(publicParamsJSON);
let publicUrl = sessionStorage.publicUrl;


class DetailArticle extends React.Component{

  constructor() {
    super();
  }

  renderContent() {
    if(window.article) {
      var content;
      // if(window.article.type == 1) {
      //    content = window.article.content;
      //   return { __html: content }
      // }else {
         content = window.article.article_url;
        // console.log(content);
        //return { __html: `<a href=${content} target="_blank"><p>${content}</p></a>` }
        return { __html: `<iframe src=${content} frameborder="0" style="width: 100%;height: 570px"></iframe>` }
      // }

    }else {
      return  {__html: `<div><br/><p>没有文章详情</p></div>`}
    }
  }



  componentWillMount(){
    window.record = JSON.parse(sessionStorage.record);
    window.article = JSON.parse(sessionStorage.article);
    window.comments = JSON.parse(sessionStorage.comments);
    //console.log(window.article,22222)
  }

  render() {
    return(
      <div>
        <Row>
          <Col span="11">
            <article className="video-check-left" >
              <Row>
                <h3>文章内容</h3>
                <p><a href="#/article/new-article">修改文章</a></p>
              </Row>
              <div style={{height:'57rem',overflow:'auto',overflowX:'hidden'}}>
                <div dangerouslySetInnerHTML={this.renderContent()} ></div>
              </div>
            </article>
          </Col>
          <Col span="11" offset="2">
            <PublicComment />
          </Col>
        </Row>
      </div>
    )
  }
}

export default DetailArticle;
