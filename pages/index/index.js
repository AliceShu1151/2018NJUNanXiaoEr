//index.js
//获取应用实例
var app = getApp()

Page({
	data: {
		//数据初始化定义
		remind: '加载中',
		goods: {},
		banners: {},
		db: {},
		noticeList: {
			dataList: ['嘻嘻嘻', '嘤嘤嘤', '嘿嘿嘿']
		},
		categories: [
			{ id: 0, name: '全部' },
			{ id: 1, name: '化妆品' },
			{ id: 2, name: '服饰装扮' },
			{ id: 3, name: '食品饮料' },
			{ id: 4, name: '演出门票' },
			{ id: 5, name: '数码电子' },
			{ id: 6, name: '其他' }
		],
		indicatorDots: true,
		loadingHidden: false, // loading
		userInfo: {},
		swiperCurrent: 0,
		selectCurrent: 0,
		activeCategoryId: 0,
		scrollTop: "0",
		loadingMoreHidden: true,
		searchInput: '',
	},

	

	//页面加载时的初始化操作
	onLoad: function () {
		let that = this;
		//加载轮播图
		that.renderBanners();
		//加载全部商品
		that.getGoodsList(0);
	},

	//页面初次渲染完成后的操作
	onReady: function () {
		var that = this;
		//渲染完毕，关闭加载动画
		setTimeout(function () {
			that.setData({
				remind: ''
			});
		}, 1000);
	},

	//监听轮播图变换
	swiperchange: function (e) {
		//console.log(e.detail.current)
		this.setData({
			swiperCurrent: e.detail.current
		})
	},

	//点击轮播图事件监听，跳转至商品详情页面
	tapBanner: function (e) {
		wx.navigateTo({
			url: "/pages/good_details/good_details?businessId=" + e.currentTarget.id
		})
	},

	//获取用户在搜索框输入的内容
	listenerSearchInput: function (e) {
		this.setData({
			searchInput: e.detail.value
		})
		//console.log(this.data.searchInput);
	},

	//搜索函数，需要与服务器交互，待实现
	toSearch: function () {
		//获取搜索结果

		wx.navigateTo({
			url: "/pages/search_results/search_results?resultsList=" // + 搜索结果
		})
	},

	//商品种类栏点击事件监听，更新页面下部的商品信息
	tabClick: function (e) {
		this.setData({
			activeCategoryId: e.currentTarget.id
		});
		this.setData({ goods: null });
		this.getGoodsList(this.data.activeCategoryId);
	},

	//点击页面下部商品列表事件监听，跳转至商品详情页面
	toDetailsTap: function (e) {
		//console.log(e.currentTarget.id);
		wx.navigateTo({
			url: "/pages/good_details/good_details?businessId=" + e.currentTarget.id
		})
	},

	//轮播图渲染
	renderBanners: function() {
		let that = this;
		let Bmob = app.globalData.Bmob;
		const dbGoods = Bmob.Query("goods");
		dbGoods.limit(3); //banners数量
		dbGoods.find().then(function (goodsTbl) {
			let banners = goodsTbl;
			for (let i = 0; i < banners.length; ++i) {
				const dbImg = Bmob.Query("goodsImgs");
				let goodsObjectId = banners[i]["objectId"];
				dbImg.equalTo("goodsObjectId", "==", goodsObjectId);
				dbImg.order("createdAt");
				dbImg.limit(1);
				dbImg.find().then(function (goodsImgsTbl) {
					//console.log(goodsImgsTbl);
					let imgUrl = goodsImgsTbl[0]["imgUrl"];
					banners[i]["img"] = imgUrl;
					that.setData({ banners: banners });
				});
			}
		});
		
	},

	//商品加载
	getGoodsList: function (categoryId) {
		/**
		 * 岳翔 5-13：
		 * 测试demo
		 */
		let that = this;
		let Bmob = app.globalData.Bmob;
		const dbGoods = Bmob.Query("goods");
		let goods = that.data.goods;
		let categoryNameList = new Array("全部", "化妆品", "服饰装扮", "食品饮料", "演出门票", "数码电子", "其他");
		let	categoryName = categoryNameList[categoryId];
		
		if(categoryName != "全部"){
			dbGoods.equalTo("category", "==", categoryName);
		}
		dbGoods.find().then(goodsTbl => {
			goods = goodsTbl;
			//res此时是一个二维数组
			/**岳翔 5-14
			 * 注意：操作查询结果无法传值，只能在then()内进行操作
			 * 就算是传给外层变量也会是Undefined
			 * 与bmob异步查询机制有关（可以看到console.log不按顺序进行记录）
			 * */
			//打印总条数
			for (let i = 0; i < goods.length; ++i) {
				//每查询一次建一次Bmob对象
				const dbImg = Bmob.Query("goodsImgs");
				let goodsObjectId = goods[i]["objectId"]
				dbImg.equalTo("goodsObjectId", "==", goodsObjectId)
				dbImg.order("createdAt");
				dbImg.limit(1);
				dbImg.find().then(goodsImgsTbl => {
					//取第一条查询结果的第一个图片
					/**岳翔：5-14
					 * file文件如果存图片，查询结果有filename & url两者，只需取用url即可
					 * */
					let imgUrl = goodsImgsTbl[0]["imgUrl"];
					goods[i]["img"] = imgUrl;
					that.setData({ goods: goods }); //微信小程序唯一动态赋值方法
				});
			}
		});

		/**
		* 岳翔 5-13:
		* 非常重要的位置
		* 此处用于设置商品属性
		* 该数据会被用于列表循环中（详情见index.wxml的51-61行）
		*/
	}
})