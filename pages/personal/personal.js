let app = getApp()
let Bmob = app.globalData.Bmob;

Page({
	data: {
		remind: '加载中',
		userInfo: {}
	},

	onReady() {
		let that = this;
		let db = Bmob.Query("_User");
		db.get(app.globalData.userObjectId).then(res => {
			that.setData({
				userInfo: app.globalData.userInfo,
				"userInfo.college": res.college,
				"userInfo.entryYear": res.entryYear,
			});
		})
		setTimeout(function () {
			that.setData({
				remind: ''
			});
		}, 1000);
	},

  toCommit:function() {
    wx.navigateTo({
      url: '../../pages/commitList/commitList?aim='  +Bmob.User.current().username
    })
  },

	toEdit: function () {
		wx.navigateTo({
			url: '../../pages/editUserInfo/editUserInfo',
		})
	}
})