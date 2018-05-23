let app = getApp()
let Bmob = app.globalData.Bmob;

Page({
	data: {
		userInfo: {},
		gender: '',
		showNickName: false,
	},

	onLoad: function(options) {
		let that = this;
		let seller = options.seller;
		//console.log(seller);
		let db = Bmob.Query("_User");
		db.equalTo("username", "==", seller);
		db.find().then(res => {
			console.log(res);
			that.setData({
				userInfo: res[0],
			});
			if (that.data.userInfo.userRealName == '' || that.data.userInfo.userRealName === undefined) {
				that.setData({
					showNickName: true
				});
			}
		});
	},

  toCommitList: function() {
    wx.navigateTo({
      url: '../../pages/commitList/commitList'
    });
  }
})