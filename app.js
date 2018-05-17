//app.js
App({
	globalData: {
		userInfo: null,
		userOpenId: null,
		Bmob: null,
	},

	onLaunch: function () {
		let that = this;
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs);

		//初始化数据库并存入全局变量
		let Bmob = require("utils/hydrogen-js-sdk-master/dist/Bmob-1.3.0.min.js");
		Bmob.initialize("e663c7332cbc5d0c48349e5609048c99", "e24aad5768f2b86e7a86b6f5dea6bc65");
		that.globalData.Bmob = Bmob;

		//岳翔：5-16  获取userOpenId并检查是否db内是否已存在userOpenId
		that.getuserOpenId();

		//岳翔：5-17 假装登录Bmob，因为上传文件需要登录……真心被这个坑了，文档也没给出说明……
		Bmob.User.login('123', '456');
	},

	getUserInfo: function (cb) {
		var that = this;
		if (this.globalData.userInfo) {
			typeof cb == "function" && cb(this.globalData.userInfo)
		} else {
			//调用登陆接口
			wx.login({
				success: function () {

				}
			})
		}

	},

	getuserOpenId() {
		let that = this;
		wx.login({
			/**岳翔 5-15
			 * userOpenId成功获取
			 * 获取后会存入app.globalData.userOpenId
			 */
			success: res => {
				let appID = "wx210839d33ea2e4dc";
				let appSecret = "307e15cfe15abbc9cd6321adbf73b205";
				let code = res.code;
				//let url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appID + "&secret=" + appSecret + "&js_code=" + code + "&grant_type=authorization_code";
				let url = 'https://cloud.bmob.cn/c415a33732ba7759/getOpenID?appid=' + appID + '&appsecret=' + appSecret + '&code=' + code;
				//console.log(url);
				//console.log(Bmob);
				wx.request({
					//format: http://cloud.bmob.cn/{Secret Key}/{云函数名}?{参数名}={值}&{参数名}={值}…
					url: url,
					success: res => {
						//let that = this;
						that.globalData.userOpenId = res.data.openid;
						//console.log(that.globalData.userOpenId);
						let Bmob = that.globalData.Bmob;
						const db = Bmob.Query("users");
						let userOpenId = that.globalData.userOpenId;
						//console.log(userOpenId);
						db.equalTo("userOpenId", "==", userOpenId);
						db.find().then(res => {
							if (res.length == 0) {
								res.set("userOpenId", userOpenId);
								res.save();
							}
						});
					},
				})
			}
		});

	},


})