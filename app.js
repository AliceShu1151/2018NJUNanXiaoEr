//app.js
App({
	globalData: {
		userInfo: null,
		userOpenId: null,
		Bmob: null,
		userObjectId: null,
	},

	onLaunch: function () {
		let that = this;
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs);

		//初始化数据库并存入全局变量
		let Bmob = require("utils/hydrogen-js-sdk-master/dist/Bmob-1.1.1.min.js");
		Bmob.initialize("e663c7332cbc5d0c48349e5609048c99", "e24aad5768f2b86e7a86b6f5dea6bc65");
		that.globalData.Bmob = Bmob;

		//岳翔 5-19：获取openId并进行bmob的登录或注册
		that.getUserOpenId();
	},


	//岳翔 5-19：之前用云函数成功造了个getOpenId的轮子，现在直接改为用官方接口，详细吐槽请看unUsed.js
	getUserOpenId: function(){
		let that = this;
		let Bmob = that.globalData.Bmob;
		wx.login({
			success: res => {
				Bmob.User.requestOpenId(res.code).then(res => {
					that.globalData.userOpenId = res.openid;
					that.bmobLogIn();
				});
			}
		});
	},

	//岳翔：5-19 登录或注册Bmob用户
	bmobLogIn: function() {	
		let that = this;
		let Bmob = that.globalData.Bmob;
		let db = Bmob.Query("_User");
		db.equalTo("username", "==", that.globalData.userOpenId);
		db.find().then(res => {
			if (res.length == 0) {
				console.log({ openId: that.globalData.userOpenId, status: "register" });
				return Bmob.User.register({
					username: that.globalData.userOpenId,
					password: "123",
				});
			}
		}).then(res => {
			//console.log({ openId: that.globalData.userOpenId, status: "log in" });
			return Bmob.User.login(that.globalData.userOpenId, "123")
		}).then(res => {
			//console.log(res);
			that.globalData.userObjectId = res.objectId;
		});
	}
})
