//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    remind: '加载中',
    noticeList:{
      dataList: ['嘻嘻嘻', '嘤嘤嘤', '嘿嘿嘿']
    },
    categories: [
      {id: 0, name: '全部'},
      {id: 1, name: '美妆'},
      {id: 2, name: '服饰'},
      {id: 3, name: '食品'},
      {id: 4, name: '门票'},
      {id: 5, name: '其他'}
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false, // loading
    userInfo: {},
    swiperCurrent: 0,
    selectCurrent: 0,
    categories: [],
    activeCategoryId: 0,
    goods: [],
    scrollTop: "0",
    loadingMoreHidden: true,

    hasNoCoupons: true,
    coupons: [],
    searchInput: '',
  },

  onReady: function() {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
  },

  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(this.data.activeCategoryId);
  }
})