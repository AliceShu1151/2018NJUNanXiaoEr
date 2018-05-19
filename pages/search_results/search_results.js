let app = getApp();
let Bmob = app.globalData.Bmob;

Page({
	data: {
		searchInput: '',
		goods: [],
		remind: '加载中'
	},

	onLoad: function (options) {
		// 页面初始化 options为页面跳转所带来的参数
		let that = this;
		that.data.searchInput = options.searchInput;
		that.fetchGoods(options.searchInput);
		//console.log(this.data.searchInput);
	},

	/*
	在此处编写从数据库查询数据的方法
	在回调函数中对goods、remind进行设置
	（remind: ''，将remind变为空字符串）
	remind为控制加载动画关闭的参数
	*/
	fetchGoods: function (input) {
		let that = this;
		let db = Bmob.Query("goods");
		db.order("-createdAt");
		db.find().then(res => {
			let goods = new Array();
			for(let item of res){
				if(item.name.indexOf(input) != -1){
					goods.push(item);
				}
			}
			that.setData({
				goods: goods,
				remind: "",
			});
		});
	},

	toDetailsTap: function (e) {
		//跳转至商品详情页
		wx.navigateTo({
			url: "/pages/good_details/good_details?businessId=" + e.currentTarget.id,
		})
	},
})