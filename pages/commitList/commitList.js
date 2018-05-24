
// pages/commitList/commitList.js
let app = getApp();
let Bmob = app.globalData.Bmob;

Page({
	/**
	 * 页面的初始数据
	 */
  data: {
    remind: '加载中',
    receiveCommitList: {},  //收到的评价
    // receiverList: {},       //对应的用户
    receiveGoods: {},       //对应的商品
    sendCommitList: {},     //发出的评价
    // senderList: {},         //对应的用户
    sendGoods: {},          //对应的商品
    length1: -1,
    length2: -1,
    currentTab: 0,
    tabCont: [{ "title": "收到的评价", "index": 0 }, { "title": "发出的评价", "index": 1 }]
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: function (options) {
    let that = this;
    let aim = options.aim;
    let goodsList1 = new Array();
    let goodsList2 = new Array();
    let receiverList = new Array();
    let senderList = new Array();
    let receiveCommitList = that.data.receiveCommitList;
    let sendCommitList = that.data.receiveCommitList;
    let db = Bmob.Query("comments");
    db.equalTo("receiver", "==", aim);
    db.order("-createdAt");
    db.find().then(res => {
      receiveCommitList = res;
      that.setData({
        receiveCommitList: receiveCommitList,
      });
      for (let index in receiveCommitList) {
        // db = Bmob.Query("_User");
        // db.equalTo("username", "==", receiveCommitList[index].sender);
        // db.find().then(res => {
        //   let senderInfo = res[0];
        //   receiverList.push(senderInfo);
        //   // console.log(receiverList);
        //   that.setData({
        //     receiverList: receiverList,
        //     length: index
        //   });
        // });

        db = Bmob.Query("goods");
        db.equalTo("objectId", "==", receiveCommitList[index].goodsID);
        db.find().then(res => {
          console.log(res);
          let goodsInfo = res[0];
          goodsList1.push(goodsInfo);
          // console.log(goodsList1);
          that.setData({
            receiveGoods: goodsList1,
            length1: index
          });
        });

      }

    });

    db = Bmob.Query("comments");
    db.equalTo("sender", "==", aim);
    db.order("-createdAt");
    db.find().then(res => {
      sendCommitList = res;
      that.setData({
        sendCommitList: sendCommitList,
      });
      for (let index in sendCommitList) {
        // db = Bmob.Query("_User");
        // db.equalTo("username", "==", sendCommitList[index].sender);
        // db.find().then(res => {
        //   let senderInfo = res[0];
        //   senderList.push(senderInfo);
        //   // console.log(senderList);
        //   that.setData({
        //     senderList: senderList,
        //     length: index
        //   });
        // });

        db = Bmob.Query("goods");
        db.equalTo("objectId", "==", sendCommitList[index].goodsID);
        db.find().then(res => {
          // console.log(res);
          let goodsInfo = res[0];
          goodsList2.push(goodsInfo);
          // console.log(goodsList2);
          that.setData({
            sendGoods: goodsList2,
            length2: index
          });
        });
      }
    });
    console.log(that.data);
    that.setData({
      remind: ''
    });
  },

  GetCurrentTab: function (e) {
    console.log(e.detail.current);
    var that = this;
    this.setData({
      currentTab: e.detail.current
    });
    // console.log("11111"+this.data.currentTab);
  },
  swithNav: function (e) {
    var that = this;
    that.setData({
      currentTab: e.target.dataset.current
    });
  },

  fetchGoods: function () {
    let that = this;
    let db = Bmob.Query("goods");
    db.equalTo("buyer", "==", app.globalData.userOpenId);
    db.equalTo("state", "==", 2);
    db.order("-updatedAt");
    db.find().then(res => {
      that.setData({ goodBoughtLength: res.length });
      let goodBought = res;
      that.setData({
        goodBought: goodBought,
        remind: ''
      });
    });
  },
  clickTap1: function (e) {
    let that = this;
    console.log(e);
    wx.navigateTo({
      url: "/pages/good_details/good_details?businessId=" + that.data.receiveGoods[e.currentTarget.id].objectId,
    });
  },
  clickTap2: function (e) {
    let that = this;
    wx.navigateTo({
      url: "/pages/good_details/good_details?businessId=" + that.data.sendGoods[e.currentTarget.id].objectId,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})