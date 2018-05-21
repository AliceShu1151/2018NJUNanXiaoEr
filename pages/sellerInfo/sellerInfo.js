let app = getApp()
let Bmob = app.globalData.Bmob;

Page({
	data: {
		userInfo: {},
		gender: '',
		showNickName: false,
		nick: ''
	},

	onLoad: function(options) {
		let that = this;
		let seller = options.seller;
		//console.log(seller);
		let db = Bmob.Query("_User");
		db.equalTo("username", "==", seller);
		db.find().then(res => {
			that.setData({
				userInfo: res[0],
				nickName: app.globalData.userInfo.nickName,
			});
			if (that.data.userInfo.userRealName == '' || that.data.userInfo.userRealName === undefined) {
				that.setData({
					showNickName: true
				});
			}
		});
	},
})