//login.js
//获取应用实例
var app = getApp();
Page({
	data: {
		showModal: false,
		remind: '加载中',
		angle: 0,
		userInfo: {}
	},
	goToIndex: function () {
		wx.switchTab({
			url: '/pages/index/index',
		});
	},
	onLoad: function () {
		var that = this;
		wx.setNavigationBarTitle({
			title: wx.getStorageSync('mallName')
		});
	},
	onShow: function () {

	},
	showDialogBtn: function () {
		this.setData({
			showModal: true
		})
	},
	/**
	* 弹出框蒙层截断touchmove事件
	*/
	preventTouchMove: function () {
	},
	/**
	 * 隐藏模态对话框
	 */
	hideModal: function () {
		this.setData({
			showModal: false
		});
	},
	/**
	 * 对话框取消按钮点击事件
	 */
	onCancel: function () {
		this.hideModal();
	},
	//获取用户信息
	userInfoHandler: function (e) {
		app.globalData.userInfo = e.detail.userInfo;
		//console.log(app.globalData.userInfo);

		/** 岳翔：5-15
		 * e.detail 返回getUserInfo结果
		 * e.detail.encryptedData包含全部敏感信息
		 * 用户的唯一标识符unionid就包含在内
		 * 通过调用微信提供的aes解密代码破解明文
		 */
		if(app.globalData.isInSession){
			return; //在session期则直接返回
		}
		let appID = "wx210839d33ea2e4dc";
		let appSecret = "307e15cfe15abbc9cd6321adbf73b205";
		let encryptedData = e.detail.encryptedData;
	},

	/**
	 * 对话框确认按钮点击事件
	 */
	onConfirm: function (e) {
		this.hideModal();
	},
	onReady: function () {
		var that = this;
		setTimeout(function () {
			that.setData({
				remind: ''
			});
		}, 1000);
		wx.onAccelerometerChange(function (res) {
			var angle = -(res.x * 30).toFixed(1);
			if (angle > 14) { angle = 14; }
			else if (angle < -14) { angle = -14; }
			if (that.data.angle !== angle) {
				that.setData({
					angle: angle
				});
			}
		});
		that.showDialogBtn();
	}
});