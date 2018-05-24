//login.js
//获取应用实例
let app = getApp();
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
    let that = this;
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
    //头像 & 性别设置
    let db = Bmob.Query("_User");
    db.get(app.globalData.userObjectId).then(res => {
      console.log(res)
      res.set("avatarUrl", app.globalData.userInfo.avatarUrl);
      switch (app.globalData.userInfo.gender) {
        case 1: res.set("gender", "♂"); break;
        case 2: res.set("gender", "♀"); break;
        case 0: res.set("gender", "未知"); break;
      };
      res.set("nickName", app.globalData.userInfo.nickName);
      res.save().then(res => {
        console.log(res);
      });
    });
  },

	/**
	 * 对话框确认按钮点击事件
	 */
  onConfirm: function (e) {
    this.hideModal();
  },

  onReady: function () {
    let that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      let angle = -(res.x * 30).toFixed(1);
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