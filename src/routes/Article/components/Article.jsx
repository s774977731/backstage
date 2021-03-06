import React from 'react';
import { Link } from 'react-router';
import remove from 'lodash/remove';
import reqwest from 'reqwest';
const moment = require('moment');
moment.locale('zh-cn');

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
      total:1,
      recommend:false,
      search:'title'
    };
    this.onSelectChange = this.onSelectChange.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetch = this.fetch.bind(this);
    this.columns = this.columns.bind(this);
    this.getArticles = this.getArticles.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getArticleNum = this.getArticleNum.bind(this);
    this.changeSearch = this.changeSearch.bind(this);
    this.onSelectAll = this.onSelectAll.bind(this);
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
        render:(text) => <div><img src={text} style={{width:30}} /></div>
      }, {
        title: '标题',
        width:'15%',
        dataIndex: 'title'
      }, {
        title: '更新时间',
        width:'15%',
        dataIndex: 'updated_at',
        render:(text) => moment.unix(text).format('YYYY-MM-DD')
      }, {
        title: '浏览点赞',
        width:'15%',
        render:(text,record) =><p href="javascript:;">
          {record.view_num}浏览|{record.like_num}点赞
        </p>
      }, {
        title: '分享收藏',
        width:'15%',
        render:(text,record) =><p>
          {record.share_num}分享|{record.collect_num}收藏
        </p>
      },{
        key: 'operation',
        className:'text-right',
        render: (text, record) =>
            <span>
              <a onClick={this.enterDetailArticle.bind(this,record.article_id,record)}>
                <Icon type="message"/>{record.comment_num}
              </a>
              <span className="ant-divider" />
              <a onClick={this.modifyArticle.bind(this,record.article_id,record)}>修改</a>
              <span className="ant-divider" />
              <Popconfirm
                title="确定要删除这个篇文章吗？"
                onConfirm={this.deleteClick.bind(this, record.article_id)}
              >
                <a href="javascript:;">删除</a>
              </Popconfirm>
              <span className="ant-divider" />
              <a onClick={this.recommend.bind(this,record,record.article_id)}>{record.recommended == 1 ? '取消' : '推荐'}</a>
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
            if(result.data.code == 0) {
              message.success('推荐成功')
            }
            if(result.data.code == 2) {
              message.info('最多推荐4个，请先取消其他推荐')
            }
          }else{
            message.success('取消推荐成功')
          }
        },700)
      },
      error: (err) => {
        // console.log(err);
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
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  //删除多选
  handleClickDelete() {
    const {data, selectedRows} = this.state;
    if (selectedRows.length > 0) {
      //请求删除多选的表单
      publicParams.service = 'Admin.DeleteArticles';
      publicParams.article_ids = getStats(selectedRows,'article_id');
      // console.log(getStats(selectedRows,'article_id'));
      reqwest({
        url: publicUrl,
        method: 'get',
        data: publicParams,
        type: 'jsonp',
        withCredentials: true,
        success: (result) => {
          const code = result.data.code;
          if(code == 0) {
            this.getArticles();
            this.setState({
              selectedRowKeys: [],
              selectedRows:[]
            });
            message.info('删除成功');

          }else if(code == 1) {

            message.error('删除失败');
          }else if(code == 9) {

            message.info('没有权限，您的token失效!');
          }
        },
        error: (err) => {
          // console.log(err);
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
    // console.log(record);
  }

  modifyArticle(article_id,record) {
    //获取文章内容
    publicParams.service = 'Admin.GetArticle';
    publicParams.article_id = article_id;
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        if(result.data.article) {
          window.article = result.data.article;
        }
      }
    });
    //获取评论列表
    publicParams.service = 'Admin.GetComments';
    publicParams.type = 1;
    publicParams.id = article_id;
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        if(result.data.comments) {
          window.comments = result.data.comments;
          setTimeout(function () {
            window.location.href = '#/article/new-article';
          },400)
        }
      }
    });
    window.record = record;
    // console.log(record);
  }

  //前后端请求删除
  deleteClick(article_id) {
    const { data } = this.state;
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
          // console.log('success');
          this.getArticles();
          this.setState({
            data: data
          });
          message.success('删除文章成功');
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

  changeSearch(value) {
    // console.log(value);
    this.setState({
      search:value
    })
  }

  handleSubmit(e) {
    const { search } = this.state;
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        // console.log('Errors in form!!!');
        return;
      }
      // console.log(values.key);
      if(search == 'title') {
        publicParams.article_title = values.key;
        publicParams.service = 'Admin.SearchArticleByTitle';
      }else {
        publicParams.article_id = values.key;
        publicParams.service = 'Admin.SearchArticleById';
      }
      reqwest({
        url: publicUrl,
        method: 'get',
        data: publicParams,
        type: 'jsonp',
        withCredentials: true,
        success: (result) => {
            this.setState({
              data:result.data.articles,
              total:result.data.total
            });
          // console.log(result.data);
        }
      });
    });
  }

  enterAddArticle() {
    window.article = false;
    window.location.href = '#/article/new-article'
  }

  fetch() {
    reqwest({
      url: publicUrl,
      method: 'get',
      data: publicParams,
      type: 'jsonp',
      withCredentials: true,
      success: (result) => {
        this.setState({spin:false})
        if (result.data.articles) {
          this.setState({
            data:result.data.articles
          });
          // console.log(this.state.data);
        }
        if (result.data.num) {
          this.setState({
            total:result.data.num
          });
        }
        //获取文章内容
        if(result.data.article) {
          window.article = result.data.article;
          window.location.href = '#/article/detail-article';
        }
        //获取评论列表
        if(result.data.comments) {
          window.comments = result.data.comments;
          window.location.href = '#/article/detail-article';
        }
      },
      error: (err) => {
        // console.log(err);
        this.setState({ spin: false });
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
    // console.log(selectedRows);
  }

  onSelectAll(selected, selectedRows, changeRows) {
    this.setState({
      selectedRows
    });
  }

  handleChange(current) {
    // console.log(current);
    publicParams.page = current;
    window.articlePage = current;
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

  componentWillUnmount() {
    sessionStorage.record = JSON.stringify(window.record);
    sessionStorage.article = JSON.stringify(window.article);
    sessionStorage.comments = JSON.stringify(window.comments);
  }

  render() {
    const { selectedRowKeys, spin } = this.state;
    const { getFieldProps } = this.props.form;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelect: this.onSelect.bind(this),
      onSelectAll:this.onSelectAll.bind(this),
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <Spin spining={spin} className="ant-article-right">
        {/*头部*/}
        <header className="article-right-header">
          <Row>
            <Col span="1">
              <div className="Icon-demo-div" onClick={this.handleClickDelete}><Icon className="Icon-demo" type="delete"/></div>
            </Col>
            <Col span="5" style={{whiteSpace:'nowarp',textAlign:'center'}}>
              <span style={{ marginLeft: 8 }}>
                {hasSelected ? `选择了 ${selectedRowKeys.length} 个对象` : ''}
              </span>
            </Col>
            <Col span="2" offset="8">
                <Button onClick={this.enterAddArticle} className="fish-btn-black" style={{width:'100%',height:'40px'}}><Icon style={{marginLeft:'-5px'}} type="plus"/>添加文章</Button>
            </Col>
            {/*Group*/}
            <Form onSubmit={this.handleSubmit} form={this.props.form}>
              <Col span="2" offset="1">
                  <Select onChange={this.changeSearch} defaultValue="title" size="large">
                    <Option value="title">标题</Option>
                    <Option value="id">ID</Option>
                  </Select>
              </Col>
              <Col span="3">
                <Input {...getFieldProps('key')} style={{height:'40px'}} />
              </Col>
              <Col span="2">
                  <Button htmlType="submit" type="ghost" style={{width:'100%',height:'40px'}}>搜索</Button>
              </Col>
            </Form>
          </Row>
        </header>
        <section className="article-right-content" style={{marginTop:'25px'}}>
          <Table
            rowKey = {record => record.article_id}
            rowSelection={rowSelection}
            pagination = {{
                   current:window.articlePage ? window.articlePage : 1,
                   onChange:this.handleChange,
                   total:this.state.total
                   }}
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
