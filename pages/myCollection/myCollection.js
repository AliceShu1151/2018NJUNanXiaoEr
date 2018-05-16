// pages/myCollection/myCollection.js
var app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		allSelected: false,
		saveHidden: true,
		userInfo: {},
		noSelect: true,
		/*
		myCollection是收藏夹商品信息的基本形式
		可将从数据库获取的商品信息放在baseInfo里
		baseInfo中的sbWantsToBuy代表着是否有人已经想购买这个商品了
		点击“我想购买”按钮后将此属性置位true，从收藏中删除，进入我想购买的页面
		active属性代表着是否被选中
		被选中则该商品会被勾选
		 */
		myCollection: [
			{active: false},
			//{ baseInfo: { businessId: 0, name: "QAQ", price: 200, pic: '../../images/goods01.png', clickTimes: 5, sbWantsToBuy: false }, active: false },
			//{ baseInfo: { businessId: 1, name: "QAQ", price: 200, pic: '../../images/goods02.png', clickTimes: 6, sbWantsToBuy: false }, active: false }
		],
		myCollectionLength: 5,
		totalPrice: ''
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
		for (var i = 0; i < that.data.myCollection.length; i++) {
			if (that.data.myCollection[i].active) {
				total = total + that.data.myCollection[i].baseInfo.price;
			}
		}
		that.setData({
			totalPrice: total
		});
	},

	//判断有无被选中的商品对象
	isNoSelect: function () {
		var that = this;
		for (var i = 0; i < that.data.myCollection.length; i++) {
			if (that.data.myCollection[i].active) {
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

	//单独选择
	selectTap: function (e) {
		//console.log(e.currentTarget.id);
		var that = this;
		var tmpCollection = that.data.myCollection;
		//console.log(tmpCollection[0].active);
		if (!tmpCollection[e.currentTarget.id].active) {
			tmpCollection[e.currentTarget.id].active = true;
		}
		else {
			tmpCollection[e.currentTarget.id].active = false;
		}
		that.setData({
			myCollection: tmpCollection,
		});
		that.caculateTotalPrice();
		that.isNoSelect();
	},

	//全选
	bindAllSelect: function () {
		var that = this;
		if (!that.data.allSelected) {
			//全选
			that.setData({
				allSelected: true
			});
			var tmpCollection = that.data.myCollection;
			for (var i = 0; i < that.data.myCollection.length; i++) {
				tmpCollection[i].active = true;
			}
			that.setData({
				myCollection: tmpCollection,
			});
			that.caculateTotalPrice();
			that.isNoSelect();
		}
		else {
			//取消全选
			that.setData({
				allSelected: false
			});
			var tmpCollection = that.data.myCollection;
			for (var i = 0; i < that.data.myCollection.length; i++) {
				tmpCollection[i].active = false;
			}
			that.setData({
				myCollection: tmpCollection,
			});
			that.caculateTotalPrice();
			that.isNoSelect();
		}
	},

	//删除被选中的商品
	deleteSelected: function () {
		var that = this;
		var tmpCollection = [];
		var tmpCollection_2 = [];
		for (var i = 0; i < that.data.myCollection.length; i++) {
			if (!that.data.myCollection[i].active) {
				tmpCollection.push(that.data.myCollection[i]);
			}
			else {
				tmpCollection_2.push(that.data.myCollection[i]);
			}
		}
		if (tmpCollection_2.length != 0) {
			wx.showModal({
				title: '提示',
				content: '您确定要删除选中的收藏商品吗？',
				success: function (res) {
					/*
					该部分为删除收藏商品的demo
					实际使用需要对数据库商品表进行修改
					*/
					if (res.confirm) {
						that.setData({
							myCollection: tmpCollection,
							myCollectionLength: tmpCollection.length
						});
						that.caculateTotalPrice();
						that.isNoSelect();
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

	wantToBuy: function () {
		var that = this;
		var tmpCollection = [];
		var tmpCollection_2 = [];
		for (var i = 0; i < that.data.myCollection.length; i++) {
			if (!that.data.myCollection[i].active) {
				that.data.myCollection[i].baseInfo.sbWantsToBuy = true;
				tmpCollection.push(that.data.myCollection[i]);
			}
			else {
				tmpCollection_2.push(that.data.myCollection[i]);
			}
		}
		if (tmpCollection_2.length != 0) {
			wx.showModal({
				title: '提示',
				content: '点击确认后商品进入待购买队列，为了避免卖家损失，请尽快与卖家联系',
				success: function (res) {
					/*
					使用删除功能，
					模拟将收藏商品移入待购买列表
					此过程需要对商品表、用户收藏表进行修改
					*/
					if (res.confirm) {

						that.setData({
							myCollection: tmpCollection,
							myCollectionLength: tmpCollection.length
						});

						that.caculateTotalPrice();
						that.isNoSelect();
					}
				}
			});
		}
		else {
			wx.showModal({
				title: '提示',
				content: '未选中任何收藏商品。',
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
		const dbStars = Bmob.Query("stars");
		dbStars.equalTo("userOpenId", "==", app.globalData.openid);
		dbStars.order("-createdAt");
		dbStars.find().then(res => {
			that.setData({ myCollectionLength: res.length });
			for (let i = 0; i < res.length; ++i) {
				let myCollection = that.data.myCollection;
				const dbGoods = Bmob.Query("goods");
				let timeStamp = res[i]["goodsObjectId"];
				dbGoods.equalTo("timeStamp", "==", Number(timeStamp));
				dbGoods.find().then(res => {
					myCollection[i] = res[0];
					myCollection[i]["active"] = false;
					const dbImg = Bmob.Query("goodsImgs");
					dbImg.equalTo("goods", "==", Number(timeStamp)); //此时timestamp是string。。。等哪天改objectID就没这么麻烦了
					dbImg.order("createdAt");
					dbImg.limit(1);
					dbImg.find().then(goodsImgsTbl => {
						let imgUrl = goodsImgsTbl[0]["img"]["url"];
						myCollection[i]["img"] = imgUrl;
						that.setData({
							myCollection: myCollection,
						});
					});
				});
			}
		});

		//计算收藏商品总价
		that.caculateTotalPrice();
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