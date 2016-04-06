import React from 'react';
import Chart from 'chart.js';
import LineChart from 'react-chartjs/lib/line';
Chart.defaults.global.responsive = true;


import {
  DatePicker,
  Button,
  Model,
  Cascader,
  Breadcrumb,
  Menu,
  Icon,
  Dropdown,
  Row,
  Col
} from 'antd';

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">第一个菜单项</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">第二个菜单项</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">第三个菜单项</Menu.Item>
  </Menu>
);

class DataCenter extends React.Component{
  constructor() {
    super();
  }

  handleMouseOver(e) {
    console.log(e.target.parentNode.childNodes[1]);
    let node = e.target.parentNode.childNodes[1];
    node.setAttribute("style","display:block;background-color: #e44747");
  }
  handleOnMouseOut(e) {
    let node = e.target.parentNode.childNodes[1];
    node.setAttribute("style","display:none;background-color: rgb(52, 73, 94)");
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
        label: '用户数',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgb(52, 73, 94)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: [245, 566, 572, 851, 673, 342, 919]
      }]
    };


    return(
      <section className="ant-data-right">
        <header className="data-right-header">
          <Row type="flex" justify="space-between">
            <Col span="5">
              <div className="div" onMouseOver={this.handleMouseOver} onMouseOut={this.handleOnMouseOut}>累计用户</div>
              <div className="triangle" style={{display:'none'}}></div>
            </Col>
            <Col span="5">
              <div className="div"  onMouseOver={this.handleMouseOver} onMouseOut={this.handleOnMouseOut}>累计下载</div>
              <div className="triangle" style={{display:'none'}}></div>
            </Col>
            <Col span="5">
              <div className="div"  onMouseOver={this.handleMouseOver} onMouseOut={this.handleOnMouseOut}>昨日活跃</div>
              <div className="triangle" style={{display:'none'}}></div>
            </Col>
            <Col span="5">
              <div className="div"  onMouseOver={this.handleMouseOver} onMouseOut={this.handleOnMouseOut}>昨日新增</div>
              <div className="triangle" style={{display:'none'}}></div>
            </Col>
          </Row>
        </header>
        <div className="data-right-middle">
          <div style={{width:'100%', margin: '0 auto'}} >
            <LineChart data={chartPostData} style={{width:'85%',height:'25rem',marginLeft:'7%'}}/>
          </div>
          <section className="right-middle-bottom">
             <Row>
               <div className="col-4 col-offset-1">
                 <h2>热门搜索排行</h2>
               </div>
               <div className="col-2"><h3>文章</h3></div>
               <div className="col-2 "><h3>视频直播</h3></div>
               <div className="col-2"><h3>直播间</h3></div>
               <div className="col-2">
                 <Dropdown overlay={menu} trigger={['click']}>
                   <a className="ant-dropdown-link" href="#">
                     3日内 <Icon type="down" />
                   </a>
                 </Dropdown>
               </div>
             </Row>
          </section>
        </div>
      </section>
    )
  }
}

export default DataCenter;
