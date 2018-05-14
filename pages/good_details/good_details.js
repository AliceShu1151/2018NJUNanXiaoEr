//获取小程序实例
var app = getApp();

Page({
  data: {
    businessId: '',
    //此处good_data只是一个demo
    good_data: {
      name: '香水',
      price: '200',
      viewTimes: '12',
      seller: '',
      describe_text: 'qwiuyewq yesh  qe wqoue wqoe ',
      pics: ['../../images/goods01.png', '../../images/goods02.png']
    },
    userInfo: {}
  },
  onLoad: function (options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    that.setData({
      businessId: options.businessId,
      userInfo: app.globalData.userInfo
    });
    //console.log(that.data.userInfo);

    /*
    此处编写函数来获取data中的good_data
    这是一个object类型的变量
    他的properties有名称、文字描述、图片等
    */
  },
})