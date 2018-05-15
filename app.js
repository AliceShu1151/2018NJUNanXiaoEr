//app.js
App({
	onLaunch: function () {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs);

		wx.login({
			/**岳翔 5-15
			 * openid成功获取
			 * 获取后会存入app.globalData.openid
			 */
			success: res => {
				let appID = "wx210839d33ea2e4dc";
				let appSecret = "307e15cfe15abbc9cd6321adbf73b205";
				let code = res.code;
				//let url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appID + "&secret=" + appSecret + "&js_code=" + code + "&grant_type=authorization_code";
				let Bmob = require("utils/hydrogen-js-sdk-master/dist/Bmob-1.3.0.min.js");
				Bmob.initialize("e663c7332cbc5d0c48349e5609048c99", "e24aad5768f2b86e7a86b6f5dea6bc65");
				let url = 'https://cloud.bmob.cn/c415a33732ba7759/getOpenID?appid=' + appID + '&appsecret=' + appSecret + '&code=' + code;
				//console.log(url);
				//console.log(Bmob);
				wx.request({
					//format: http://cloud.bmob.cn/{Secret Key}/{云函数名}?{参数名}={值}&{参数名}={值}…
					url: url,
					success: res => {
						let that = this;
						//console.log(res);
						that.globalData.openid = res.data.openid;
					},
				})
			}
		})

		
		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

				}
			}
		})
	},
	getUserInfo: function (cb) {
		var that = this
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
	globalData: {
		userInfo: null,
		openid: null,
		sessionKey: null,
	}
})