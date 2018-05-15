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

	aboutUs: function () {
		wx.showModal({
			title: '关于我们',
			content: '本系统基于开源小程序商城系统 https://github.com/EastWorld/wechat-app-mall 搭建，祝大家使用愉快！',
			showCancel: false
		})
	}
})