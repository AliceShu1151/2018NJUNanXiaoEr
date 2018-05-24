let app = getApp()
let Bmob = app.globalData.Bmob;

Page({
	data: {
    username: '',
		userInfo: {},
		gender: '',
		showNickName: false,
	},

	onLoad: function(options) {
		let that = this;
    that.setData({
      username: options.seller
    })
		//console.log(seller);
		let db = Bmob.Query("_User");
		db.equalTo("username", "==", that.data.username);
		db.find().then(res => {
			console.log(res);
			that.setData({
				userInfo: res[0],
			});
      console.log(that.data.userInfo);
			if (that.data.userInfo.userRealName == '' || that.data.userInfo.userRealName === undefined) {
				that.setData({
					showNickName: true
				});
			}
		});
	},

  toCommitList: function () {
    let that = this;
    wx.navigateTo({
      url: '../../pages/commitList/commitList?aim=' + that.data.username
    });
  }
})