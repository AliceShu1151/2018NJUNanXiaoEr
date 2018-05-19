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
		that.getUserOpenId();

		//岳翔：5-17 假装登录Bmob，因为上传文件需要登录……真心被这个坑了，文档也没给出说明……
		Bmob.User.login('123', '456');
	},

	getUserInfo: function (cb) {
		var that = this;
		if (this.globalData.userInfo) {
			typeof cb == "function" && cb(this.globalData.userInfo)
		} 
	},

	/**岳翔 5-19
	 * 之前用云函数成功造了个getOpenId的轮子，现在直接改为用官方接口，详细吐槽请看unUsed.js
	 */
	getUserOpenId: function(){
		let that = this;
		let Bmob = that.globalData.Bmob;
		wx.login({
			success: res => {
				Bmob.User.requestOpenId(res.code).then(res => {
					that.globalData.userOpenId = res.openid;
				});
			}
		});
	},
})
