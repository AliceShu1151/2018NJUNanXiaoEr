//index.js
//获取应用实例
var app = getApp()
let Bmob = app.globalData.Bmob;

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

	onPullDownRefresh: function() {
		wx.stopPullDownRefresh();
		wx.reLaunch({
			url: '../../pages/index/index',
		})
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
		let db = Bmob.Query("goods");
		db.limit(4); //banners数量
		db.order("-clicks");
		db.find().then(res => {
			let banners = res;
			//console.log(banners);
			that.setData({ banners: banners });
		});
	},

	//商品加载
	getGoodsList: function (categoryId) {
		/**
		 * 岳翔 5-18：
		 * 图片获取机制更新
		 */
		let that = this;
		let categoryNameList = new Array("全部", "化妆品", "服饰装扮", "食品饮料", "演出门票", "数码电子", "其他");
		let	categoryName = categoryNameList[categoryId];

		let db = Bmob.Query("goods");
		if(categoryName != "全部"){
			db.equalTo("category", "==", categoryName);
		}
		db.equalTo("state", "!=", 2);
		db.order("-createdAt");
		db.find().then(res => {
			let goods = res;
			that.setData({ goods: goods });
		});
	},
})