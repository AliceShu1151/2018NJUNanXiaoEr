var app = getApp()

Page({
	data: {
		remind: '加载中',
		userInfo: {}
	},

	onReady() {
		var that = this;
		that.setData({
			userInfo: app.globalData.userInfo
		});
		setTimeout(function () {
			that.setData({
				remind: ''
			});
		}, 1000);
	},

	toEdit: function() {
    wx.navigateTo({
      url: '../../pages/editUserInfo/editUserInfo',
    })
  }
})