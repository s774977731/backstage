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

class DetailArticle extends React.Component{

  constructor() {
    super();
  }

  renderContent() {
    if(window.article) {
      return  {__html:`${String(window.article.content).length > 0}` ? `${window.article.content}` : `<div><br/><p>没有文章详情</p></div>`}
    }else {
      return  {__html: `<div><br/><p>没有文章详情</p></div>`}
    }
  }

  componentDidMount(){

  }

  render() {
    return(
      <div>
        <Row>
          <Col span="11">
            <article className="video-check-left" >
              <Row>
                <h3>文章内容</h3>
              </Row>
              <div style={{height:'44rem',overflow:'auto',overflowX:'hidden'}}>
                <div dangerouslySetInnerHTML={this.renderContent()} ></div>
              </div>
            </article>
          </Col>
          <Col span="11" offset="1">
            <PublicComment />
          </Col>
        </Row>
      </div>
    )
  }
}

export default DetailArticle;

