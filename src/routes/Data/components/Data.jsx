import React from 'react';
import Chart from 'chart.js';
import LineChart from 'react-chartjs/lib/line';
Chart.defaults.global.responsive = true;

import {
  Button,
  Breadcrumb,
  Menu,
  Icon,
  Dropdown,
  Row,
  Col
} from 'antd';
const ButtonGroup = Button.Group;

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">六日内</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">一星期内</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">一个月内</Menu.Item>
  </Menu>
);

class DataCenter extends React.Component{
  constructor() {
    super();
  }

  handleMouseOver(e) {
    console.log(e.target.parentNode.parentNode.childNodes[1]);
    let node = e.target.parentNode.parentNode.childNodes[1];
    node.setAttribute("style","display:block;background-color: #e44747");
  }
  handleOnMouseOut(e) {
    let node = e.target.parentNode.parentNode.childNodes[1];
    node.setAttribute("style","display:none;background-color: rgb(52, 73, 94)");
  }

  fetch(params = {}) {
    console.log(`请求参数：${params}`);
    this.setState({ loading: true });
    reqwest({
      url: 'demo/homeData.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        this.setState({

        });
      },
      error: (err) => {
        console.log(err);
        this.setState({ loading: false });
        message.error(err.statusText);
      }
    });
  }

  renderTable() {
    return(
      <tbody>
        <tr >
          <td>3.</td>
          <td>3会</td>
          <td>200</td>
        </tr>
      </tbody>
    )
  }

  render() {
    const chartPostData = {
      labels: [
        '2016-03-08',
        '2016-03-09',
        '2016-03-10',
        '2016-03-11',
        '2016-03-12',
        '2016-03-13',
        '2016-03-14'
      ],
      datasets: [{
        label: '累计用户',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgb(52, 73, 94)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: [15, 66, 72, 81, 73, 52, 119]
      },{
        label: '浏览量',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: '#7cbae5',
        pointColor: '#7cbae5',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: '#7cbae5',
        data: [24, 66, 52, 141, 123, 42, 19]
      }, {
        label: '访客数',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(231,76,60,.7)',
        pointColor: 'rgba(231,76,60,.7)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(231,76,60,.7)',
        data: [15, 26, 42, 121, 133, 22, 19]
      }, {
        label: 'IP 数',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(22, 160, 133,.7)',
        pointColor: 'rgba(22, 160, 133,.7)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(22, 160, 133,.7)',
        data: [34, 56, 57, 51, 73, 32, 95]
      }]
    };


    return(
      <section className="ant-data-right">
        <header className="data-right-header">
          <Row type="flex" justify="space-between" align="middle">
            <Col span="6">
              <div className="div" onMouseOver={this.handleMouseOver} onMouseOut={this.handleOnMouseOut}>
                <h1>145</h1>
                <h3 style={{marginTop:'-8rem'}}>累计用户</h3>
              </div>
              <div className="triangle" style={{display:'none'}}></div>
            </Col>
            <Col span="6">
              <div className="div"  onMouseOver={this.handleMouseOver} onMouseOut={this.handleOnMouseOut}>
                <h1>45</h1>
                <h3 style={{marginTop:'-8rem'}}>累计下载</h3>
              </div>
              <div className="triangle" style={{display:'none'}}></div>
            </Col>
            <Col span="6">
              <div className="div"  onMouseOver={this.handleMouseOver} onMouseOut={this.handleOnMouseOut}>
                <h1>14</h1>
                <h3 style={{marginTop:'-8rem'}}>昨日活跃</h3>
              </div>
              <div className="triangle" style={{display:'none'}}></div>
            </Col>
            <Col span="6">
              <div className="div"  onMouseOver={this.handleMouseOver} onMouseOut={this.handleOnMouseOut}>
                <h1>1</h1>
                <h3 style={{marginTop:'-8rem'}}>昨日新增</h3>
              </div>
              <div className="triangle" style={{display:'none'}}></div>
            </Col>
          </Row>
        </header>
        <div>
          <div style={{ maxWidth: 1000, margin: '0 auto 3rem' }} >
            <LineChart data={chartPostData}  width="600" height="250"/>
          </div>
          <section className="right-middle-bottom">
             <Row>
               <div className="col-3">
                 <h2>热门搜索排行</h2>
               </div>
               <ButtonGroup size="large">
                 <Button type="ghost">文章</Button>
                 <Button type="ghost">视频直播</Button>
                 <Button type="ghost">直播间</Button>
                 <Button type="ghost">
                   <Dropdown overlay={menu} trigger={['click']}>
                     <a className="ant-dropdown-link" href="#">
                       3日内 <Icon type="down" />
                     </a>
                   </Dropdown>
                 </Button>
               </ButtonGroup>
             </Row>
             <table style={{marginTop:'1rem',fontSize:'1.5rem'}}>
               <tbody>
                <tr>
                  <td >1.&nbsp;</td>
                  <td width="350">宋仲基</td>
                  <td>100</td>
                </tr>
                <tr >
                  <td>2.</td>
                  <td>两会</td>
                  <td>200</td>
                </tr>
                {this.renderTable()}
               </tbody>
             </table>
          </section>
        </div>
      </section>
    )
  }
}

export default DataCenter;
