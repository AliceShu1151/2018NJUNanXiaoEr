
// pages/commitList/commitList.js
let app = getApp();
let Bmob = app.globalData.Bmob;

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		remind: '加载中',
		receiveCommitList: [],  //收到的评价
		// receiverList: {},       //对应的用户
		receiveGoods: [],       //对应的商品
		sendCommitList: [],     //发出的评价
		// senderList: {},         //对应的用户
		sendGoods: [],          //对应的商品
		length1: 0,
		length2: 0,
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

		let dbComments = Bmob.Query("comments");

		dbComments.equalTo("receiver", "==", aim);
		dbComments.order("-createdAt");
		dbComments.find().then(res => {
			console.log(res);
			receiveCommitList = res;
			that.setData({
				receiveCommitList: receiveCommitList,
				length1: res.length,
			});
			if (res.length == 0){
				return;
			}
			for (let item of receiveCommitList) {
				let now = new Date();
				while (new Date() - now < 100);
				let dbGoods = Bmob.Query("goods");
				dbGoods.get(item.goodsID).then(res => {
					console.log(res);
					let goodsInfo = res;
					goodsList1.push(goodsInfo);
					// console.log(goodsList1);
					that.setData({
						receiveGoods: goodsList1,
					});
				});
			}
		}).then(res => {
			that.setData({
				remind: ''
			});
		}).then(res => {
			dbComments.equalTo("sender", "==", aim);
			dbComments.order("-createdAt");
			dbComments.find().then(res => {
				console.log(res);
				sendCommitList = res;
				that.setData({
					sendCommitList: sendCommitList,
					length2: res.length,
				});
				if(res.length == 0){
					return;
				}
				for (let item of sendCommitList) {
					let now = new Date();
					while (new Date() - now < 100);
					let dbGoods = Bmob.Query("goods");
					dbGoods.get(item.goodsID).then(res => {
						 console.log(res);
						let goodsInfo = res;
						goodsList2.push(goodsInfo);
						// console.log(goodsList2);
						that.setData({
							sendGoods: goodsList2,
						});
					});
				}
			});
		});
		//console.log(that.data);
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

})