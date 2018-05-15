// pages/myCollection/myCollection.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    allSelected: false,
    saveHidden: true,
    userInfo: {},

    /*
    myCollection是收藏夹商品信息的基本形式
    可将从数据库获取的商品信息放在baseInfo里
    active属性代表着是否被选中
    被选中则该商品会被勾选
     */
    myCollection: [
      {baseInfo:{ index: 0, name: "QAQ", price: 200, pic: '../../images/goods01.png', clickTimes: 5}, active: false },
      {baseInfo:{ index: 1, name: "QAQ", price: 200, pic: '../../images/goods02.png', clickTimes: 6 }, active: true}
    ],

    totalPrice: ''
  },

  /*下面两个函数用于编辑收藏列表*/
  editTap: function() {
    this.setData({
      saveHidden: false
    })
  },
  saveTap: function() {
    this.setData({
      saveHidden: true
    })
  },

  //计算收藏商品总价，页面加载时调用
  caculateTotalPrice: function() {
    var that = this;
    var total = 0;
    for(var i = 0; i < that.data.myCollection.length; i++){
      if (that.data.myCollection[i].active){
        total = total + that.data.myCollection[i].baseInfo.price;
      }
    }
    that.setData({
      totalPrice: total
    });
  },

  //单独选择
  selectTap: function(e) {
    //console.log(e.currentTarget.id);
    var that = this;
    var tmpCollection = that.data.myCollection;
    //console.log(tmpCollection[0].active);
    if (!tmpCollection[e.currentTarget.id].active){
      tmpCollection[e.currentTarget.id].active = true; 
    }
    else{
      tmpCollection[e.currentTarget.id].active = false; 
    }
    that.setData({
      myCollection: tmpCollection
    });
    that.caculateTotalPrice();
  },

  //全选
  bindAllSelect: function() {
    var that = this;
    if(!that.data.allSelected){
      //全选
      that.setData({
        allSelected: true
      });
      var tmpCollection = that.data.myCollection;
      for(var i = 0; i < that.data.myCollection.length; i++){
        tmpCollection[i].active = true;
      }
      that.setData({
        myCollection: tmpCollection
      });
      that.caculateTotalPrice();
    }
    else{
      //取消全选
      that.setData({
        allSelected: false
      });
      var tmpCollection = that.data.myCollection;
      for (var i = 0; i < that.data.myCollection.length; i++) {
        tmpCollection[i].active = false;
      }
      that.setData({
        myCollection: tmpCollection
      });
      that.caculateTotalPrice();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    });

    //计算收藏商品总价
    that.caculateTotalPrice();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})