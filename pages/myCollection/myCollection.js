// pages/myCollection/myCollection.js
let app = getApp();
let Bmob = app.globalData.Bmob;

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
		let that = this;

		that.setData({
			saveHidden: true
		});

		//取消全选
		that.setData({
			allSelected: false
		});
		let tmpCollection = that.data.myCollection;
		for (let i = 0; i < that.data.myCollection.length; i++) {
			tmpCollection[i].active = false;
		}
		that.setData({
			myCollection: tmpCollection,
		});
		that.caculateTotalPrice();
		that.isNoSelect();
		that.isAllSelected();
	},

	//计算收藏商品总价，页面加载时调用
	caculateTotalPrice: function () {
		let that = this;
		let total = 0;
		for (let i = 0; i < that.data.myCollection.length; i++) {
			if (that.data.myCollection[i].active) {
				total = total + that.data.myCollection[i].price;
			}
		}
		that.setData({
			totalPrice: total
		});
	},

	//判断有无被选中的商品对象
	isNoSelect: function () {
		let that = this;
		for (let i = 0; i < that.data.myCollection.length; i++) {
			if (that.data.myCollection[i].active) {
				that.setData({
					noSelect: false
				});
				return;
			}
			else {
				that.setData({
					allSelected: false
				});
			}
		}
		that.setData({
			noSelect: true,
		});
	},

	//判断是否为全选状态
	isAllSelected: function () {
		let that = this;
		for (let i = 0; i < that.data.myCollection.length; i++) {
			if (!that.data.myCollection[i].active) {
				that.setData({
					allSelected: false
				});
				return;
			}
		}
		that.setData({
			allSelected: true
		});
		//console.log(this.data.allSelected);
	},

	//单独选择
	/*
	yhr 5-16：
	在将可选中物品置入待购买列表的状态时，无法选中已被自己或他人置入待购买列表的商品
	但在编辑状态下仍可选中并删除
	*/
	selectTap: function (e) {
		//console.log(e.currentTarget.id);
		let that = this;
		let tmpCollection = that.data.myCollection;
		//5-16 主要在第一个判断语句内进行了修改
		if (!tmpCollection[e.currentTarget.id].active) {
			if (tmpCollection[e.currentTarget.id].state == 0 && that.data.saveHidden) {
				tmpCollection[e.currentTarget.id].active = true;
			}
			else if (tmpCollection[e.currentTarget.id].state != 0 && that.data.saveHidden) {
				wx.showModal({
					title: '提示',
					content: '存在收藏商品已被你或他人置入待购买队列，您无法选中。但在编辑状态下，您可将其选中并移出收藏列表。',
				});
			}
			else if (!that.data.saveHidden) {
				tmpCollection[e.currentTarget.id].active = true;
			}
		}
		else {
			tmpCollection[e.currentTarget.id].active = false;
		}
		that.setData({
			myCollection: tmpCollection,
		});
		that.caculateTotalPrice();
		that.isNoSelect();
		that.isAllSelected();
	},

	//全选
	/*
	yhr 5-16:
	在将可选中物品置入待购买列表的状态时，无法选中已被自己或他人置入待购买列表的商品
	但在编辑状态下仍可选中并删除
	*/
	bindAllSelect: function () {
		let that = this;
		//count用于判断收藏列表中是否有已被置于待够列表的商品
		let count = 0;
		if (!that.data.allSelected) {
			//全选
			that.setData({
				allSelected: true
			});
			let tmpCollection = that.data.myCollection;
			for (let i = 0; i < that.data.myCollection.length; i++) {
				//同上个单选函数，也在第一个if语句进行修改
				if (that.data.saveHidden && that.data.myCollection[i].state == 0) {
					tmpCollection[i].active = true;
				}
				else if (that.data.saveHidden && that.data.myCollection[i].state != 0) {
					count += 1;
				}
				else if (!that.data.saveHidden) {
					tmpCollection[i].active = true;
				}
			}
			if (count >= 1) {
				wx.showModal({
					title: '提示',
					content: '存在收藏商品已被你或他人置入待购买队列，您无法选中。但在编辑状态下，您可将其选中并移出收藏列表。',
				})
			}
			that.setData({
				myCollection: tmpCollection,
			});
		}
		else {
			//取消全选
			that.setData({
				allSelected: false
			});
			let tmpCollection = that.data.myCollection;
			for (let i = 0; i < that.data.myCollection.length; i++) {
				tmpCollection[i].active = false;
			}
			that.setData({
				myCollection: tmpCollection,
			});
		}
		that.caculateTotalPrice();
		that.isNoSelect();
		that.isAllSelected();
	},

	//删除被选中的商品
	deleteSelected: function () {
		let that = this;
		let tmpCollection = [];
		let tmpCollection_2 = [];
		for (let i = 0; i < that.data.myCollection.length; i++) {
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
					/**yx: 5-16
					 * 删除功能实现
					 */
					if (res.confirm) {
						const db = Bmob.Query("stars");
						let goodsVec = new Array();
						for (let i = 0; i < tmpCollection_2.length; ++i) {
							goodsVec[i] = tmpCollection_2[i]["objectId"];
						}
						//console.log(goodsVec);
						//console.log(tmpCollection_2);
						db.equalTo("userOpenId", "==", app.globalData.userOpenId);
						db.containedIn("goodsObjectId", goodsVec);
						db.find().then(res => {
							res.destroyAll();
						});
						that.setData({
							myCollection: tmpCollection,
							myCollectionLength: tmpCollection.length
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

	wantToBuy: function () {
		let that = this;
		let tmpCollection = [];
		//tmpCollection_2存储被选中的商品信息
		let tmpCollection_2 = [];
		for (let i = 0; i < that.data.myCollection.length; i++) {
			if (that.data.myCollection[i].active) {
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
						const db = Bmob.Query("goods");
						let goodsVec = new Array();
						for (let i = 0; i < tmpCollection_2.length; ++i) {
							goodsVec[i] = tmpCollection_2[i]["objectId"];
						}
						db.containedIn("objectId", goodsVec);
						db.find().then(res => {
							res.set("state", 1);
							res.set("buyer", app.globalData.userOpenId);
							res.saveAll();
							let starredVec = new Array();
							let myCollection = that.data.myCollection;
							for (let i = 0; i < myCollection.length; ++i){
								starredVec.push(myCollection[i].objectId);
							}
							/**岳翔5-17
							 * 购买后重新渲染我的收藏
							 */
							db.containedIn("objectId", starredVec);
							db.order("-updatedAt");
							db.find().then(res => {
								for (let i = 0; i < myCollection.length; ++i) {
									myCollection[i].state = res[i].state;
								}
								that.setData({ myCollection: myCollection });
							});
						});

            /*
            yhr 5-17
            点击我想购买后直接进入我想购买的页面
            */
            wx.redirectTo({
              url: '../../pages/iWantToBuy/iWantToBuy',
            });
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
		//console.log(app.globalData.userInfo);
		that.setData({
			userInfo: app.globalData.userInfo
		});
		const db = Bmob.Query("stars");
		db.equalTo("userOpenId", "==", app.globalData.userOpenId);
		db.order("-createdAt");
		db.find().then(res => {
			that.setData({ myCollectionLength: res.length });
			for (let i = 0; i < res.length; ++i) {
				let myCollection = that.data.myCollection;
				const db = Bmob.Query("goods");
				let goodsObjectId = res[i]["goodsObjectId"];
				db.equalTo("objectId", "==", goodsObjectId);
				db.find().then(res => {
					myCollection[i] = res[0];
					myCollection[i]["active"] = false;
					const db = Bmob.Query("goodsImgs");
					db.equalTo("goodsObjectId", "==", goodsObjectId); //此时timestamp是string。。。等哪天改objectID就没这么麻烦了
					db.order("createdAt");
					db.limit(1);
					db.find().then(goodsImgsTbl => {
						let imgUrl = goodsImgsTbl[0]["imgUrl"];
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

})