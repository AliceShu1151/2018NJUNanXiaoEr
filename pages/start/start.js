//login.js
//获取应用实例
var app = getApp();
let Bmob = app.globalData.Bmob;
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

		//头像设置
		let db = Bmob.Query("users");
		db.equalTo("userOpenId", "==", app.globalData.userOpenId);
		db.find().then(res => {
			//console.log(app.globalData.userInfo.avatarUrl);
			res.set("avatarUrl", app.globalData.userInfo.avatarUrl);
			res.saveAll();
		})
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