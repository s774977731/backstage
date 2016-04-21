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
  Pagination,
  Table,
  Input,
  Form
} from 'antd';
const FormItem = Form.Item;

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `李大嘴${i}`,
    age: 32,
    address: `西湖区湖底公园${i}号`
  });
}

const backImg = {
  //backgroundImage:'url('+imgUrl+')',
  backgroundColor:'#fff',
  alignItems:'center'
};

const commentList = {
  user:'小兔子',
  time:'2016-12-12',
  comment:`折若木以拂日兮，聊逍遥以相羊；
前望舒使先驱兮，后飞廉使奔属；
鸾皇为余先戒兮，雷师告余以未具；
吾令凤鸟飞腾夕，继之以日夜；
飘风屯其相离兮，帅云霓而来御；
纷总总其离合兮，斑陆离其上下；
吾令帝阍开关兮，倚阊阖而望予；
时暧暧其将罢兮，结幽兰而延伫；
世溷浊而不分兮，好蔽美而嫉妒。 `
};
const article = {
  content:`长太息以掩涕兮，哀民生之多艰；
余虽好修姱以鞿[6]羁兮，謇朝谇而夕替；
既替余以蕙纕兮，又申之以揽芷；
亦余心之所善兮，虽九死其尤未悔；
众女疾余之蛾眉兮，谣诼谓余以善淫；
固时俗之工巧兮，偭规矩而改错；
背绳墨以追曲兮，竞周容以为度；
忳[7]郁邑余挓[8]傺兮，吾独穷困乎此时也；
宁溘死以流亡兮，余不忍为此态；
鸷鸟之不群兮，自前世而固然；
何方圜之能周兮，夫孰异道而相安；
屈心而抑志兮，忍尤而攘诟；
伏清白以死直兮，固前圣之所厚。

悔相道之不察兮，延伫乎吾将反；
回朕车以复路兮，及行迷之未远；
步余马于兰皋兮，驰椒丘且焉止息；
进不入以离尤兮，退将复修吾初服；
制芰荷以为衣兮，集芙蓉以为裳；
不吾知其亦已兮，苟余情其信芳；
高余冠之岌岌兮，长余佩之陆离；
芳与泽其杂糅兮，唯昭质其犹未亏；
忽反顾以游目兮，将往观乎四荒；
佩缤纷其繁饰兮，芳菲菲其弥章；
民生各有所乐兮，余独好修以为常；
虽体解吾犹未变兮，岂余心之可惩。

女媭[9]之婵媛兮，申申其詈予。
曰：“鮌婞[10]直以亡身兮，终然夭乎羽之野；
汝何博謇[11]而好修兮，纷独有此姱节；
薋菉葹[12]以盈室兮，判独离而不服；
众不可户说兮，孰云察余之中情；
世并举而好朋兮，夫何茕独而不予听。”
依前圣以节中兮，喟凭心而历兹；
济沅湘以南征兮，就重华而陈词：
“启《九辩》与《九歌》兮，夏康娱以自纵；
不顾难[13]以图后兮，五子用乎家巷；
羿淫游以佚畋兮，又好射夫封狐；
固乱流其鲜终兮，浞又贪夫厥家；
浇身被服强圉兮，纵欲而不忍；
日康娱而自忘兮，厥首用夫颠陨；
夏桀之常违兮，乃遂焉而逢殃；
后辛之菹醢兮，殷宗用之不长；
汤禹俨而祗敬兮，周论道而莫差；
举贤才而授能兮，循绳墨而不颇；
皇天无私阿兮，揽民德焉错辅；
夫维圣哲以茂行兮，苟得用此下土；
瞻前而顾后兮，相观民之计极；
夫孰非义而可用兮，孰非善而可服；
阽余身而危死兮，揽余初其犹未悔；
不量凿而正枘兮，固前修以菹醢。”
曾歔欷余郁邑兮，哀朕时之不当；
揽茹蕙以掩涕兮，沾余襟之浪浪。
 跪敷衽以陈词兮，耿吾既得中正；
驷玉虬以乘鹥[14]兮，溘埃风余上征；
朝发轫于苍梧兮，夕余至乎县圃；
欲少留此灵琐兮，日忽忽其将暮；
吾令羲和弭节兮，望崦嵫而匆迫；
路曼曼其修远兮，吾将上下而求索；
饮余马于咸池兮，总余辔乎扶桑；
折若木以拂日兮，聊逍遥以相羊；
前望舒使先驱兮，后飞廉使奔属；
鸾皇为余先戒兮，雷师告余以未具；
吾令凤鸟飞腾夕，继之以日夜；
飘风屯其相离兮，帅云霓而来御；
纷总总其离合兮，斑陆离其上下；
吾令帝阍开关兮，倚阊阖而望予；
时暧暧其将罢兮，结幽兰而延伫；
世溷浊而不分兮，好蔽美而嫉妒。
灵芬既告余以吉占兮，历吉日乎吾将行；
折琼枝以为羞兮，精琼爢[30]以为粻[31]；
为余驾飞龙兮，杂瑶象以为车；
何离心之可同兮，吾将远逝以自疏；
`
};

class DetailArticle extends React.Component{

  constructor() {
    super();
  }

  handleClick(e) {
    console.log($('#video1'));
    //e.target.play();
    if(e.target.paused){
      e.target.play();
    }else{
      e.target.pause();
    }
  }

  scrollSide() {
    let videoBox = $('.video-check-right-m');
    let scrollHeight = videoBox.scrollTop();
    const rightHeight = videoBox.height();

    let lastComment = $('.video-check-right-comment');
    let lastboxHeight = lastComment.last().get(0).offsetTop+Math.floor(lastComment.last().height()/2);

    console.log(scrollHeight,rightHeight,lastboxHeight);
    if(scrollHeight+rightHeight > lastboxHeight-100){
      let box = $('<div>').addClass('video-check-right-comment').appendTo($('.video-check-right-m'));

      let content = $('<div>').html(
        `<div class="video-check-right-comment">
            <Row>
              <div class="col-2 video-check-right-commentList">${commentList.user}</div>
              <div class="col-2 video-check-right-commentList">头像</div>
              <div class="col-16 video-check-right-commentList">${commentList.time}</div>
              <div class="col-4 video-check-right-commentList"><i class=" anticon anticon-exclamation-circle-o"></i>&nbsp;&nbsp;&nbsp;&nbsp;<i class=" anticon anticon-lock"></i></div>
            </Row>
            <div class="video-check-right-commentDetail">
              ${commentList.comment}
            </div>
          </div>`
      ).appendTo(box);
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      wrapperCol: { span: 20 }
    };

    return(
      <div>
        <Row>
          <article className="video-check-left col-11" style={{overflowStyle:'scrollbar',overflow:'auto'}}>
            <h3>文章内容</h3>
            <p>{article.content}</p>
          </article>
          <div onScroll={this.scrollSide} className=" video-check-right col-11 col-offset-1">
            <h2>温州市2015全民马拉松</h2>
            <Row>
              <Form style={{height: '3rem'}}>
                <FormItem
                  {...formItemLayout}
                  hasFeedback>
                  <Input type="email" placeholder="请输入关键词" style={{height:'40px'}} />
                </FormItem>
                <FormItem
                  wrapperCol={{ span: 4 }}
                >
                  <Button style={{width:'100%',height:'40px'}} htmlType="submit" type="ghost" >提交</Button>
                </FormItem>
              </Form>
            </Row>
            <br/>
            <div className="video-check-right-m">
              <div className="video-check-right-comment">
                <Row>
                  <div className="col-2 video-check-right-commentList" >{commentList.user}</div>
                  <div className="col-2 video-check-right-commentList" >头像</div>
                  <div className="col-16 video-check-right-commentList" style={{textAlign:'left'}}>{commentList.time}</div>
                  <div className="col-4 video-check-right-commentList" ><Icon type="exclamation-circle-o" />&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="lock" /></div>
                </Row>
                <div className="video-check-right-commentDetail">
                  {commentList.comment}
                </div>
              </div>
              <div className="video-check-right-comment">
                <Row>
                  <div className="col-2 video-check-right-commentList" >{commentList.user}</div>
                  <div className="col-2 video-check-right-commentList" >头像</div>
                  <div className="col-16 video-check-right-commentList">{commentList.time}</div>
                  <div className="col-4 video-check-right-commentList" ><Icon type="exclamation-circle-o" />&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="lock" /></div>
                </Row>
                <div className="video-check-right-commentDetail">
                  {commentList.comment}
                </div>
              </div>
              <div className="video-check-right-comment">
                <Row>
                  <div className="col-2 video-check-right-commentList" >{commentList.user}</div>
                  <div className="col-2 video-check-right-commentList" >头像</div>
                  <div className="col-16 video-check-right-commentList">{commentList.time}</div>
                  <div className="col-4 video-check-right-commentList" ><Icon type="exclamation-circle-o" />&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="lock" /></div>
                </Row>
                <div className="video-check-right-commentDetail">
                  {commentList.comment}
                </div>
              </div>
              <div className="video-check-right-comment">
                <Row>
                  <div className="col-2 video-check-right-commentList" >{commentList.user}</div>
                  <div className="col-2 video-check-right-commentList" >头像</div>
                  <div className="col-16 video-check-right-commentList">{commentList.time}</div>
                  <div className="col-4 video-check-right-commentList" ><Icon type="exclamation-circle-o" />&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="lock" /></div>
                </Row>
                <div className="video-check-right-commentDetail">
                  {commentList.comment}
                </div>
              </div>
              <div className="video-check-right-comment">
                <Row>
                  <div className="col-2 video-check-right-commentList" >{commentList.user}</div>
                  <div className="col-2 video-check-right-commentList" >头像</div>
                  <div className="col-16 video-check-right-commentList">{commentList.time}</div>
                  <div className="col-4 video-check-right-commentList" ><Icon type="exclamation-circle-o" />&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="lock" /></div>
                </Row>
                <div className="video-check-right-commentDetail">
                  {commentList.comment}
                </div>
              </div>
            </div>
          </div>
        </Row>
      </div>
    )
  }
}


DetailArticle = Form.create()(DetailArticle);

export default DetailArticle;

