// pages/mySoldOut/mySoldOut.js
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
		soldOut: [],
		soldOutLength: 5,
	},

	toIssuePage: function () {
		wx.reLaunch({
			url: '../../pages/issue/issue',
		});
	},

	clickTap: function (e) {
		let that = this;
		wx.navigateTo({
			url: "/pages/good_details/good_details?businessId=" + this.data.soldOut[e.currentTarget.id].objectId,
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		let that = this;
		that.fetchGoods();
	},

	fetchGoods: function () {
		let that = this;
		let db = Bmob.Query("goods");
		db.equalTo("seller", "==", app.globalData.userOpenId);
		db.equalTo("state", "==", 2);
		db.order("-updatedAt");
		db.find().then(res => {
			that.setData({ soldOutLength: res.length });
			let soldOut = res;
			that.setData({
				soldOut: soldOut,
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