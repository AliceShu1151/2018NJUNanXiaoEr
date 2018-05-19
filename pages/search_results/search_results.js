Page({
  data: {
    searchInput: '',
	goods: [{name: '香水1', imgUrl: '../../images/goods01.png', price: 200, objectId: 0},
		{ name: '香水2', imgUrl: '../../images/goods02.png', price: 300, objectId: 1}
	],
	remind: '加载中'
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
	let that = this;
    that.setData({
      searchInput: options.searchInput
    });
	//console.log(this.data.searchInput);
  },

  toSearch: function() {
	  /*
	  在此处编写从数据库查询数据的方法
	  在回调函数中对goods、remind进行设置
	  （remind: ''，将remind变为空字符串）
	  remind为控制加载动画关闭的参数
	  */
  },

  toDetailsTap: function (e) {
	  //跳转至商品详情页
	  wx.navigateTo({
		  url: "/pages/good_details/good_details?businessId=" + e.currentTarget.id
	  })
  },
})