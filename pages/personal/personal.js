let app = getApp()
let Bmob = app.globalData.Bmob;

Page({
	data: {
		remind: '加载中',
		userInfo: {}
	},

	onReady() {
		let that = this;
		that.setData({
			userInfo: app.globalData.userInfo,
			"userInfo.college": Bmob.User.current().college,
			"userInfo.entryYear": Bmob.User.current().entryYear,
		});
		setTimeout(function () {
			that.setData({
				remind: ''
			});
		}, 1000);
	},

	toEdit: function () {
		wx.navigateTo({
			url: '../../pages/editUserInfo/editUserInfo',
		})
	}
})