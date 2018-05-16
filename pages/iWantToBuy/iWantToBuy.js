// pages/iWantToBuy/iWantToBuy.js
var app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		allSelected: false,
		noSelect: true,
		saveHidden: true,
		iWantToBuy: [
			//{ baseInfo: { businessId: 0, name: "QAQ", price: 200, pic: '../../images/goods01.png', clickTimes: 5, sbWantsToBuy: false }, active: false },
			//{ baseInfo: { businessId: 1, name: "QAQ", price: 200, pic: '../../images/goods02.png', clickTimes: 6, sbWantsToBuy: false }, active: false }
		],
		iWantToBuyLength: 0,
		totalPrice: '',
		userInfo: {}
	},

	/*下面两个函数用于编辑收藏列表*/
	editTap: function () {
		this.setData({
			saveHidden: false
		})
	},
	saveTap: function () {
		this.setData({
			saveHidden: true
		})
	},

	//计算收藏商品总价，页面加载时调用
	caculateTotalPrice: function () {
		var that = this;
		var total = 0;
		for (var i = 0; i < that.data.iWantToBuy.length; i++) {
			if (that.data.iWantToBuy[i].active) {
				total = total + that.data.iWantToBuy[i].price;
			}
		}
		that.setData({
			totalPrice: total,
		});
	},

	//判断有无被选中的商品对象
	isNoSelect: function () {
		var that = this;
		for (var i = 0; i < that.data.iWantToBuy.length; i++) {
			if (that.data.iWantToBuy[i].active) {
				that.setData({
					noSelect: false
				});
				return;
			}
		}
		that.setData({
			noSelect: true
		});
	},

	//判断是否为全选状态
	isAllSelected: function () {
		for (var i = 0; i < this.data.iWantToBuy.length; i++) {
			if (!this.data.iWantToBuy[i].active) {
				this.setData({
					allSelected: false
				});
				return;
			}
		}
		this.setData({
			allSelected: true
		});
		//console.log(this.data.allSelected);
	},

	//单独选择
	selectTap: function (e) {
		//console.log(e.currentTarget.id);
		var that = this;
		var tmpIWantToBuy = that.data.iWantToBuy;
		//console.log(tmpCollection[0].active);
		if (!tmpIWantToBuy[e.currentTarget.id].active) {
			tmpIWantToBuy[e.currentTarget.id].active = true;
		}
		else {
			tmpIWantToBuy[e.currentTarget.id].active = false;
		}
		that.setData({
			iWantToBuy: tmpIWantToBuy
		});
		that.caculateTotalPrice();
		//console.log(that.data.iWantToBuy);
		that.isNoSelect();
		that.isAllSelected();
	},

	//全选
	bindAllSelect: function () {
		var that = this;
		if (!that.data.allSelected) {
			//全选
			that.setData({
				allSelected: true
			});
			var tmpIWantToBuy = that.data.iWantToBuy;
			for (var i = 0; i < that.data.iWantToBuy.length; i++) {
				tmpIWantToBuy[i].active = true;
			}
			that.setData({
				iWantToBuy: tmpIWantToBuy
			});
		}
		else {
			//取消全选
			that.setData({
				allSelected: false
			});
			var tmpIWantToBuy = that.data.iWantToBuy;
			for (var i = 0; i < that.data.iWantToBuy.length; i++) {
				tmpIWantToBuy[i].active = false;
			}
			that.setData({
				iWantToBuy: tmpIWantToBuy
			});
		}
		that.caculateTotalPrice();
		that.isNoSelect();
		that.isAllSelected();
	},

	//联系卖家
	contactSeller: function () {

	},

	//由买家确认被选中的商品已完成交易
	completeTransactions: function () {
		var that = this;
		var tmpIWantToBuy = [];
		var tmpIWantToBuy_2 = [];
		for (var i = 0; i < that.data.iWantToBuy.length; i++) {
			if (!that.data.iWantToBuy[i].active) {
				tmpIWantToBuy.push(that.data.iWantToBuy[i]);
			}
			else {
				tmpIWantToBuy_2.push(that.data.iWantToBuy[i]);
			}
		}
		if (tmpIWantToBuy_2.length != 0) {
			wx.showModal({
				title: '提示',
				content: '您确定交易已完成吗？',
				success: function (res) {
					/*
					该部分为确认交易完成的demo
					实际使用需要对数据库商品表进行修改
					*/
					if (res.confirm) {
						that.setData({
							iWantToBuy: tmpIWantToBuy,
							iWantToBuyLength: tmpIWantToBuy.length
						});
						that.caculateTotalPrice();
						that.isNoSelect();
						that.isAllSelected();
					}
				}
			});
		}
		else {
			wx.showModal({
				title: '提示',
				content: '未选中任何收藏商品。'
			})
		}
	},

	toIndexPage: function () {
		wx.switchTab({
			url: '../../pages/index/index'
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		let Bmob = app.globalData.Bmob;
		const db = Bmob.Query("goods");
		db.equalTo("buyer", "==", app.globalData.userOpenId);
		db.equalTo("state", "==", 1);
		db.order("updatedAt");
		db.find().then(res => {
			that.setData({ iWantToBuyLength: res.length });
			for (let i = 0; i < res.length; ++i) {
				let iWantToBuy = that.data.iWantToBuy;
				iWantToBuy[i] = res[i];
				iWantToBuy[i]["active"] = false;
				const dbImg = Bmob.Query("goodsImgs");
				dbImg.equalTo("goodsObjectId", "==", iWantToBuy[i].objectId); 
				dbImg.order("createdAt");
				dbImg.limit(1);
				dbImg.find().then(goodsImgsTbl => {
					let imgUrl = goodsImgsTbl[0]["img"]["url"];
					iWantToBuy[i]["img"] = imgUrl;
					that.setData({
						iWantToBuy: iWantToBuy,
					});
				});
			}
		});
		that.setData({
			userInfo: app.globalData.userInfo,
		});

		//计算收藏商品总价
		that.caculateTotalPrice();
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