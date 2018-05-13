Page({
  data: {
    businessId: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      businessId: options.businessId
    })
  },
})