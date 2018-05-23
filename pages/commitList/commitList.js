// pages/iBought/iBought.js
let app = getApp();
let Bmob = app.globalData.Bmob;
Page({
	/**
	 * 页面的初始数据
	 */
  data: {
    remind: '加载中',
    userInfo: {},
    saveHidden: true,
    goodBought: [],
    goodBoughtLength: 5,
  },

  clickTap: function (e) {
    let that = this;
    wx.navigateTo({
      url: "/pages/good_details/good_details?businessId=" + that.data.goodBought[e.currentTarget.id].objectId,
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
    let that = this;
    that.fetchGoods();
  },

  fetchGoods: function () {
    let that = this;
    let db = Bmob.Query("goods");
    db.equalTo("buyer", "==", app.globalData.userOpenId);
    db.equalTo("state", "==", 2);
    db.order("-updatedAt");
    db.find().then(res => {
      that.setData({ goodBoughtLength: res.length });
      let goodBought = res;
      that.setData({
        goodBought: goodBought,
        remind: ''
      });
    });
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