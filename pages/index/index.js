//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    //数据初始化定义
    remind: '加载中',
    goods: [],
    noticeList: {
      dataList: ['嘻嘻嘻', '嘤嘤嘤', '嘿嘿嘿']
    },
    categories: [
      { id: 0, name: '全部' },
      { id: 1, name: '化妆品' },
      { id: 2, name: '服饰装扮' },
      { id: 3, name: '食品饮料' },
      { id: 4, name: '演出门票' },
      { id: 5, name: '数码电子' },
      { id: 6, name: '其他' }
    ],
    indicatorDots: true,
    loadingHidden: false, // loading
    userInfo: {},
    swiperCurrent: 0,
    selectCurrent: 0,
    activeCategoryId: 0,
    scrollTop: "0",
    loadingMoreHidden: true,
    searchInput: '',
  },

  //页面加载时的初始化操作
  onLoad: function () {
    //console.log(app.globalData.userInfo);
    var that = this;
    //加载全部商品
    that.getGoodsList(0);
    //实际开发时为轮播图获取接口
    that.setData({
      banners: [
        { businessId: 0, picUrl: '../../images/goods01.png' },
        { businessId: 1, picUrl: '../../images/goods02.png' }
      ]
    })
  },

  //页面初次渲染完成后的操作
  onReady: function () {
    var that = this;
    //渲染完毕，关闭加载动画
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
  },

  //监听轮播图变换
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  //点击轮播图事件监听，跳转至商品详情页面
  tapBanner: function (e) {
    wx.navigateTo({
      url: "/pages/good_details/good_details?businessId=" + e.currentTarget.id
    })
  },

  //获取用户在搜索框输入的内容
  listenerSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })
    //console.log(this.data.searchInput);
  },

  //搜索函数，需要与服务器交互，待实现
  toSearch: function () {
    //获取搜索结果

    wx.navigateTo({
      url: "/pages/search_results/search_results?resultsList=" // + 搜索结果
    })
  },

  //商品种类栏点击事件监听，更新页面下部的商品信息
  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(this.data.activeCategoryId);
  },

  //点击页面下部商品列表事件监听，跳转至商品详情页面
  toDetailsTap: function (e) {
    //console.log(e.currentTarget.id);
    wx.navigateTo({
      url: "/pages/good_details/good_details?businessId=" + e.currentTarget.id
    })
  },

  //商品加载
  getGoodsList: function (categoryId) {
    if (categoryId == 0) {
      //demo，当连接服务器时且种类为“全部”时，从数据库获取种类为“全部”的商品列表
      this.setData({
        goods: [
          { businessId: 0, pic: '../../images/goods01.png', name: '香水1', price: 200 },
          { businessId: 1, pic: '../../images/goods02.png', name: '香水2', price: 300 }
        ]
      })
    }
    else if (categoryId == 1) {
      //demo，当连接服务器时且种类为“化妆品”时，从数据库获取种类为“全部”的商品列表
      this.setData({
        goods: [
          { businessId: 1, pic: '../../images/goods02.png', name: '香水2', price: 300 }
        ]
      })
    }
    else if (categoryId == 2) {
      //服饰装扮
    }
    else if (categoryId == 3) {
      //食品饮料
    }
    else if (categoryId == 4) {
      //演出门票
    }
    else if (categoryId == 5) {
      //数码电子
    }
    else if (categoryId == 6) {
      //其他
    }
  }
})