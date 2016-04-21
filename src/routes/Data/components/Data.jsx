import React from 'react';
import Chart from 'chart.js';
import md5 from 'md5';
import LineChart from 'react-chartjs/lib/line';
Chart.defaults.global.responsive = true;

import {
  Button,
  Breadcrumb,
  Menu,
  Icon,
  Dropdown,
  Row,
  Col,
  Radio
} from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

//全局链接
var publicUrl = 'http://192.168.0.8:8080/backend/Public/video';
var timestamp = Date.parse(new Date());
var publicParams = {};
publicParams.app = 1;
publicParams.t = timestamp;
publicParams.sign=md5(timestamp+'lowkey');
publicParams.user_id=1;
publicParams.token='74c23bcb718cf1e93827cd43c9015f84';

var publicParamsJSON = JSON.stringify(publicParams);
sessionStorage.publicParams = publicParamsJSON;
sessionStorage.publicUrl = publicUrl;

class DataCenter extends React.Component{
  constructor() {
    super();
    this.state = {
      loading:false
    }
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
    this.setState({

    });
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
        this.setState({

        });
        message.error(err.statusText);
      }
    });
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
      }]
    };


    return(
      <section className="ant-data-right">
        <header className="data-right-header">
          <Row type="flex" justify="space-between" align="middle">
            <Col span="8">
              <div className="div" onMouseOver={this.handleMouseOver} onMouseOut={this.handleOnMouseOut}>
                <h1>145</h1>
                <h3 style={{marginTop:'-8rem'}}>累计用户</h3>
              </div>
              <div className="triangle" style={{display:'none'}}></div>
            </Col>
            <Col span="8">
              <div className="div"  onMouseOver={this.handleMouseOver} onMouseOut={this.handleOnMouseOut}>
                <h1>14</h1>
                <h3 style={{marginTop:'-8rem'}}>昨日活跃</h3>
              </div>
              <div className="triangle" style={{display:'none'}}></div>
            </Col>
            <Col span="8">
              <div className="div"  onMouseOver={this.handleMouseOver} onMouseOut={this.handleOnMouseOut}>
                <h1>1</h1>
                <h3 style={{marginTop:'-8rem'}}>昨日新增</h3>
              </div>
              <div className="triangle" style={{display:'none'}}></div>
            </Col>
          </Row>
        </header>
        <div>
          <div style={{marginBottom:'2rem'}}>
            <span style={{fontSize:'1.8rem',marginRight:'1rem'}}>累计用户</span>
            <RadioGroup defaultValue="a" size="large">
              <RadioButton value="a">三天</RadioButton>
              <RadioButton value="b">一星期</RadioButton>
              <RadioButton value="c">一个月</RadioButton>
            </RadioGroup>
          </div>
          <div style={{ maxWidth: 1000, margin: '0 auto 3rem' }} >
            <LineChart data={chartPostData}  width="600" height="250"/>
          </div>
        </div>
        <div>
          <div style={{marginBottom:'2rem'}}>
            <span style={{fontSize:'1.8rem',marginRight:'1rem'}}>昨日活跃</span>
            <RadioGroup defaultValue="a" size="large">
              <RadioButton value="a">三天</RadioButton>
              <RadioButton value="b">一星期</RadioButton>
              <RadioButton value="c">一个月</RadioButton>
            </RadioGroup>
          </div>
          <div style={{ maxWidth: 1000, margin: '0 auto 3rem' }} >
            <LineChart data={chartPostData}  width="600" height="250"/>
          </div>
        </div>
        <div>
          <div style={{marginBottom:'2rem'}}>
            <span style={{fontSize:'1.8rem',marginRight:'1rem'}}>昨日新增</span>
            <RadioGroup defaultValue="a" size="large">
              <RadioButton value="a">三天</RadioButton>
              <RadioButton value="b">一星期</RadioButton>
              <RadioButton value="c">一个月</RadioButton>
            </RadioGroup>
          </div>
          <div style={{ maxWidth: 1000, margin: '0 auto 3rem' }} >
            <LineChart data={chartPostData}  width="600" height="250"/>
          </div>
        </div>
      </section>
    )
  }
}

export default DataCenter;
