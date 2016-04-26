import React from 'react';
import { Link } from 'react-router';
import remove from 'lodash/remove';
import reqwest from 'reqwest';

import {
  Row,
  Col,
  Button,
  Icon,
  Menu,
  Form,
  Table,
  message,
  Input,
  Popover,
  Popconfirm,
  Select,
  Pagination,
  Spin
} from 'antd';
const Option = Select.Option;
//全局链接
let publicParamsJSON = sessionStorage.publicParams;
let publicParams = JSON.parse(publicParamsJSON);
let publicUrl = sessionStorage.publicUrl;

function getStats(array = [], key) {
  return array.length ? array.map((value) => value[key]) : [];
}

class Article extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
      selectedRowKeys: [],  // 这里配置默认勾选列
      selectedRows: [],
      record: {},
      spin: true,
      operate: false,
      total:1,
      recommend:false
    };
    this.handleClick = this.handleClick.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetch = this.fetch.bind(this);
    this.columns = this.columns.bind(this);
    this.getArticles = this.getArticles.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getArticleNum = this.getArticleNum.bind(this);
  }

  columns() {
    return([{
        title: 'ID',
        width:'10%',
        dataIndex: 'article_id'
      }, {
        title: '头图',
        width:'10%',
        dataIndex: 'image_url',
        render:(text) => <div><img src={text} style={{width:50}} /></div>
      }, {
        title: '标题',
        width:'15%',
        dataIndex: 'title'
      }, {
        title: '更新时间',
        width:'15%',
        dataIndex: 'updateTime'
      }, {
        title: '浏览点赞',
        width:'15%',
        dataIndex: 'like'
      }, {
        title: '分享收藏',
        width:'15%',
        dataIndex: 'collection'
      },{
        key: 'operation',
        className:'text-right',
        render: (text, record) =>
            <span>
              <a onClick={this.enterDetailArticle.bind(this,record.article_id,record)}>
                <Icon type="link"/>
                <span className="ant-divider" />
                <Icon type="message"/>11145
              </a>
              <span className="ant-divider" />
              <Popconfirm
                title="确定要删除这个篇文章吗？"
                onConfirm={this.deleteClick.bind(this, record.article_id)}
              >
                <a href="javascript:;">删除</a>
              </Popconfirm>
              <span className="ant-divider" />
              <a onClick={this.recommend.bind(this,record,record.article_id)}>{record.recommended == 1 ? '取消推荐' : '推荐'}</a>
            </span>
        }])
  }

  recommend(record,id) {
    if(record.recommended == 1) {
      publicParams.service = 'Admin.Unrecommend';
    }else {
      publicParams.service = 'Admin.Recommend';
    }
    publicParams.type = 1;
    publicParams.id = id;
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        this.getArticles();
        setTimeout(function () {
          if(record.recommended == 0) {
            message.success('推荐成功')
          }else{
            message.success('取消推荐成功')
          }
        },700)
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


  onSelectChange(selectedRowKeys) {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  handleClick() {
    const operateDelete = document.getElementsByClassName("fish-btn-black")[0];

    if (this.state.operate == false) {
      operateDelete.innerHTML = '<i class=" anticon anticon-cross"></i><span>&nbsp;&nbsp;</span><span>取消</span>';
      this.setState({
        operate: !this.state.operate,
        selectedRowKeys: []
      });
    } else {
      operateDelete.innerHTML = '<i class=" anticon anticon-setting"></i><span>操作</span>';
      this.setState({
        operate: !this.state.operate
      });
    }
  }

  //从数组中删除指定值元素
  removeByValue(arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        arr.splice(i, 1);
        break;
      }
    }
  }

  //删除多选
  handleClickDelete() {
    const {data, selectedRows} = this.state;
    if (selectedRows.length > 0) {
      //请求删除多选的表单
      publicParams.service = 'Admin.DeleteArticles';
      publicParams.article_ids = getStats(selectedRows,'article_id');
      console.log(getStats(selectedRows,'article_id'));
      reqwest({
        url: publicUrl,
        method: 'get',
        data: publicParams,
        type: 'jsonp',
        withCredentials: true,
        success: (result) => {
          const code = result.data.code;
          if(code == 0) {
            //前端界面删除多选
            for(let i=0; i<this.state.selectedRows.length; i++) {
              this.removeByValue(this.state.data,this.state.selectedRows[i]);
            }
            setTimeout(() => {
              this.setState({
                data:this.state.data,
                selectedRowKeys: [],
                selectedRows:[]
              });
              message.info('删除成功');
            }, 500);

          }else if(code == 1) {

            message.error('删除失败');
          }else if(code == 9) {

            message.info('没有权限，您的token失效!');
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

    } else {
      message.info("请至少选择一项")
    }
  }

  //进入文章细节
  enterDetailArticle(article_id,record) {
    //获取文章内容
    publicParams.service = 'Admin.GetArticle';
    publicParams.article_id = article_id;
    this.fetch();
    //获取评论列表
    publicParams.service = 'Admin.GetComments';
    publicParams.type = 1;
    publicParams.id = article_id;
    this.fetch();
    window.record = record;
    console.log(record);
  }

  //前后端请求删除
  deleteClick(article_id) {
    const {data} = this.state;
    publicParams.article_id = article_id;
    publicParams.service = 'Admin.DeleteArticle';

    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        if (result.data.code == 0) {
          console.log('success');
          this.getArticles();
          this.setState({
            data: data
          });
          message.success('您已删除该评论');
        }
      },
      error: (err) => {
        switch (err.status) {
          case 404:
            message.error('删除失败，请联系官方人员！');
            break;
          default:
            message.error('删除失败，请稍后重试！');
            break;
        }
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      console.log(values);
      this.fetch(values);
    });
  }

  fetch() {
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        if (result.data.articles) {
          this.setState({
            spin:false,
            data:result.data.articles
          });
          console.log(this.state.data);
        }
        if (result.data.num) {
          this.setState({
            spin:false,
            total:result.data.num
          });
        }
        //获取文章内容
        if(result.data.article) {
          window.article = result.data.article;
          window.location.href = '/#/detail-article';
        }
        //获取评论列表
        if(result.data.comments) {
          window.comments = result.data.comments;
          window.location.href = '/#/detail-article';
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

  onSelect(record, selected, selectedRows) {
    //this.state.data.splice(record.key-1,1);
    //if(selectedRows.length > 0) {
    //  this.setState({
    //    data : this.state.data
    //  })
    //}
    this.setState({
      selectedRows,
      record
    });
    console.log(selectedRows);
  }

  handleChange(current) {
    console.log(current);
    publicParams.page = current;
    this.getArticles()
  }

  getArticles() {
    publicParams.service = 'Admin.GetArticles';
    this.fetch();
  }

  getArticleNum() {
    publicParams.service = 'Admin.GetArticleNum';
    this.fetch();
  }

  componentWillMount() {
    this.getArticles();
    this.getArticleNum()
  }

  render() {
    const { selectedRowKeys, operate, spin } = this.state;
    const { getFieldProps } = this.props.form;
    const rowSelection = (!this.state.operate) ? null : {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelect.bind(this)
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <Spin spining={spin} className="ant-article-right">
        {/*头部*/}
        <header className="article-right-header">
          <Row>
            <Col span="2">
              <Button className="fish-btn-black" style={{width:'100%',height:'40px'}} onClick={this.handleClick}><Icon type="setting"/>操作</Button>
            </Col>
            <Col span="5" style={{whiteSpace:'nowarp',textAlign:'center'}}>
              <span style={{ marginLeft: 8 }}>
                {hasSelected ? `选择了 ${selectedRowKeys.length} 个对象` : ''}
              </span>
            </Col>
            <Col span="2" offset="7">
              <Link to="/new-article">
                <Button  className="fish-btn-black" style={{width:'100%',height:'40px'}}><Icon style={{marginLeft:'-5px'}} type="plus"/>添加文章</Button>
              </Link>
            </Col>
            {/*Group*/}
            <Form onSubmit={this.handleSubmit} form={this.props.form}>
              <Col span="2" offset="1">
                  <Select defaultValue="all" size="large">
                    <Option value="all">全部</Option>
                    <Option value="ID">ID</Option>
                    <Option value="nickName">昵称</Option>
                    <Option value="user">账号</Option>
                  </Select>
              </Col>
              <Col span="3">
                <Input {...getFieldProps('key')} style={{height:'40px'}} />
              </Col>
              <Col span="2">
                  <Button htmlType="submit" type="ghost" style={{width:'100%',height:'40px'}}>提交</Button>
              </Col>
            </Form>
          </Row>
          <Row>
            <Col span="2">
              <div
                onClick={this.handleClickDelete}
                className="operate-button-delete"
                style={operate?{visibility:'visible'}:{visibility:'hidden'}}>
                删除
              </div>
            </Col>
          </Row>
          <Row>
            <Col span="2">
              <div
                className="operate-button-delete"
                onClick={this.recommend}
                style={operate?{visibility:'visible'}:{visibility:'hidden'}}>
                推荐
              </div>
            </Col>
          </Row>
        </header>
        <section className="article-right-content article-right-content-single-table">
          <Table
            rowSelection={rowSelection}
            pagination = {{
                   defaultCurrent:1,
                   onChange:this.handleChange,
                   total:this.state.total}}
            columns={this.columns()}
            dataSource={this.state.data} />
          <br/>
        </section>
        <footer className="article-right-footer"/>
      </Spin>
    );
  }
}

Article = Form.create()(Article);
export default Article;
