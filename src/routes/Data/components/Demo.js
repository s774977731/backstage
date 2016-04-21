import React from 'react';
var echarts = require('echarts');

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

class Demo extends React.Component{
  constructor() {
    super();
  }

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
// 绘制图表
    myChart.setOption({
      title: { text: 'ECharts 入门示例' },
      tooltip: {},
      xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    });
  }


  render() {

    return(
      <div >
          <div id="main" style={{width:'900px',height:'600px'}}></div>
      </div>
    )
  }
}

export default Demo;
