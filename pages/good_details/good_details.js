//获取小程序实例
var app = getApp();
let Bmob = app.globalData.Bmob;
/*
yhr 5-16:
data中添加canBuy
用于标识该物品能否被置位待购买商品
*/
Page({
	data: {
		canBuy: false,
		goodsObjectId: '',
		//此处goodsData只是一个demo
		goodsData: {},
		userInfo: {},
    swiperCurrent: 0
	},

	onLoad: function (options) {
		let that = this;
		// 页面初始化 options为页面跳转所带来的参数
		that.setData({
			goodsObjectId: options.businessId,
			userInfo: app.globalData.userInfo
		});
		//console.log(that.data.userInfo);

		/**岳翔 5-14：
		 * 数据库获取商品信息
		 */
		const db = Bmob.Query("goods");

		let goodsObjectId = that.data.goodsObjectId;

		db.equalTo("objectId", "==", goodsObjectId);
		db.find().then(goodsTbl => {
			//浏览量 + 1
			let clicks = goodsTbl[0]["clicks"];
			goodsTbl.set("clicks", clicks + 1);
			goodsTbl.saveAll();
			let goodsData = that.data.goodsData;
			goodsData = goodsTbl[0];
			that.setData({ goodsData: goodsData });
			const db = Bmob.Query("goodsImgs");
			db.equalTo("goodsObjectId", "==", goodsObjectId);
			db.find().then(res => {
				let goodsData = that.data.goodsData;
				let vec = new Array();
				for (let item of res) {
					vec.push(item.imgUrl);
				}
				goodsData["imgs"] = vec;
				that.setData({ goodsData: goodsData });
			});
			if (that.data.goodsData.state == 0) {
				that.setData({
					canBuy: true
				});
			}
		});
		/*
		此处编写函数来获取data中的goodsData
		这是一个object类型的变量
		他的properties有名称、文字描述、图片等
		*/
	},

  //监听轮播图变换
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
    console.log(e.detail.current);
  },

	/*
	 seller为用户的唯一标识
	 并传递到卖家信息页面
	 */
	toSellerInfo: function () {
		let that = this;
		console.log(that.data.goodsData.seller);
		wx.navigateTo({
			url: '../../pages/sellerInfo/sellerInfo?seller=' + that.data.goodsData.seller
		});
	},

	/*
	跳转到收藏页面
	不需要传参
	  */
	toMyCollection: function () {
		wx.navigateTo({
			url: '../../pages/myCollection/myCollection'
		});
	},

	/*
	把商品添加到个人收藏列表
	*/
	toAddCollection: function () {
		/*
		使用userInfo和goodsId查询收藏表
		检测是否收藏过
		若未收藏过则往表中添加数据
		*/
		/** 岳翔：5-16
		 * 实现db存取
		 */
		let that = this;
		let goodsObjectId = that.data.goodsObjectId;
		let userOpenId = app.globalData.userOpenId;
		const db = Bmob.Query("stars");
		db.equalTo("userOpenId", "==", userOpenId);
		db.find().then(res => {
			let isStarred = false;
			for (let i = 0; i < res.length; ++i) {
				if (res[i]["goodsObjectId"] == goodsObjectId) {
					isStarred = true;
					break;
				}
			}
			if (isStarred) {
				wx.showToast({
					title: '已存在于收藏栏',
					icon: 'success',
					duration: 1000,
				})
			}
			else {
				//console.log(userOpenId);
				//console.log(goodsObjectId);
				db.set("userOpenId", userOpenId);
				db.set("goodsObjectId", goodsObjectId);
				db.save();
				wx.showToast({
					title: '添加成功',
					icon: 'success',
					duration: 1000,
				})
			}
		});
	},

	/*
  yhr 5-16:
  若物品可被置为待购商品
	则将物品置为待购状态
	商品不会再被其他用户设为代购状态
	同时修改商品表中的属性及data中的canBuy
	*/
	toBuy: function () {
		let that = this;
		if (that.data.goodsData.state == 1) {
			//console.log(that.data.goodsData.state);
			wx.showModal({
				title: '提示',
				content: '该商品处于交易状态，无法加入您想购买的商品列表~',
			});
		}
		else if (that.data.goodsData.state == 2) {
			wx.showModal({
				title: '提示',
				content: '该商品已卖出',
			});
		}
		else {
			wx.showModal({
				title: '提示',
				content: '点击“我想购买”后，该商品将无法被其他用户购买，请务必尽快与卖家联系。',
				success: function (res) {
					if (res.confirm) {
						//对商品表进行修改
						//并跳转至卖家信息页
						/**岳翔 5-16
						 * 与数据库联动
						 */
						db.get(that.data.goodsObjectId).then(res => {
							res.set("state", 1);
							res.set("buyer", app.globalData.userOpenId);
							res.save();
						});
            /*
            yhr 5-18:
            实现思路：
            如商品处于可购买状态
            点击我想购买，会将页面更改至卖家信息（不是跳转，是重新加载）
            由于目前没有写卖家信息
            所以该功能无效
            因此在商品详情页点击我想购买后购买按钮仍有效
            ………………………………
            db没有定义
            */
						wx.redirectTo({
							url: '../../pages/sellerInfo/sellerInfo?seller=' + that.data.goodsData.seller
						});
						that.setData({
							canBuy: false
						});
					}
				}
			})
		}
	}
})