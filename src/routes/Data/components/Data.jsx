import React from 'react';
import Chart from 'chart.js';
import reqwest from 'reqwest';
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
//var publicUrl = 'http:192.168.0.8/backend/Public/video';
var publicUrl = 'http://bi.webei.cn/video';
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

//对象转化为数组
function transform(obj){
  var arr = [];
  for(var item in obj){
    arr.push(obj[item]);
  }
  return arr;
}

function getValus(source){
  var result=[],key,_length=0;
  for(key in source){
    if(source.hasOwnProperty(key)){
      result[_length++] = source[key];
    }
  }
  return result;
};
function getKeys(source){
  var result=[], key, _length=0;
  for(key in source){
    if(source.hasOwnProperty(key)){
      result[_length++] = key;
    }
  }
  return result;
};


class DataCenter extends React.Component{
  constructor() {
    super();
    this.state = {
      loading:false,
      totalNew:0,
      newNum:0,
      activeNum:0,
      totalNumber:[],
      totalTitles:[],
      newTitles:[],
      newNumber:[],
      activeTitles:[],
      activeNumber:[]

    };
    this.getCumulativeUserNum = this.getCumulativeUserNum.bind(this);
    this.getActiveUserNum = this.getActiveUserNum.bind(this);
    this.getNewAddedUserNum = this.getNewAddedUserNum.bind(this);
    this.handleTotalChange = this.handleTotalChange.bind(this);
    this.handleActiveChange = this.handleActiveChange.bind(this);
    this.handleNewChange = this.handleNewChange.bind(this);
  }

  handleMouseOver(e) {
    let node = e.target.parentNode.parentNode.childNodes[1];
    node.setAttribute("style","display:block;background-color: #e44747");
  }

  handleOnMouseOut(e) {
    let node = e.target.parentNode.parentNode.childNodes[1];
    node.setAttribute("style","display:none;background-color: rgb(52, 73, 94)");
  }

  fetch() {
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      success: (result) => {
        let num = transform(result.data.num).pop();
        let totalTitles = getKeys(result.data.num);
        let totalNumber = getValus(result.data.num);
        console.log(result.data);
        this.setState({
          totalNew:num,
          totalTitles:totalTitles,
          totalNumber:totalNumber
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

  handleTotalChange(e) {
    publicParams.service = 'Admin.GetCumulativeUserNum';
    publicParams.day = e.target.value;
    this.fetch()
  }

  handleNewChange(e) {
    publicParams.service = 'Admin.GetNewAddedUserNum';
    publicParams.day = e.target.value;
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      success: (result) => {
        console.log(result.data.num);
        let newNum = transform(result.data.num).pop();
        let newTitles = Object.keys(result.data.num);
        let newNumber = transform(result.data.num);
        this.setState({
          newNum:newNum,
          newTitles:newTitles,
          newNumber:newNumber
        });
      },
      error: (err) => {
        console.log(err);
        this.setState({

        });
        message.error(err.statusText);
      }
    })
  }

  handleActiveChange(e) {
    publicParams.service = 'Admin.GetActiveUserNum';
    publicParams.day = e.target.value;
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      success: (result) => {
        let activeNum = transform(result.data.num).pop();
        let activeTitles = Object.keys(result.data.num);
        let activeNumber = transform(result.data.num);
        this.setState({
          activeNum:activeNum,
          activeTitles:activeTitles,
          activeNumber:activeNumber
        });
        console.log(this.state.activeTitles,this.state.activeNumber);
      },

      error: (err) => {
        console.log(err);
        this.setState({

        });
        message.error(err.statusText);
      }
    })
  }

  getCumulativeUserNum() {
    publicParams.service = 'Admin.GetCumulativeUserNum';
    publicParams.day = 1;
    this.fetch()
  }

  getNewAddedUserNum() {
    publicParams.service = 'Admin.GetNewAddedUserNum';
    publicParams.day = 1;
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      success: (result) => {
        //console.log(result.data.num);
        let newNum = transform(result.data.num).pop();
        this.setState({
          newNum:newNum
        });
      },
      error: (err) => {
        message.error(err.statusText);
      }
    })
  }

  getActiveUserNum() {
    publicParams.service = 'Admin.GetActiveUserNum';
    publicParams.day = 1;
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      success: (result) => {
        //console.log(result.data.num);
        let activeNum = transform(result.data.num).pop();
        this.setState({
          activeNum:activeNum
        });
      },
      error: (err) => {
        message.error(err.statusText);
      }
    })
  }

  componentWillMount() {
    this.getCumulativeUserNum();
    this.getActiveUserNum();
    this.getNewAddedUserNum();
  }

  render() {
    const { totalNew, totalNumber, totalTitles, newTitles, newNumber, activeTitles, activeNumber, activeNum, newNum} = this.state;
    //累计用户
    const chartPostData = {
      labels: totalTitles,
      datasets: [{
        label: '累计用户',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgb(52, 73, 94)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: totalNumber
      }]
    };
    //活跃用户
    const chartActiveData = {
      labels: activeTitles,
      datasets: [{
        label: '累计用户',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgb(52, 73, 94)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: activeNumber
      }]
    };
    //新增用户
    const chartNewsPostData = {
      labels: newTitles,
      datasets: [{
        label: '累计用户',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgb(52, 73, 94)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: newNumber
      }]
    };
    const options = {
      animationSteps : 10,
    }

    return(
      <section className="ant-data-right">
        <header className="data-right-header">
          <Row type="flex" justify="space-between" align="middle">
            <Col span="8">
              <div className="div" onMouseOver={this.handleMouseOver} onMouseOut={this.handleOnMouseOut}>
                <h1>{totalNew || 0}</h1>
                <h3 style={{marginTop:'-8rem'}}>累计用户</h3>
              </div>
            </Col>
            <Col span="8">
              <div className="div"  onMouseOver={this.handleMouseOver} onMouseOut={this.handleOnMouseOut}>
                <h1>{activeNum || 0}</h1>
                <h3 style={{marginTop:'-8rem'}}>活跃用户</h3>
              </div>
            </Col>
            <Col span="8">
              <div className="div"  onMouseOver={this.handleMouseOver} onMouseOut={this.handleOnMouseOut}>
                <h1>{newNum || 0}</h1>
                <h3 style={{marginTop:'-8rem'}}>新增用户</h3>
              </div>
            </Col>
          </Row>
        </header>
        <div>
          <div style={{marginBottom:'2rem'}}>
            <span style={{fontSize:'1.8rem',marginRight:'1rem'}}>累计用户</span>
            <RadioGroup onChange={this.handleTotalChange} defaultValue="3" size="large">
              <RadioButton value="3">三天</RadioButton>
              <RadioButton value="7">一星期</RadioButton>
              <RadioButton value="30">一个月</RadioButton>
            </RadioGroup>
          </div>
          <div style={{ maxWidth: 1000, margin: '0 auto 3rem' }} >
            <LineChart data={chartPostData} options={options}  width="600" height="250"/>
          </div>
        </div>
        <div>
          <div style={{marginBottom:'2rem'}}>
            <span style={{fontSize:'1.8rem',marginRight:'1rem'}}>活跃用户</span>
            <RadioGroup onChange={this.handleActiveChange} defaultValue="3" size="large">
              <RadioButton value="3">三天</RadioButton>
              <RadioButton value="7">一星期</RadioButton>
              <RadioButton value="30">一个月</RadioButton>
            </RadioGroup>
          </div>
          <div style={{ maxWidth: 1000, margin: '0 auto 3rem' }} >
            <LineChart data={chartActiveData}  options={options} width="600" height="250"/>
          </div>
        </div>
        <div>
          <div style={{marginBottom:'2rem'}}>
            <span style={{fontSize:'1.8rem',marginRight:'1rem'}}>新增用户</span>
            <RadioGroup onChange={this.handleNewChange} defaultValue="3" size="large">
              <RadioButton value="3">三天</RadioButton>
              <RadioButton value="7">一星期</RadioButton>
              <RadioButton value="30">一个月</RadioButton>
            </RadioGroup>
          </div>
          <div style={{ maxWidth: 1000, margin: '0 auto 3rem' }} >
            <LineChart data={chartNewsPostData}  options={options} width="600" height="250"/>
          </div>
        </div>
      </section>
    )
  }
}

export default DataCenter;
