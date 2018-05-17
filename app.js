//app.js
App({
	globalData: {
		hasLogged: false,
		userInfo: null,
		userOpenId: null,
		sessionKey: null,
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
						/** 岳翔 5-16:
						 * 小程序的request和bmob都是异步
						 * 也即是说遇到request后程序不会等待request执行完再去执行外层代码
						 * 解决方法：①放在success回调函数中 ②使用promise库（暂时先不用）
						 */
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
								db.set("userOpenId", userOpenId);
								db.save();
							}
							else{
								that.globalData.hasLogged = true;
							}
						});
					},
				})
			}
		});

	},


})