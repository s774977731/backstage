import React from 'react';
import { Link } from 'react-router';

import {
  Row,
  Col,
  Button,
  Icon,
  Dropdown,
  Menu,
  Checkbox,
  Pagination
} from 'antd';
const ButtonGroup = Button.Group;

class AddAdmin extends React.Component{

  constructor() {
    super();
  }

  render() {
    return(
      <div>
        <div className="new-live-video-left col-12">
          <header>
            <input className="col-22" />
          </header>
          <article>
            <br />
            <br />
            <p>该频道的直播人</p>


            {/*视角div------*/}
            <Row>
              <div className="new-video-left-article-div">
                <span className="new-video-left-article-div1 col-5">视角一</span>
                <span className="new-video-left-article-div2 col-4">小兔子</span>
                <span className="new-video-left-article-div3 col-5 col-offset-8">取消添加</span>
              </div>
            </Row>
            <Row>
              <div className="new-video-left-article-div">
                <span className="new-video-left-article-div1 col-5">视角一</span>
                <span className="new-video-left-article-div2 col-4">小兔子</span>
                <span className="new-video-left-article-div3 col-5 col-offset-8">取消添加</span>
              </div>
            </Row>
            <Row>
              <div className="new-video-left-article-div">
                <span className="new-video-left-article-div1 col-5">视角一</span>
                <span className="new-video-left-article-div2 col-4">小兔子</span>
                <span className="new-video-left-article-div3 col-5 col-offset-8">取消添加</span>
              </div>
            </Row>
            <Row>
              <div className="new-video-left-article-div">
                <span className="new-video-left-article-div1 col-5">视角一</span>
                <span className="new-video-left-article-div2 col-4">小兔子</span>
                <span className="new-video-left-article-div3 col-5 col-offset-8">取消添加</span>
              </div>
            </Row>
            {/*视角div------*/}


          </article>
          <footer>
            <br />
            <br />
            <p>评论权限</p>
            <Row>
              <div className="col-5 new-video-left-footer-div1">hello</div>
              <div className="col-5 new-video-left-footer-div2">world</div>
            </Row>
            <div className="col-22 new-video-left-footer-div-b"><Icon type="check"/></div>
          </footer>

        </div>
        <div className="new-live-video-right col-12">
          <header>
            <Row>
              <div className="col-22 col-offset-1">
                <Icon type="smile-circle" />添加主播账号
              </div>
            </Row>
          </header>
          <section>
            {/*视角div------*/}
            <Row>
              <div className="new-video-right-article-div">
                <span className="new-video-right-article-div1 col-5 ">小兔子</span>
                <span className="new-video-right-article-div1 col-4 col-offset-15">小兔子</span>
              </div>
            </Row>
            <Row>
              <div className="new-video-right-article-div">
                <span className="new-video-right-article-div1 col-5 ">小兔子</span>
                <span className="new-video-right-article-div1 col-4 col-offset-15">小兔子</span>
              </div>
            </Row>
            <Row>
              <div className="new-video-right-article-div">
                <span className="new-video-right-article-div1 col-5 ">小兔子</span>
                <span className="new-video-right-article-div1 col-4 col-offset-15">小兔子</span>
              </div>
            </Row>
            <Row>
              <div className="new-video-right-article-div">
                <span className="new-video-right-article-div1 col-6 ">添加到该频道小兔子</span>
                <span className="new-video-right-article-div1 col-2 ">小兔子</span>
                <span className="new-video-right-article-div1 col-4 col-offset-12">小兔子</span>
              </div>
            </Row>
            <Row>
              <div className="new-video-right-article-div">
                <span className="new-video-right-article-div1 col-6 ">添加到该频道小兔子</span>
                <span className="new-video-right-article-div1 col-2 ">小兔子</span>
                <span className="new-video-right-article-div1 col-4 col-offset-12">小兔子</span>
              </div>
            </Row>
            <Row>
              <div className="new-video-right-article-div">
                <span className="new-video-right-article-div1 col-6 ">添加到该频道小兔子</span>
                <span className="new-video-right-article-div1 col-2 ">小兔子</span>
                <span className="new-video-right-article-div1 col-4 col-offset-12">小兔子</span>
              </div>
            </Row>
            <Row>
              <div className="new-video-right-article-div">
                <span className="new-video-right-article-div1 col-6 ">添加到该频道小兔子</span>
                <span className="new-video-right-article-div1 col-2 ">小兔子</span>
                <span className="new-video-right-article-div1 col-4 col-offset-12">小兔子</span>
              </div>
            </Row><Row>
            <div className="new-video-right-article-div">
              <span className="new-video-right-article-div1 col-6 ">添加到该频道小兔子</span>
              <span className="new-video-right-article-div1 col-2 ">小兔子</span>
              <span className="new-video-right-article-div1 col-4 col-offset-12">小兔子</span>
            </div>
          </Row>
            <Row>
              <div className="new-video-right-article-div">
                <span className="new-video-right-article-div1 col-6 ">添加到该频道小兔子</span>
                <span className="new-video-right-article-div1 col-2 ">小兔子</span>
                <span className="new-video-right-article-div1 col-4 col-offset-12">小兔子</span>
              </div>
            </Row>


            {/*视角div------*/}
          </section>
        </div>

      </div>
    )
  }
}

export default AddAdmin;

