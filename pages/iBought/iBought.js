// pages/iBought/iBought.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    saveHidden: true,
    goodBought: [
      { businessId: 0, name: "QAQ", price: 200, img: '../../images/goods01.png', clickTimes: 5, state: 1, active: false },
      { businessId: 1, name: "QAQ", price: 200, img: '../../images/goods02.png', clickTimes: 6, state: 1, active: false }
    ],
    goodBoughtLength: 5,
  },

  clickTap: function (e) {
    wx.navigateTo({
      url: "/pages/good_details/good_details?businessId=" + this.data.soldOut[e.currentTarget.id].businessId
    });
  },

  toIndexPage: function () {
    wx.reLaunch({
      url: '../../pages/index/index'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goodBoughtLength: this.data.goodBought.length
    });
    console.log(this.data.goodBoughtLength)
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