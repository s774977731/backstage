import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import reqwest from 'reqwest';
//import video from 'video';
import PublicComments from '../../Public/PublicComments.jsx';
//import cyberplayer from '../../../../sources/Baidu-T5Player-SDK-Web-v2.0.3/player/cyberplayer.js'
//import cyberplayerSwf from '../../../../sources/Baidu-T5Player-SDK-Web-v2.0.3/player/cyberplayer.flash.swf'

import {
  Row,
  Col,
  Button,
  Icon,
  Form,
  Menu,
  Table,
  message,
  Tag
} from 'antd';
//全局链接
let publicParamsJSON = sessionStorage.publicParams;
let publicParams = JSON.parse(publicParamsJSON);
let publicUrl = sessionStorage.publicUrl;

//找到数组中的某个值，并返回一个数组
function getStats(array = [], key) {
  return array.length ? array.map((value) => value[key]) : [];
}

//Array.prototype.S=String.fromCharCode(2);
//Array.prototype.in_array=function(e){
//  var r=new RegExp(this.S+e+this.S);
//  return (r.test(this.S+this.join(this.S)+this.S));
//};

class VideoCheck extends React.Component{

  constructor() {
    super();
    this.state = {
      pause1:false,
      pause2:false,
      pause3:false,
      pause4:false,
    }
    this.code1 = this.code1.bind(this);
    this.code2 = this.code2.bind(this);
    this.code3 = this.code3.bind(this);
    this.code4 = this.code4.bind(this);
    this.stopDeleteOneView = this.stopDeleteOneView.bind(this);
  }
  componentWillMount() {
    //var code = getStats(window.videoCheck,'view_code');
    if(window.videoCheck) {
      for(var i=0;i<window.videoCheck.length;i++) {
        if(window.videoCheck[i].view_code == 1 && window.videoCheck[i].session_status == 0) {
          this.state.pause1 = true
        }
        if(window.videoCheck[i].view_code == 2 && window.videoCheck[i].session_status == 0) {
          this.state.pause2 = true
        }
        if(window.videoCheck[i].view_code == 3 && window.videoCheck[i].session_status == 0) {
          this.state.pause3 = true
        }
        if(window.videoCheck[i].view_code == 4 && window.videoCheck[i].session_status == 0) {
          this.state.pause4 = true
        }
      }
      if(window.record) {
        if(window.record.status != 2) {
          this.state.pause1 = this.state.pause2 = this.state.pause3 = this.state.pause4 = false;
        }
      }
    }
  }


  componentDidMount() {
    console.log(window.videoCheck,window.record);
    var video = window.videoCheck;
    for(let i=0;i<video.length;i++) {
      if(video[i].session_status == 0) {
        switch (Number(video[i].view_code)) {
          case 1:
            this.playUrl1 = [{file:video[i].play_url}];
                break;
          case 2:
            this.playUrl2 = [{file:video[i].play_url}];
                break;
          case 3:
            this.playUrl3 = [{file:video[i].play_url}];
                break;
          case 4:
            this.playUrl4 = [{file:video[i].play_url}];
                break;
        }
      } else {
        let playList = video[i].play_list;
        this.playUrl1 = this.playUrl2 = this.playUrl3 = this.playUrl4 = [];
        for(let j=0;j<playList.length;j++) {
         let playListUrl = {file:playList[j].play_url};
          switch (Number(video[i].view_code)) {
            case 1:
              this.playUrl1.push(playListUrl);
              break;
            case 2:
              this.playUrl2.push(playListUrl);
              break;
            case 3:
              this.playUrl3.push(playListUrl);
              break;
            case 4:
              this.playUrl4.push(playListUrl);
              break;
          }
        }
      }

    }
    console.log(this.playUrl1);
    window.player1 = cyberplayer("playercontainer1").setup({
        width: 250,
        height: 250,
        stretching: "uniform",
        //file: 'http://multimedia.bj.bcebos.com/media/motorOutput.mp4',
        // http://multimedia.bj.bcebos.com/media/motorOutput.mp4
        playlist: this.playUrl1,
        autostart: true,
        repeat: false,
        volume: 100,
        controls: 'none',
        ak: '68b56a90481847a4b321f6d393e74c01' // 公有云平台注册即可获得accessKey
      });
    window.player2 = cyberplayer("playercontainer2").setup({
      width: 250,
      height: 250,
      stretching: "uniform",
      file: this.playUrl2 || [],
      autostart: true,
      repeat: true,
      volume: 100,
      controls: 'none',
      ak: '68b56a90481847a4b321f6d393e74c01' // 公有云平台注册即可获得accessKey
    });
    window.player3 = cyberplayer("playercontainer3").setup({
      width: 250,
      height: 250,
      stretching: "uniform",
      file: this.playUrl3,
      autostart: true,
      repeat: false,
      volume: 100,
      controls: 'none',
      ak: '68b56a90481847a4b321f6d393e74c01' // 公有云平台注册即可获得accessKey
    });
    window.player4 = cyberplayer("playercontainer4").setup({
      width: 250,
      height: 250,
      stretching: "uniform",
      file: this.playUrl4,
      autostart: true,
      repeat: false,
      volume: 100,
      controls: 'none',
      ak: '68b56a90481847a4b321f6d393e74c01' // 公有云平台注册即可获得accessKey
    });
  }

  code1() {
    publicParams.view_code = 1;
    publicParams.sjcode = 1;
    if(this.state.pause1) {
      console.log(111);
      publicParams.service = 'Admin.StopVideoView'
    }else {
      console.log(222);
      publicParams.service = 'Admin.DeleteVideoView'
    }
    this.stopDeleteOneView();
  }

  code2() {
    publicParams.view_code = 2;
    publicParams.sjcode = 2;
    if(this.state.pause2) {
      publicParams.service = 'Admin.StopVideoView'
    }else {
      publicParams.service = 'Admin.DeleteVideoView'
    }
    this.stopDeleteOneView();

  }

  code3() {
    publicParams.view_code = 3;
    publicParams.sjcode = 3;
    if(this.state.pause3) {
      publicParams.service = 'Admin.StopVideoView'
    }else {
      publicParams.service = 'Admin.DeleteVideoView'
    }
    this.stopDeleteOneView();
  }

  code4() {
    publicParams.view_code = 4;
    publicParams.sjcode = 4;
    if(this.state.pause4) {
      publicParams.service = 'Admin.StopVideoView'
    }else {
      publicParams.service = 'Admin.DeleteVideoView'
    }
    this.stopDeleteOneView();
  }

  stopDeleteOneView() {
    publicParams.video_id = window.record.id;
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result);
        if(result.data.code == 0) {
          message.success('操作成功');
          if(publicParams.sjcode == 1) {
            if(publicParams.service == 'Admin.StopVideoView') {
              window.player1.stop();
            }else {
              window.player1.remove();
            }
            this.setState({
              pause1 : false
            })
          }
          if(publicParams.sjcode == 2) {
            if(publicParams.service == 'Admin.StopVideoView') {
              window.player1.stop();
            }else {
              window.player1.remove();
            }
            this.setState({
              pause2 : false
            })
          }
          if(publicParams.sjcode == 3) {
            if(publicParams.service == 'Admin.StopVideoView') {
              window.player1.stop();
            }else {
              window.player1.remove();
            }
            this.setState({
              pause3 : false
            })
          }
          if(publicParams.sjcode == 4) {
            if(publicParams.service == 'Admin.StopVideoView') {
              window.player1.stop();
            }else {
              window.player1.remove();
            }
            this.setState({
              pause4 : false
            })
          }
        }
      },
      error: (err) => {
        console.log(err);
        this.setState({ loading: false });
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

  handleClickDelete() {
    publicParams.video_id = window.record.id;
    if(window.record.delete) {
      publicParams.service = 'Admin.DeleteVideo'
    }else {
      publicParams.service = 'Admin.StopVideo'
    }
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        console.log(result);
        if(result.data.code == 0) {
          message.success('操作成功');
          window.location.href = '#/live-video'
        }
      },
      error: (err) => {
        console.log(err);
        this.setState({ loading: false });
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

  //handleClickPlayer() {
  //  publicParams.video_id = window.record.id;
  //  publicParams.view_code = e.target.code;
  //  if(window.record.delete) {
  //    publicParams.service = 'Admin.DeleteVideoView';
  //  }else {
  //    publicParams.service = 'Admin.StopVideoView';
  //  }
  //  reqwest({
  //    url: publicUrl,
  //    method: 'get',
  //    data: publicParams,
  //    type: 'jsonp',
  //    withCredentials: true,
  //    success: (result) => {
  //      console.log(result.data);
  //
  //    },
  //    error: (err) => {
  //      console.log(err);
  //      this.setState({ loading: false });
  //      switch (err.status) {
  //        case 404:
  //          message.error('获取数据失败，请联系官方人员！');
  //          break;
  //        default:
  //          message.error('获取数据失败，请刷新重试！');
  //          break;
  //      }
  //    }
  //  });
  //}

  render() {
    return(
      <div>
        <header className="video-check-header" >
            <Button onClick={this.handleClickDelete} size="large" type="ghost"><Icon type="cross-circle" />
              {window.record.delete ? '删除直播' : '结束直播'}
            </Button>
            <span style={{marginLeft:'3rem',fontSize:'1.5rem'}}>{window.record.name}</span>
        </header>
        <Row>
          <div style={{minWidth:'550px',maxWidth:'600px',float:'left'}}>
            <Row >
              <div className="col-10">
                <div style={{width:'250px',height:'250px',backgroundColor:'#000'}}><div id="playercontainer1" ></div></div>
                <div style={{position:'relative',marginTop:'-245px',marginLeft:'5px'}}>
                  <Tag color="red" >视角一</Tag>
                </div>
                <div style={{position:'relative',marginLeft:'218px',marginTop:'188px'}}>
                  <Tag color="red" style={{cursor:'pointer'}} onClick={this.code1}>
                    {this.state.pause1 ? <Icon type="play-circle-o" /> : <Icon type="delete"/>}
                  </Tag>
                </div>
              </div>
              <div className="col-10 col-offset-2">
                <div style={{width:'250px',height:'250px',backgroundColor:'#000'}}><div id="playercontainer2" ></div></div>
                <div style={{position:'relative',marginTop:'-245px',marginLeft:'5px'}}>
                  <Tag color="red">视角二</Tag>
                </div>
                <div style={{position:'relative',marginLeft:'218px',marginTop:'188px'}}>
                  <Tag color="red" style={{cursor:'pointer'}} onClick={this.code2}>
                    {this.state.pause2 ? <Icon type="play-circle-o" /> : <Icon type="delete"/>}
                  </Tag>
                </div>
              </div>
            </Row>
            <Row style={{marginTop:'20px'}}>
              <div className="col-10" >
                <div style={{width:'250px',height:'250px',backgroundColor:'#000'}}><div id="playercontainer3" ></div></div>
                <div style={{position:'relative',marginTop:'-245px',marginLeft:'5px'}}>
                  <Tag color="red">视角三</Tag>
                </div>
                <div style={{position:'relative',marginLeft:'218px',marginTop:'188px'}}>
                  <Tag color="red" style={{cursor:'pointer'}} onClick={this.code3}>
                    {this.state.pause3 ? <Icon type="play-circle-o" /> : <Icon type="delete"/>}
                  </Tag>
                </div>
              </div>
              <div className="col-10 col-offset-2">
                <div style={{width:'250px',height:'250px',backgroundColor:'#000'}}><div id="playercontainer4" ></div></div>
                <div style={{position:'relative',marginTop:'-245px',marginLeft:'5px'}}>
                  <Tag color="red">视角四</Tag>
                </div>
                <div style={{position:'relative',marginLeft:'218px',marginTop:'188px'}}>
                  <Tag color="red" style={{cursor:'pointer'}} onClick={this.code4}>
                    {this.state.pause4 ? <Icon type="play-circle-o" /> : <Icon type="delete"/>}
                  </Tag>
                </div>
              </div>
            </Row>
          </div>
          <div className="col-10 col-offset-1" style={{float:'left',minWidth:'440px',maxWidth:'600px'}}>
            <PublicComments />
          </div>
        </Row>
      </div>
    )
  }
}


VideoCheck = Form.create()(VideoCheck);
export default VideoCheck;

